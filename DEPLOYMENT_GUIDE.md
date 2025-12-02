# 🚀 VeriScript - Complete Deployment Guide

## 📋 **PREREQUISITES**

Before deploying, ensure you have:
- ✅ Node.js (v16 or higher)
- ✅ npm or yarn
- ✅ Git
- ✅ Google account (for Firebase)
- ✅ OpenAI API key (for voice features)

---

## 🔥 **STEP 1: FIREBASE SETUP**

### **1.1 Create Firebase Project**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: `veriscript-app`
4. Enable Google Analytics (optional)
5. Click "Create Project"

### **1.2 Enable Authentication**

1. In Firebase Console, go to **Authentication**
2. Click "Get Started"
3. Enable **Email/Password** sign-in method
4. Enable **Google** sign-in method
5. Add authorized domain: `localhost` (for testing)

### **1.3 Create Firestore Database**

1. Go to **Firestore Database**
2. Click "Create Database"
3. Select **Production mode**
4. Choose location: `asia-south1` (Mumbai) or nearest
5. Click "Enable"

### **1.4 Enable Storage**

1. Go to **Storage**
2. Click "Get Started"
3. Use default security rules
4. Choose same location as Firestore
5. Click "Done"

### **1.5 Get Firebase Config**

1. Go to **Project Settings** (gear icon)
2. Scroll to "Your apps"
3. Click **Web** icon (</>)
4. Register app: `VeriScript Web`
5. Copy the `firebaseConfig` object

**Example:**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "veriscript-app.firebaseapp.com",
  projectId: "veriscript-app",
  storageBucket: "veriscript-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};
```

---

## 🔑 **STEP 2: OPENAI API KEY**

### **2.1 Get OpenAI API Key**

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Go to **API Keys**
4. Click "Create new secret key"
5. Copy the key (starts with `sk-`)

**Important:** Keep this key secure!

---

## 💻 **STEP 3: LOCAL SETUP**

### **3.1 Clone Repository**

```bash
# Clone the repository
git clone https://github.com/essentials2life-dev/veriscript-app.git

# Navigate to mobile app
cd veriscript-app/mobile-app
```

### **3.2 Install Firebase CLI**

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Verify installation
firebase --version
```

### **3.3 Login to Firebase**

```bash
# Login to Firebase
firebase login

# This will open a browser window
# Sign in with your Google account
```

### **3.4 Initialize Firebase**

```bash
# Initialize Firebase in the project
firebase init

# Select the following:
# ✓ Firestore
# ✓ Hosting
# ✓ Storage

# Use existing project: veriscript-app

# Firestore rules: firestore.rules
# Firestore indexes: firestore.indexes.json

# Public directory: . (current directory)
# Single-page app: No
# Automatic builds: No

# Storage rules: storage.rules
```

### **3.5 Configure App**

**Update `js/config.js`:**

```javascript
// Replace with your Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Replace with your OpenAI API key
const OPENAI_API_KEY = "sk-YOUR_OPENAI_KEY";
```

---

## 🧪 **STEP 4: LOCAL TESTING**

### **4.1 Start Local Server**

```bash
# Start Firebase emulators
firebase serve

# Or use Firebase emulators for full testing
firebase emulators:start
```

**Output:**
```
✔  hosting: Local server: http://localhost:5000
```

### **4.2 Test in Browser**

1. Open browser: `http://localhost:5000`
2. You should see the VeriScript landing page
3. Click "Get Started Free" to test registration
4. Try logging in
5. Test creating a prescription

### **4.3 Test on Mobile**

**Option 1: Same Network**
```bash
# Find your local IP
# Windows: ipconfig
# Mac/Linux: ifconfig

# Access from mobile: http://YOUR_IP:5000
# Example: http://192.168.1.100:5000
```

**Option 2: ngrok (Recommended)**
```bash
# Install ngrok
npm install -g ngrok

# Start ngrok
ngrok http 5000

# Use the https URL on mobile
# Example: https://abc123.ngrok.io
```

### **4.4 Test PWA Features**

1. Open in Chrome on mobile
2. Click "Install App" prompt
3. Test offline mode (turn off WiFi)
4. Test voice dictation
5. Test QR code generation

---

## 🚀 **STEP 5: DEPLOY TO PRODUCTION**

### **5.1 Deploy to Firebase Hosting**

```bash
# Deploy everything
firebase deploy

# Or deploy specific services
firebase deploy --only hosting
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

**Output:**
```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/veriscript-app
Hosting URL: https://veriscript-app.web.app
```

### **5.2 Verify Deployment**

1. Open: `https://YOUR_PROJECT.web.app`
2. Test all features
3. Check Firebase Console for data
4. Monitor errors in Console

### **5.3 Add Custom Domain (Optional)**

1. Go to **Hosting** in Firebase Console
2. Click "Add custom domain"
3. Enter your domain: `veriscript.in`
4. Follow DNS configuration steps
5. Wait for SSL certificate (24-48 hours)

---

## 📱 **STEP 6: MOBILE APP SETUP**

### **6.1 Add to Home Screen**

**iOS:**
1. Open in Safari
2. Tap Share button
3. Tap "Add to Home Screen"
4. Tap "Add"

**Android:**
1. Open in Chrome
2. Tap menu (3 dots)
3. Tap "Install app" or "Add to Home Screen"
4. Tap "Install"

### **6.2 Enable Push Notifications**

**Update `js/push-notifications.js`:**
```javascript
// Generate VAPID keys
// Run: npx web-push generate-vapid-keys

const VAPID_PUBLIC_KEY = 'YOUR_VAPID_PUBLIC_KEY';
```

**Generate VAPID Keys:**
```bash
npm install -g web-push
web-push generate-vapid-keys
```

---

## 🔒 **STEP 7: SECURITY SETUP**

### **7.1 Update Firestore Rules**

Already configured in `firestore.rules`. Deploy:
```bash
firebase deploy --only firestore:rules
```

### **7.2 Update Storage Rules**

Already configured in `storage.rules`. Deploy:
```bash
firebase deploy --only storage:rules
```

### **7.3 Enable App Check (Recommended)**

1. Go to **App Check** in Firebase Console
2. Click "Get Started"
3. Register your web app
4. Enable reCAPTCHA v3
5. Add site key to your app

### **7.4 Secure API Keys**

**For OpenAI:**
- Use Firebase Cloud Functions (recommended)
- Or restrict API key to your domain

**For Firebase:**
- Already restricted by Firebase rules
- Add authorized domains in Firebase Console

---

## 📊 **STEP 8: MONITORING & ANALYTICS**

### **8.1 Enable Firebase Analytics**

Already enabled if you selected it during setup.

### **8.2 Monitor Performance**

1. Go to **Performance** in Firebase Console
2. View page load times
3. Monitor API calls
4. Check error rates

### **8.3 Check Logs**

```bash
# View hosting logs
firebase hosting:channel:list

# View function logs (if using)
firebase functions:log
```

---

## 🧪 **STEP 9: TESTING CHECKLIST**

### **Functionality Tests:**
- [ ] User registration works
- [ ] Email verification sent
- [ ] Login works (email & Google)
- [ ] Password reset works
- [ ] Dashboard loads
- [ ] Create prescription works
- [ ] Voice dictation works
- [ ] QR code generates
- [ ] PDF export works
- [ ] WhatsApp share works
- [ ] Offline mode works
- [ ] Data syncs when online

### **Performance Tests:**
- [ ] Page loads < 3 seconds
- [ ] Images optimized
- [ ] Service worker caches assets
- [ ] PWA installable
- [ ] Works on slow 3G

### **Security Tests:**
- [ ] Firestore rules working
- [ ] Storage rules working
- [ ] API keys not exposed
- [ ] HTTPS enabled
- [ ] XSS protection

### **Mobile Tests:**
- [ ] Responsive on all devices
- [ ] Touch targets > 48px
- [ ] No horizontal scroll
- [ ] Keyboard doesn't break layout
- [ ] Voice input works on mobile

---

## 🐛 **STEP 10: TROUBLESHOOTING**

### **Common Issues:**

**1. Firebase Config Error**
```
Error: Firebase config not found
```
**Solution:** Update `js/config.js` with your Firebase config

**2. Authentication Error**
```
Error: auth/unauthorized-domain
```
**Solution:** Add your domain to authorized domains in Firebase Console

**3. Firestore Permission Denied**
```
Error: Missing or insufficient permissions
```
**Solution:** Deploy Firestore rules: `firebase deploy --only firestore:rules`

**4. Voice Not Working**
```
Error: Speech recognition not supported
```
**Solution:** Use HTTPS (required for Web Speech API)

**5. Service Worker Not Updating**
```
Old version still showing
```
**Solution:** 
- Clear browser cache
- Update version in `service-worker.js`
- Hard refresh (Ctrl+Shift+R)

---

## 📈 **STEP 11: POST-DEPLOYMENT**

### **11.1 Monitor Usage**

```bash
# Check hosting usage
firebase hosting:channel:list

# Check Firestore usage
# Go to Firebase Console > Firestore > Usage
```

### **11.2 Set Up Alerts**

1. Go to **Alerts** in Firebase Console
2. Set up alerts for:
   - High error rate
   - Unusual traffic
   - Quota exceeded

### **11.3 Backup Data**

```bash
# Export Firestore data
gcloud firestore export gs://YOUR_BUCKET/backups

# Or use Firebase Console > Firestore > Import/Export
```

### **11.4 Update Documentation**

- Document any custom changes
- Update README with deployment URL
- Share credentials with team (securely)

---

## 🎯 **DEPLOYMENT CHECKLIST**

### **Pre-Deployment:**
- [ ] Firebase project created
- [ ] Authentication enabled
- [ ] Firestore database created
- [ ] Storage enabled
- [ ] Config files updated
- [ ] Local testing complete
- [ ] Mobile testing complete

### **Deployment:**
- [ ] Code deployed to Firebase
- [ ] Firestore rules deployed
- [ ] Storage rules deployed
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active

### **Post-Deployment:**
- [ ] Production URL working
- [ ] All features tested
- [ ] Analytics enabled
- [ ] Monitoring set up
- [ ] Backup configured
- [ ] Team notified

---

## 🔗 **USEFUL LINKS**

### **Firebase:**
- Console: https://console.firebase.google.com/
- Documentation: https://firebase.google.com/docs
- Status: https://status.firebase.google.com/

### **OpenAI:**
- Platform: https://platform.openai.com/
- Documentation: https://platform.openai.com/docs
- API Keys: https://platform.openai.com/api-keys

### **Testing Tools:**
- Lighthouse: https://developers.google.com/web/tools/lighthouse
- PageSpeed: https://pagespeed.web.dev/
- PWA Builder: https://www.pwabuilder.com/

---

## 📞 **SUPPORT**

### **Need Help?**

**Firebase Support:**
- Community: https://firebase.google.com/support
- Stack Overflow: https://stackoverflow.com/questions/tagged/firebase

**VeriScript Support:**
- Email: support@veriscript.in
- GitHub Issues: https://github.com/essentials2life-dev/veriscript-app/issues

---

## 🎉 **SUCCESS!**

Your VeriScript app is now deployed and ready to use!

**Your URLs:**
- **Production:** https://YOUR_PROJECT.web.app
- **Console:** https://console.firebase.google.com/project/YOUR_PROJECT

**Next Steps:**
1. Share with beta testers
2. Collect feedback
3. Monitor analytics
4. Iterate and improve

---

<div align="center">

# **🚀 Deployment Complete!**

**Your app is live and ready to transform healthcare!**

---

**Production URL:** https://veriscript-app.web.app  
**Firebase Console:** https://console.firebase.google.com/

---

**Now go change the world!** 💪

</div>
