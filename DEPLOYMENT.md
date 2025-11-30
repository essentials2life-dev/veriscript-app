# VeriScript Deployment Guide

Complete guide to deploy VeriScript to production.

## Prerequisites

- Node.js 18+ installed
- Firebase CLI installed (`npm install -g firebase-tools`)
- A Firebase project created
- Twilio account (for SMS)
- Domain name (optional, for custom domain)

## Step 1: Firebase Project Setup

### 1.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: `veriscript-prod`
4. Enable Google Analytics (optional)
5. Create project

### 1.2 Enable Required Services

**Firestore Database:**
1. Go to Firestore Database
2. Click "Create Database"
3. Start in **production mode**
4. Choose location (asia-south1 for India)

**Authentication:**
1. Go to Authentication
2. Click "Get Started"
3. Enable "Email/Password" sign-in method

**Cloud Functions:**
1. Upgrade to Blaze (Pay as you go) plan
2. Required for Cloud Functions

**Hosting:**
1. Already enabled by default

### 1.3 Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll to "Your apps"
3. Click "Web" icon (</>) to add web app
4. Register app with nickname: "VeriScript Web"
5. Copy the Firebase configuration object

## Step 2: Local Setup

### 2.1 Clone Repository

```bash
git clone https://github.com/essentials2life-dev/veriscript-app.git
cd veriscript-app
```

### 2.2 Install Dependencies

```bash
# Install root dependencies
npm install

# Install functions dependencies
cd functions
npm install
cd ..
```

### 2.3 Configure Firebase

```bash
# Login to Firebase
firebase login

# Initialize Firebase (if not already done)
firebase init

# Select:
# - Firestore
# - Functions
# - Hosting
# - Use existing project: veriscript-prod
```

### 2.4 Update Configuration

**Update `public/js/config.js`:**

Replace the placeholder values with your Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "veriscript-prod.firebaseapp.com",
  projectId: "veriscript-prod",
  storageBucket: "veriscript-prod.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Step 3: Twilio Setup (SMS/WhatsApp)

### 3.1 Create Twilio Account

1. Go to [Twilio](https://www.twilio.com/)
2. Sign up for free account
3. Get phone number with SMS capability

### 3.2 Configure Twilio in Firebase

```bash
# Set Twilio credentials
firebase functions:config:set twilio.account_sid="YOUR_ACCOUNT_SID"
firebase functions:config:set twilio.auth_token="YOUR_AUTH_TOKEN"
firebase functions:config:set twilio.phone_number="+1234567890"
```

### 3.3 Verify Configuration

```bash
firebase functions:config:get
```

## Step 4: Deploy to Firebase

### 4.1 Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules
```

### 4.2 Deploy Firestore Indexes

```bash
firebase deploy --only firestore:indexes
```

### 4.3 Deploy Cloud Functions

```bash
firebase deploy --only functions
```

**Note:** First deployment may take 5-10 minutes.

### 4.4 Deploy Hosting

```bash
firebase deploy --only hosting
```

### 4.5 Full Deployment

Or deploy everything at once:

```bash
firebase deploy
```

## Step 5: Post-Deployment Configuration

### 5.1 Set Up Custom Domain (Optional)

1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Enter your domain: `veriscript.in`
4. Follow DNS configuration instructions
5. Wait for SSL certificate provisioning (24-48 hours)

### 5.2 Configure Email Templates

Update email templates in Cloud Functions if needed.

### 5.3 Test the Application

1. Visit your deployed URL: `https://veriscript-prod.web.app`
2. Test doctor registration
3. Test prescription creation
4. Test chemist verification
5. Test patient view

## Step 6: Monitoring & Maintenance

### 6.1 Enable Monitoring

**Cloud Functions Logs:**
```bash
firebase functions:log
```

**Real-time Logs:**
```bash
firebase functions:log --only onPrescriptionCreated
```

### 6.2 Set Up Alerts

1. Go to Firebase Console → Functions
2. Set up error alerts
3. Configure budget alerts in Google Cloud Console

### 6.3 Database Backups

1. Go to Firestore → Backups
2. Enable automated backups
3. Set retention period

## Step 7: Security Checklist

- [ ] Firestore security rules deployed
- [ ] Authentication enabled
- [ ] HTTPS enforced (automatic with Firebase Hosting)
- [ ] API keys restricted (Firebase Console → Project Settings → API Keys)
- [ ] Twilio credentials secured (using Firebase config)
- [ ] CORS configured properly
- [ ] Rate limiting enabled (Cloud Functions)

## Step 8: Performance Optimization

### 8.1 Enable Caching

Already configured in `firebase.json`:
```json
{
  "headers": [
    {
      "source": "**/*.@(js|css)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "max-age=31536000"
        }
      ]
    }
  ]
}
```

### 8.2 Optimize Images

- Use WebP format for images
- Compress images before upload
- Use lazy loading

### 8.3 Monitor Performance

1. Go to Firebase Console → Performance
2. Enable Performance Monitoring
3. Add SDK to track metrics

## Troubleshooting

### Functions Not Deploying

```bash
# Check Node version
node --version  # Should be 18+

# Clear cache
npm cache clean --force

# Reinstall dependencies
cd functions
rm -rf node_modules package-lock.json
npm install
```

### Firestore Permission Denied

- Check security rules are deployed
- Verify user authentication
- Check user role in Firestore

### SMS Not Sending

- Verify Twilio credentials
- Check Twilio account balance
- Verify phone number format (+91XXXXXXXXXX)

### CORS Errors

Add to Cloud Functions:
```javascript
const cors = require('cors')({origin: true});
```

## Cost Estimation

### Free Tier Limits

- **Firestore:** 1GB storage, 50K reads/day, 20K writes/day
- **Cloud Functions:** 2M invocations/month
- **Hosting:** 10GB storage, 360MB/day transfer
- **Authentication:** Unlimited

### Estimated Monthly Costs (1000 prescriptions/month)

- Firestore: ₹0 (within free tier)
- Cloud Functions: ₹0 (within free tier)
- Hosting: ₹0 (within free tier)
- Twilio SMS: ₹500-1000 (₹0.50-1 per SMS)

**Total: ₹500-1000/month**

## Scaling Considerations

### For 10,000+ prescriptions/month:

1. **Enable Firestore Caching**
2. **Use Cloud CDN** for static assets
3. **Implement Rate Limiting**
4. **Add Load Balancing**
5. **Consider Regional Deployment**

## Support & Resources

- **Firebase Documentation:** https://firebase.google.com/docs
- **Twilio Documentation:** https://www.twilio.com/docs
- **VeriScript Docs:** https://docs.veriscript.in (coming soon)

## Emergency Rollback

If deployment fails:

```bash
# Rollback hosting
firebase hosting:channel:deploy rollback

# Rollback functions
# (Manual: redeploy previous version)

# Rollback Firestore rules
# (Manual: restore from backup in Firebase Console)
```

## Next Steps

1. Set up staging environment
2. Configure CI/CD pipeline
3. Add monitoring dashboards
4. Set up automated testing
5. Create admin panel
6. Implement analytics

---

**Deployment Complete! 🎉**

Your VeriScript application is now live and ready to transform digital prescribing in India.
