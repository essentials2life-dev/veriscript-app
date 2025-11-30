# VeriScript - Quick Setup Guide

Get VeriScript running locally in 5 minutes.

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git
- Firebase account

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/essentials2life-dev/veriscript-app.git
cd veriscript-app
```

### 2. Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 3. Login to Firebase

```bash
firebase login
```

### 4. Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Add Project"
3. Name it "veriscript-dev"
4. Disable Google Analytics (optional for dev)
5. Create project

### 5. Enable Firebase Services

**Enable Firestore:**
1. Go to Firestore Database
2. Click "Create Database"
3. Start in **test mode** (for development)
4. Choose location closest to you

**Enable Authentication:**
1. Go to Authentication
2. Click "Get Started"
3. Enable "Email/Password" provider

**Upgrade to Blaze Plan:**
1. Go to Project Settings
2. Upgrade to Blaze (Pay as you go)
3. Required for Cloud Functions
4. Set budget alerts to avoid charges

### 6. Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll to "Your apps"
3. Click Web icon (</>) 
4. Register app: "VeriScript Dev"
5. Copy the config object

### 7. Update Configuration

Edit `public/js/config.js`:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 8. Initialize Firebase

```bash
firebase init
```

Select:
- ✅ Firestore
- ✅ Functions
- ✅ Hosting
- ✅ Emulators

Choose:
- Use existing project: veriscript-dev
- Accept all defaults
- Install dependencies: Yes

### 9. Install Dependencies

```bash
# Root dependencies
npm install

# Functions dependencies
cd functions
npm install
cd ..
```

### 10. Configure Twilio (Optional for SMS)

If you want SMS functionality:

```bash
# Get Twilio credentials from https://www.twilio.com/
firebase functions:config:set twilio.account_sid="YOUR_SID"
firebase functions:config:set twilio.auth_token="YOUR_TOKEN"
firebase functions:config:set twilio.phone_number="+1234567890"
```

For development without SMS, the app will still work but won't send messages.

### 11. Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

### 12. Start Development Server

**Option A: Use Firebase Emulators (Recommended)**

```bash
firebase emulators:start
```

Access at: http://localhost:5000

**Option B: Deploy to Firebase Hosting**

```bash
firebase deploy --only hosting
```

Access at: https://YOUR_PROJECT_ID.web.app

### 13. Deploy Cloud Functions

```bash
firebase deploy --only functions
```

## Testing the Application

### Create Doctor Account

1. Go to http://localhost:5000 (or your deployed URL)
2. Click "Get Started - Doctors"
3. Fill in registration form:
   - Full Name: Dr. Test User
   - Phone: 9876543210
   - Clinic: Test Clinic
   - Registration: TEST123
   - Email: doctor@test.com
   - Password: test1234
4. Click "Create Account"

### Create Prescription

1. Login to doctor dashboard
2. Click "New Prescription"
3. Fill in patient details:
   - Patient Name: Test Patient
   - Phone: 9876543210
   - Age: 30
4. Add medicine:
   - Name: Paracetamol
   - Dosage: 500mg
   - Frequency: 3 times daily
   - Duration: 5 days
5. Click "Create Prescription"

### Create Chemist Account

1. Go to homepage
2. Click "Register - Chemists"
3. Fill in registration:
   - Pharmacy: Test Pharmacy
   - Owner: Test Chemist
   - License: CHEM123
   - Phone: 9876543211
   - Email: chemist@test.com
   - Password: test1234

### Verify Prescription

1. Login to chemist dashboard
2. Get prescription ID and code from doctor's prescription list
3. Enter in verification form
4. Click "Verify Prescription"
5. Review details
6. Click "Mark as Dispensed"

## Development Tips

### View Logs

```bash
# Cloud Functions logs
firebase functions:log

# Specific function
firebase functions:log --only onPrescriptionCreated
```

### Access Firestore Data

1. Go to Firebase Console
2. Click Firestore Database
3. Browse collections: users, doctors, chemists, prescriptions

### Debug Authentication

1. Go to Firebase Console
2. Click Authentication
3. View registered users

### Test Without SMS

Comment out Twilio code in `functions/index.js`:

```javascript
// Skip SMS sending in development
if (functions.config().twilio?.account_sid) {
  await twilio.messages.create({...});
}
```

## Common Issues

### Port Already in Use

```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port
firebase serve --port 5001
```

### Functions Not Working

```bash
# Check Node version
node --version  # Must be 18+

# Reinstall dependencies
cd functions
rm -rf node_modules
npm install
```

### Permission Denied in Firestore

- Check security rules are deployed
- Verify user is authenticated
- Check user role in Firestore

### Can't Login

- Clear browser cache
- Check Firebase Authentication is enabled
- Verify email/password provider is enabled

## Project Structure

```
veriscript-app/
├── public/              # Frontend files
│   ├── doctor/         # Doctor portal
│   ├── chemist/        # Chemist portal
│   ├── patient/        # Patient view
│   ├── css/           # Stylesheets
│   ├── js/            # JavaScript
│   └── index.html     # Landing page
├── functions/          # Cloud Functions
│   ├── index.js       # Main functions
│   └── package.json   # Dependencies
├── firestore.rules    # Security rules
├── firestore.indexes.json
├── firebase.json      # Firebase config
└── package.json       # Root dependencies
```

## Next Steps

1. ✅ Customize branding and colors
2. ✅ Add more medicine templates
3. ✅ Set up analytics
4. ✅ Configure custom domain
5. ✅ Add more features

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Cloud Functions Guide](https://firebase.google.com/docs/functions)
- [Twilio SMS API](https://www.twilio.com/docs/sms)

## Support

For issues or questions:
- Check existing GitHub issues
- Create new issue with details
- Email: support@veriscript.in

---

**Happy Coding! 🚀**
