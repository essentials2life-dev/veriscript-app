// VeriScript Voice Dictation Module
// Complete implementation of AI-powered voice dictation

class VoiceManager {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.fullTranscript = '';
    this.interimTranscript = '';
    this.onTranscriptUpdate = null;
    this.onFinalTranscript = null;
    this.onError = null;
    this.onStatusChange = null;
    
    this.initRecognition();
  }
  
  // Initialize Speech Recognition
  initRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Speech recognition not supported');
      return false;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    // Configure recognition
    this.recognition.continuous = APP_CONFIG.voice.continuous;
    this.recognition.interimResults = APP_CONFIG.voice.interimResults;
    this.recognition.lang = APP_CONFIG.voice.language;
    this.recognition.maxAlternatives = APP_CONFIG.voice.maxAlternatives;
    
    // Event handlers
    this.recognition.onstart = () => {
      this.isListening = true;
      this.updateStatus('listening', '🎤 Listening...', 'Speak now');
      console.log('Voice recognition started');
    };
    
    this.recognition.onresult = (event) => {
      this.interimTranscript = '';
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          this.interimTranscript += transcript;
        }
      }
      
      if (finalTranscript) {
        this.fullTranscript += finalTranscript;
      }
      
      // Callback for transcript updates
      if (this.onTranscriptUpdate) {
        this.onTranscriptUpdate(this.fullTranscript, this.interimTranscript);
      }
    };
    
    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      this.updateStatus('error', '❌ Error', this.getErrorMessage(event.error));
      
      if (this.onError) {
        this.onError(event.error);
      }
    };
    
    this.recognition.onend = () => {
      this.isListening = false;
      
      if (this.fullTranscript) {
        this.updateStatus('ready', '✓ Ready to process', 'Click Process button');
        
        if (this.onFinalTranscript) {
          this.onFinalTranscript(this.fullTranscript);
        }
      } else {
        this.updateStatus('idle', '🎤 Ready', 'Click to start');
      }
      
      console.log('Voice recognition ended');
    };
    
    return true;
  }
  
  // Start listening
  start() {
    if (!this.recognition) {
      console.error('Speech recognition not initialized');
      return false;
    }
    
    if (this.isListening) {
      console.warn('Already listening');
      return false;
    }
    
    try {
      this.fullTranscript = '';
      this.interimTranscript = '';
      this.recognition.start();
      return true;
    } catch (error) {
      console.error('Error starting recognition:', error);
      return false;
    }
  }
  
  // Stop listening
  stop() {
    if (!this.recognition || !this.isListening) {
      return false;
    }
    
    try {
      this.recognition.stop();
      return true;
    } catch (error) {
      console.error('Error stopping recognition:', error);
      return false;
    }
  }
  
  // Reset
  reset() {
    this.fullTranscript = '';
    this.interimTranscript = '';
    this.stop();
  }
  
  // Get current transcript
  getTranscript() {
    return {
      full: this.fullTranscript,
      interim: this.interimTranscript,
      combined: this.fullTranscript + this.interimTranscript
    };
  }
  
  // Update status
  updateStatus(state, icon, text) {
    if (this.onStatusChange) {
      this.onStatusChange(state, icon, text);
    }
  }
  
  // Get error message
  getErrorMessage(error) {
    const errorMessages = {
      'no-speech': 'No speech detected. Please try again.',
      'audio-capture': 'Microphone not found. Please check your device.',
      'not-allowed': 'Microphone access denied. Please allow microphone access.',
      'network': 'Network error. Please check your connection.',
      'aborted': 'Speech recognition aborted.',
      'language-not-supported': 'Language not supported.',
      'service-not-allowed': 'Speech recognition service not allowed.'
    };
    
    return errorMessages[error] || 'An error occurred. Please try again.';
  }
  
  // Process transcript with AI
  async processWithAI(transcript) {
    if (!transcript || transcript.trim().length === 0) {
      throw new Error('No transcript to process');
    }
    
    this.updateStatus('processing', '⏳ Processing...', 'AI is analyzing your speech');
    
    try {
      const extractedData = await this.extractPrescriptionData(transcript);
      this.updateStatus('success', '✓ Success', 'Prescription data extracted');
      return extractedData;
    } catch (error) {
      this.updateStatus('error', '❌ Error', 'Failed to process transcript');
      throw error;
    }
  }
  
  // Extract prescription data using GPT-4
  async extractPrescriptionData(transcript) {
    const prompt = `You are a medical prescription assistant. Extract structured data from this doctor's dictation:

"${transcript}"

Return ONLY valid JSON with this exact structure (no markdown, no code blocks, no extra text):
{
  "patient": {
    "name": "string (full name)",
    "age": number,
    "gender": "Male/Female/Other"
  },
  "diagnosis": "string (primary diagnosis)",
  "medicines": [
    {
      "name": "string (medicine name without dosage)",
      "dosage": "string (e.g., 500mg, 2mg, 10ml)",
      "frequency": "string (Once daily/Twice daily/Thrice daily/Four times daily/As needed)",
      "timing": "string (Before meals/After meals/With meals/Empty stomach/Before sleep/Anytime)",
      "duration": "string (e.g., 5 days, 1 month, 3 months)",
      "morning": number (0, 1, or 2 - tablets in morning),
      "afternoon": number (0, 1, or 2 - tablets in afternoon),
      "night": number (0, 1, or 2 - tablets in night),
      "instructions": "string (additional instructions)"
    }
  ],
  "notes": "string (additional notes or advice)",
  "followUp": "string (follow-up instructions, e.g., '1 week', '2 months')"
}

IMPORTANT RULES:
1. Extract medicine name and dosage separately
2. Convert frequency to morning-afternoon-night format:
   - "once daily" → Determine based on timing (morning/afternoon/night)
   - "twice daily" → 1-0-1 (morning and night)
   - "thrice daily" → 1-1-1 (morning, afternoon, night)
   - "four times daily" → Use morning=1, afternoon=1, night=2
3. If timing not specified, default to "After meals"
4. If duration not specified, default to "5 days"
5. If patient details missing, use null for those fields
6. Return ONLY the JSON object, no other text or formatting`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: APP_CONFIG.voice.aiModel,
          messages: [
            {
              role: 'system',
              content: 'You are a medical prescription assistant. Always return valid JSON only, no markdown or code blocks.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: APP_CONFIG.voice.aiTemperature,
          max_tokens: 2000
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'OpenAI API error');
      }
      
      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Remove markdown code blocks if present
      const jsonString = content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      // Parse and validate JSON
      const extractedData = JSON.parse(jsonString);
      
      // Validate structure
      if (!extractedData.patient && !extractedData.medicines) {
        throw new Error('Invalid data structure');
      }
      
      return extractedData;
      
    } catch (error) {
      console.error('Error extracting prescription data:', error);
      throw new Error('Failed to process voice input. Please try again or fill manually.');
    }
  }
  
  // Alternative: Use Google Cloud Speech-to-Text (if configured)
  async transcribeWithGoogle(audioBlob) {
    // This requires Google Cloud Speech-to-Text API setup
    // Implementation would go here
    throw new Error('Google Speech-to-Text not configured');
  }
  
  // Alternative: Use OpenAI Whisper (if configured)
  async transcribeWithWhisper(audioBlob) {
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');
      formData.append('model', 'whisper-1');
      formData.append('language', 'en');
      
      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Whisper API error');
      }
      
      const data = await response.json();
      return data.text;
      
    } catch (error) {
      console.error('Error with Whisper transcription:', error);
      throw error;
    }
  }
}

// Voice UI Manager
class VoiceUI {
  constructor(voiceManager) {
    this.voiceManager = voiceManager;
    this.modal = null;
    this.transcriptElement = null;
    this.statusIconElement = null;
    this.statusTextElement = null;
    this.waveformElement = null;
    
    this.setupCallbacks();
  }
  
  // Setup callbacks
  setupCallbacks() {
    this.voiceManager.onTranscriptUpdate = (full, interim) => {
      this.updateTranscript(full, interim);
    };
    
    this.voiceManager.onStatusChange = (state, icon, text) => {
      this.updateStatus(state, icon, text);
    };
    
    this.voiceManager.onError = (error) => {
      this.showError(error);
    };
  }
  
  // Open voice modal
  open() {
    this.modal = document.getElementById('voiceModal');
    if (!this.modal) {
      console.error('Voice modal not found');
      return;
    }
    
    this.transcriptElement = document.getElementById('transcriptText');
    this.statusIconElement = document.getElementById('statusIcon');
    this.statusTextElement = document.getElementById('statusText');
    this.waveformElement = document.getElementById('waveform');
    
    this.modal.classList.add('active');
    this.voiceManager.start();
  }
  
  // Close voice modal
  close() {
    if (this.modal) {
      this.modal.classList.remove('active');
    }
    this.voiceManager.stop();
    this.voiceManager.reset();
  }
  
  // Update transcript display
  updateTranscript(full, interim) {
    if (!this.transcriptElement) return;
    
    const combined = full + (interim ? `<span style="color: #94a3b8;">${interim}</span>` : '');
    this.transcriptElement.innerHTML = combined || 'Listening...';
  }
  
  // Update status display
  updateStatus(state, icon, text) {
    if (this.statusIconElement) {
      this.statusIconElement.textContent = icon;
    }
    
    if (this.statusTextElement) {
      this.statusTextElement.textContent = text;
    }
    
    if (this.waveformElement) {
      if (state === 'listening') {
        this.waveformElement.style.display = 'flex';
      } else {
        this.waveformElement.style.display = 'none';
      }
    }
  }
  
  // Show error
  showError(error) {
    if (window.utils && window.utils.showToast) {
      window.utils.showToast(this.voiceManager.getErrorMessage(error), 'error');
    } else {
      alert(this.voiceManager.getErrorMessage(error));
    }
  }
  
  // Process and fill form
  async processAndFill() {
    const transcript = this.voiceManager.getTranscript();
    
    if (!transcript.full || transcript.full.trim().length === 0) {
      this.showError('no-speech');
      return;
    }
    
    try {
      // Show loading
      if (window.utils && window.utils.showLoader) {
        window.utils.showLoader();
      }
      
      // Process with AI
      const extractedData = await this.voiceManager.processWithAI(transcript.full);
      
      // Fill form
      if (window.fillFormWithVoiceData) {
        window.fillFormWithVoiceData(extractedData);
      }
      
      // Close modal
      this.close();
      
      // Show success
      if (window.utils && window.utils.showToast) {
        window.utils.showToast('Prescription filled from voice!', 'success');
      }
      
      // Hide loading
      if (window.utils && window.utils.hideLoader) {
        window.utils.hideLoader();
      }
      
    } catch (error) {
      console.error('Error processing voice:', error);
      
      if (window.utils && window.utils.showToast) {
        window.utils.showToast(error.message || 'Error processing voice', 'error');
      }
      
      if (window.utils && window.utils.hideLoader) {
        window.utils.hideLoader();
      }
    }
  }
}

// Initialize voice system
let voiceManager = null;
let voiceUI = null;

function initVoiceSystem() {
  if (!APP_CONFIG.features.voiceDictation) {
    console.log('Voice dictation feature disabled');
    return false;
  }
  
  voiceManager = new VoiceManager();
  voiceUI = new VoiceUI(voiceManager);
  
  console.log('✅ Voice system initialized');
  return true;
}

// Global functions for voice control
function openVoiceModal() {
  if (!voiceUI) {
    initVoiceSystem();
  }
  
  if (voiceUI) {
    voiceUI.open();
  }
}

function closeVoiceModal() {
  if (voiceUI) {
    voiceUI.close();
  }
}

function stopListening() {
  if (voiceManager) {
    voiceManager.stop();
  }
}

function processVoice() {
  if (voiceUI) {
    voiceUI.processAndFill();
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { VoiceManager, VoiceUI, initVoiceSystem };
}

console.log("✅ Voice Module Loaded");
