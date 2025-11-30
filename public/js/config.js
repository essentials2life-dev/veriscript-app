// Firebase Configuration
// Replace with your Firebase project configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const functions = firebase.functions();

// App configuration
const APP_CONFIG = {
  appName: 'VeriScript',
  version: '1.0.0',
  prescriptionExpiryDays: 30,
  supportEmail: 'support@veriscript.in',
  supportPhone: '+91-1800-XXX-XXXX'
};

// Export for use in other files
window.firebaseConfig = firebaseConfig;
window.auth = auth;
window.db = db;
window.functions = functions;
window.APP_CONFIG = APP_CONFIG;
