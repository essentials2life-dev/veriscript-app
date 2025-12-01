# 📱 VeriScript Mobile Application

## 🎯 **Complete Production-Ready Mobile App**

This is a Progressive Web App (PWA) that works on all mobile devices with native-like features.

---

## 📁 **Project Structure**

```
mobile-app/
├── index.html                      # Landing page
├── manifest.json                   # PWA manifest
├── service-worker.js              # Offline support
├── firebase.json                  # Firebase config
│
├── css/
│   ├── variables.css              # CSS variables
│   ├── reset.css                  # CSS reset
│   ├── base.css                   # Base styles
│   ├── components.css             # Reusable components
│   ├── animations.css             # Animations
│   └── responsive.css             # Mobile responsive
│
├── js/
│   ├── config.js                  # Firebase & app config
│   ├── firebase-init.js           # Firebase initialization
│   ├── auth.js                    # Authentication
│   ├── database.js                # Firestore operations
│   ├── storage.js                 # Firebase storage
│   ├── voice.js                   # Voice dictation
│   ├── prescription.js            # Prescription logic
│   ├── qr-code.js                 # QR code generation
│   ├── utils.js                   # Utility functions
│   └── app.js                     # Main app logic
│
├── pages/
│   ├── auth/
│   │   ├── login.html             # Doctor login
│   │   ├── register.html          # Doctor registration
│   │   └── forgot-password.html   # Password reset
│   │
│   ├── doctor/
│   │   ├── dashboard.html         # Doctor dashboard
│   │   ├── create-prescription.html  # Create prescription
│   │   ├── prescriptions.html     # Prescription list
│   │   ├── patients.html          # Patient management
│   │   ├── profile.html           # Doctor profile
│   │   └── settings.html          # Settings
│   │
│   ├── patient/
│   │   ├── view-prescription.html # View prescription
│   │   ├── prescriptions.html     # Patient prescriptions
│   │   └── profile.html           # Patient profile
│   │
│   └── chemist/
│       ├── verify.html            # Verify prescription
│       ├── dashboard.html         # Chemist dashboard
│       └── history.html           # Dispensing history
│
├── assets/
│   ├── icons/                     # App icons
│   ├── images/                    # Images
│   └── fonts/                     # Custom fonts
│
└── docs/
    ├── SETUP.md                   # Setup instructions
    ├── API.md                     # API documentation
    └── DEPLOYMENT.md              # Deployment guide
```

---

## 🚀 **Quick Start**

### **1. Clone Repository**
```bash
git clone https://github.com/essentials2life-dev/veriscript-app.git
cd veriscript-app/mobile-app
```

### **2. Install Dependencies**
```bash
npm install -g firebase-tools
npm install
```

### **3. Configure Firebase**
```bash
# Edit js/config.js with your Firebase credentials
# Get credentials from Firebase Console
```

### **4. Run Locally**
```bash
firebase serve
# Open http://localhost:5000
```

### **5. Deploy**
```bash
firebase deploy
```

---

## 📱 **Features**

### **Core Features**
- ✅ Progressive Web App (PWA)
- ✅ Offline support
- ✅ Push notifications
- ✅ Install to home screen
- ✅ Native-like experience

### **Doctor Features**
- ✅ Voice dictation (AI-powered)
- ✅ Create prescriptions (30 seconds)
- ✅ Patient management
- ✅ Prescription history
- ✅ Analytics dashboard
- ✅ QR code generation

### **Patient Features**
- ✅ View prescriptions
- ✅ Download PDF
- ✅ Share via WhatsApp
- ✅ Medication reminders
- ✅ Medical history

### **Chemist Features**
- ✅ QR code scanning
- ✅ Prescription verification
- ✅ Dispensing history
- ✅ Fraud detection

---

## 🛠️ **Technology Stack**

### **Frontend**
- HTML5
- CSS3 (Custom properties, Grid, Flexbox)
- JavaScript (ES6+)
- Progressive Web App (PWA)

### **Backend**
- Firebase Authentication
- Cloud Firestore
- Firebase Storage
- Firebase Cloud Functions
- Firebase Hosting

### **AI/ML**
- OpenAI GPT-4 (Voice processing)
- Web Speech API (Voice recognition)
- Google Cloud Speech-to-Text (Optional)

### **Libraries**
- QRCode.js (QR code generation)
- html2canvas (Screenshot)
- jsPDF (PDF generation)
- Chart.js (Analytics)

---

## 📊 **Database Schema**

### **Users Collection**
```javascript
users/{userId}
├── email: string
├── name: string
├── role: "doctor" | "patient" | "chemist"
├── phone: string
├── createdAt: timestamp
└── profile: {
    specialization: string (doctor)
    licenseNumber: string (doctor)
    clinic: string (doctor)
    address: string
    city: string
    state: string
}
```

### **Prescriptions Collection**
```javascript
prescriptions/{prescriptionId}
├── doctorId: string
├── patientId: string
├── patientName: string
├── patientAge: number
├── patientGender: string
├── diagnosis: string
├── medicines: array[{
│   name: string
│   dosage: string
│   frequency: string
│   duration: string
│   instructions: string
}]
├── notes: string
├── followUp: string
├── qrCode: string
├── status: "active" | "dispensed" | "expired"
├── createdAt: timestamp
└── updatedAt: timestamp
```

### **Voice Usage Collection**
```javascript
voiceUsage/{usageId}
├── userId: string
├── transcriptLength: number
├── processingTime: number
├── success: boolean
├── cost: number
└── timestamp: timestamp
```

---

## 🔒 **Security**

### **Firestore Rules**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Prescriptions
    match /prescriptions/{prescriptionId} {
      allow read: if true; // Public read for patients
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.doctorId;
    }
  }
}
```

### **Storage Rules**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /prescriptions/{prescriptionId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 📱 **PWA Features**

### **Offline Support**
- Service worker caches all assets
- Works without internet
- Syncs when online

### **Install to Home Screen**
- Add to home screen prompt
- Native app icon
- Splash screen
- Full-screen mode

### **Push Notifications**
- Prescription reminders
- Follow-up alerts
- New features

---

## 🎨 **Design System**

### **Colors**
```css
--primary: #667eea
--secondary: #764ba2
--success: #10b981
--error: #ef4444
--warning: #f59e0b
--info: #3b82f6
```

### **Typography**
```css
--font-family: 'Inter', sans-serif
--font-size-xs: 0.75rem
--font-size-sm: 0.875rem
--font-size-base: 1rem
--font-size-lg: 1.125rem
--font-size-xl: 1.25rem
```

### **Spacing**
```css
--spacing-xs: 0.25rem
--spacing-sm: 0.5rem
--spacing-md: 1rem
--spacing-lg: 1.5rem
--spacing-xl: 2rem
```

---

## 📈 **Performance**

### **Optimization**
- Lazy loading images
- Code splitting
- Minified assets
- Gzip compression
- CDN delivery

### **Metrics**
- First Contentful Paint: <1s
- Time to Interactive: <2s
- Lighthouse Score: 95+

---

## 🧪 **Testing**

### **Unit Tests**
```bash
npm test
```

### **E2E Tests**
```bash
npm run test:e2e
```

### **Performance Tests**
```bash
npm run test:performance
```

---

## 📞 **Support**

### **Documentation**
- Setup Guide: `docs/SETUP.md`
- API Docs: `docs/API.md`
- Deployment: `docs/DEPLOYMENT.md`

### **Contact**
- Email: support@veriscript.in
- Phone: +91-XXXXXXXXXX
- Website: www.veriscript.in

---

## 📄 **License**

MIT License - See LICENSE file for details

---

<div align="center">

**Built with ❤️ by VeriScript Team**

🚀 **Transform Healthcare with Voice AI**

</div>
