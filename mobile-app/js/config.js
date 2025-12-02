// VeriScript Firebase Configuration
// Replace these values with your Firebase project credentials

const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Analytics (optional)
if (firebaseConfig.measurementId) {
  firebase.analytics();
}

// OpenAI Configuration (Optional - for voice features)
const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY_HERE";

// App Configuration
const APP_CONFIG = {
  version: '1.0.0',
  environment: 'production',
  apiTimeout: 30000,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  supportedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  supportedDocTypes: ['application/pdf']
};

console.log('✅ Firebase Config loaded');
console.log('📱 VeriScript v' + APP_CONFIG.version);
