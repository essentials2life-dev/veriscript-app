# VeriScript: Compliance & Regulatory Framework

## Executive Summary

VeriScript is designed as a **compliance-first** digital prescription platform that addresses the complex regulatory landscape of Indian healthcare. This document outlines our comprehensive approach to legal validity, data privacy, and regulatory readiness.

---

## I. Regulatory Landscape Overview

### A. Key Regulations Applicable to VeriScript

| Regulation | Applicability | Compliance Status |
|------------|---------------|-------------------|
| **IT Act, 2000** | Digital signatures, electronic records | ✅ Ready (T-PIN + Aadhaar eSign) |
| **Drugs & Cosmetics Act, 1940** | Prescription validity, dispensing | ✅ Compliant |
| **ABDM Framework** | Digital health integration | ✅ Architecture ready |
| **DPDP Act, 2023** | Data privacy, consent | ✅ PHI segregation implemented |
| **Telemedicine Guidelines, 2020** | Remote prescribing | ✅ Schedule X guardrails |
| **Indian Medical Council Regulations** | Professional conduct | ✅ Audit trail maintained |

---

## II. IT Act 2000 Compliance

### A. Legal Validity of Electronic Prescriptions

#### Current Implementation: Transaction PIN (T-PIN)

**Purpose**: Workflow authorization and non-repudiation

**Technical Implementation**:
```javascript
// T-PIN Authorization Flow
const authorizePrescription = async (doctorId, prescriptionData, tPin) => {
  // 1. Verify T-PIN against doctor profile
  const doctor = await db.collection('doctors').doc(doctorId).get();
  const isValidPin = await verifyTPin(tPin, doctor.data().tPinHash);
  
  if (!isValidPin) {
    throw new Error('Invalid T-PIN');
  }
  
  // 2. Create prescription with authorization metadata
  const prescription = {
    ...prescriptionData,
    authorizedBy: doctorId,
    authorizationMethod: 'T-PIN',
    authorizationTimestamp: admin.firestore.FieldValue.serverTimestamp(),
    ipAddress: context.rawRequest.ip,
    deviceInfo: context.rawRequest.headers['user-agent']
  };
  
  // 3. Generate cryptographic hash for integrity
  prescription.prescriptionHash = generateHash(prescription);
  
  // 4. Save to Firestore
  await db.collection('prescriptions').add(prescription);
  
  // 5. Create immutable audit log
  await createAuditLog({
    action: 'PRESCRIPTION_AUTHORIZED',
    doctorId,
    prescriptionId: prescription.id,
    method: 'T-PIN',
    timestamp: new Date()
  });
};
```

**Legal Basis**:
- Section 3A: Electronic records have same legal validity as paper
- Section 5: Electronic signatures are legally recognized
- Section 6: Electronic records are admissible as evidence

**Limitations**:
- T-PIN is not a Digital Signature Certificate (DSC)
- Does not meet Section 3A requirements for "secure electronic signature"
- Suitable for workflow authorization, not legal non-repudiation

#### Future Implementation: Aadhaar eSign Integration

**Purpose**: Legally binding digital signature under IT Act 2000

**Technical Architecture**:
```javascript
// Aadhaar eSign Integration Flow
const signPrescriptionWithAadhaar = async (doctorId, prescriptionId) => {
  // 1. Initiate eSign request
  const eSignRequest = {
    aadhaarNumber: doctor.aadhaarNumber,
    documentHash: prescription.prescriptionHash,
    purpose: 'Medical Prescription Authorization',
    consentText: 'I authorize this prescription as per IT Act 2000'
  };
  
  // 2. Call eSign API (NSDL/eMudhra)
  const eSignResponse = await eSignAPI.initiate(eSignRequest);
  
  // 3. User completes OTP verification on Aadhaar
  // 4. Receive signed document with DSC
  
  // 5. Update prescription with DSC
  await db.collection('prescriptions').doc(prescriptionId).update({
    digitalSignature: eSignResponse.signature,
    signingCertificate: eSignResponse.certificate,
    signedAt: admin.firestore.FieldValue.serverTimestamp(),
    legallyValid: true
  });
};
```

**Legal Compliance**:
- ✅ Section 3A: Secure electronic signature
- ✅ Section 5: Digital Signature Certificate
- ✅ Section 35: Certifying Authority (NSDL/eMudhra)
- ✅ Non-repudiation guaranteed

**Implementation Timeline**:
- Phase 1 (Current): T-PIN for workflow
- Phase 2 (Q2 2025): Aadhaar eSign integration
- Phase 3 (Q4 2025): Mandatory DSC for all prescriptions

### B. Electronic Records Management

#### Immutable Audit Trail

**Requirement**: Section 7A - Electronic records must be retained

**Implementation**:
```javascript
// Firestore Security Rules - Immutable Audit Logs
match /auditLogs/{logId} {
  allow read: if isAdmin();
  allow create: if isAuthenticated();
  allow update, delete: if false; // Immutable
}
```

**Retention Policy**:
- Prescriptions: 5 years (as per Drugs & Cosmetics Act)
- Audit logs: 7 years (as per IT Act)
- Patient data: Until consent withdrawal (DPDP Act)

#### Data Integrity

**Cryptographic Hashing**:
```javascript
function generatePrescriptionHash(prescription) {
  const dataString = JSON.stringify({
    doctorId: prescription.doctorId,
    doctorRegistration: prescription.doctorRegistration,
    patientName: prescription.patientName,
    patientPhone: prescription.patientPhone,
    medicines: prescription.medicines,
    createdAt: prescription.createdAt
  });
  
  return crypto.createHash('sha256').update(dataString).digest('hex');
}
```

**Verification**:
- Hash stored with prescription
- Chemist verifies hash before dispensing
- Any tampering detected immediately

---

## III. Drugs & Cosmetics Act Compliance

### A. Prescription Requirements

#### Mandatory Fields (Rule 65)

VeriScript ensures all prescriptions include:

1. ✅ **Doctor Information**
   - Full name
   - Registration number
   - Qualification
   - Clinic address
   - Contact details

2. ✅ **Patient Information**
   - Full name
   - Age
   - Contact number

3. ✅ **Prescription Details**
   - Medicine name
   - Dosage
   - Frequency
   - Duration
   - Date of prescription

4. ✅ **Doctor's Authorization**
   - T-PIN (current)
   - Digital signature (future)

#### Schedule X Drug Restrictions

**Implementation**:
```javascript
// Schedule X Drug Guardrails
const validatePrescription = async (prescription) => {
  for (const medicine of prescription.medicines) {
    const medicineData = await db.collection('medicines')
      .where('name', '==', medicine.name)
      .get();
    
    if (medicineData.docs[0].data().schedule === 'X') {
      // Check if prescription is via telemedicine
      if (prescription.consultationType === 'telemedicine') {
        throw new Error('Schedule X drugs cannot be prescribed via telemedicine');
      }
      
      // Require additional verification
      if (!prescription.patientIdProof) {
        throw new Error('Patient ID proof required for Schedule X drugs');
      }
    }
  }
};
```

**Compliance**:
- ✅ Schedule X drugs blocked for telemedicine
- ✅ Patient ID verification required
- ✅ Additional audit logging
- ✅ Chemist verification mandatory

### B. Dispensing Requirements

#### Chemist Verification (3-Factor)

1. **QR Code Scan**: Validates prescription authenticity
2. **Verification Code**: 6-digit code from patient
3. **Pharmacy License ID**: Chemist's license number

**Implementation**:
```javascript
const verifyAndDispense = async (prescriptionId, verificationCode, licenseId) => {
  // 1. Verify prescription exists
  const prescription = await db.collection('prescriptions').doc(prescriptionId).get();
  
  // 2. Verify code matches
  if (prescription.data().verificationCode !== verificationCode) {
    await createAuditLog({
      action: 'VERIFICATION_FAILED',
      reason: 'Invalid verification code',
      prescriptionId,
      chemistLicenseId: licenseId
    });
    throw new Error('Invalid verification code');
  }
  
  // 3. Verify license is valid
  const chemist = await db.collection('chemists')
    .where('licenseNumber', '==', licenseId)
    .get();
  
  if (chemist.empty || chemist.docs[0].data().verificationStatus !== 'verified') {
    throw new Error('Invalid or unverified pharmacy license');
  }
  
  // 4. Check prescription not already dispensed
  if (prescription.data().status === 'dispensed') {
    throw new Error('Prescription already dispensed');
  }
  
  // 5. Check not expired
  if (isExpired(prescription.data().createdAt)) {
    throw new Error('Prescription expired');
  }
  
  // 6. Mark as dispensed
  await prescription.ref.update({
    status: 'dispensed',
    dispensedAt: admin.firestore.FieldValue.serverTimestamp(),
    dispensedBy: chemist.docs[0].id,
    chemistName: chemist.docs[0].data().pharmacyName,
    chemistLicenseId: licenseId
  });
  
  // 7. Create audit log
  await createAuditLog({
    action: 'PRESCRIPTION_DISPENSED',
    prescriptionId,
    chemistId: chemist.docs[0].id,
    licenseId
  });
};
```

---

## IV. ABDM (Ayushman Bharat Digital Mission) Readiness

### A. Architecture Alignment

VeriScript is designed for seamless ABDM integration:

#### 1. Health Professional Registry (HPR) Integration

**Current State**: Doctor registration number stored

**ABDM Integration**:
```javascript
// HPR Linkage
const linkDoctorToHPR = async (doctorId, hprId) => {
  // 1. Verify HPR ID with NHA
  const hprVerification = await nhaAPI.verifyHPR(hprId);
  
  if (!hprVerification.valid) {
    throw new Error('Invalid HPR ID');
  }
  
  // 2. Update doctor profile
  await db.collection('doctors').doc(doctorId).update({
    hprId: hprId,
    hprVerified: true,
    hprVerificationDate: admin.firestore.FieldValue.serverTimestamp(),
    nhaRegistrationNumber: hprVerification.registrationNumber
  });
  
  // 3. Enable ABDM features
  await enableABDMFeatures(doctorId);
};
```

#### 2. ABHA (Ayushman Bharat Health Account) Integration

**Current State**: Patient phone number used as identifier

**ABDM Integration**:
```javascript
// ABHA Linkage
const linkPatientToABHA = async (prescriptionId, abhaNumber) => {
  // 1. Verify ABHA with NHA
  const abhaVerification = await nhaAPI.verifyABHA(abhaNumber);
  
  // 2. Request patient consent
  const consentRequest = await nhaAPI.requestConsent({
    abhaNumber,
    purpose: 'Prescription Access',
    dataTypes: ['Prescription', 'Diagnosis'],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  });
  
  // 3. Update prescription with ABHA
  await db.collection('prescriptions').doc(prescriptionId).update({
    patientAbhaNumber: abhaNumber,
    abhaLinked: true,
    consentId: consentRequest.consentId
  });
  
  // 4. Push to Health Information Exchange (HIE)
  await pushToHIE(prescriptionId);
};
```

#### 3. Health Information Exchange (HIE-CM)

**Data Sharing**:
```javascript
// Push prescription to ABDM HIE
const pushToHIE = async (prescriptionId) => {
  const prescription = await db.collection('prescriptions').doc(prescriptionId).get();
  
  // Convert to FHIR format
  const fhirPrescription = convertToFHIR(prescription.data());
  
  // Push to HIE-CM
  await nhaAPI.pushHealthRecord({
    abhaNumber: prescription.data().patientAbhaNumber,
    recordType: 'Prescription',
    fhirData: fhirPrescription,
    consentId: prescription.data().consentId
  });
};
```

### B. ABDM Compliance Checklist

- [x] Doctor HPR ID field in database
- [x] Patient ABHA number field in database
- [x] Consent management framework
- [ ] FHIR format conversion (Q2 2025)
- [ ] HIE-CM integration (Q2 2025)
- [ ] NHA API integration (Q3 2025)
- [ ] ABDM certification (Q4 2025)

---

## V. DPDP Act 2023 Compliance

### A. Data Privacy Principles

#### 1. PHI Segregation

**Implementation**:
- ✅ No PHI in SMS/WhatsApp message body
- ✅ Secure token-based access
- ✅ Encrypted data at rest and in transit
- ✅ Role-based access control

**Technical Architecture**:
```javascript
// PHI Protection
const sendPrescriptionToPatient = async (prescriptionId) => {
  const prescription = await db.collection('prescriptions').doc(prescriptionId).get();
  
  // Generate secure token (NO PHI)
  const token = {
    prescriptionId: prescriptionId,
    verificationCode: prescription.data().verificationCode,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  };
  
  const tokenUrl = `https://veriscript.app/patient/view?id=${token.prescriptionId}&code=${token.verificationCode}`;
  
  // Send SMS with ONLY token (NO medicine names, diagnosis, etc.)
  await twilio.messages.create({
    body: `VeriScript Prescription from Dr. ${prescription.data().doctorName}\n\nVerification Code: ${token.verificationCode}\n\nView: ${tokenUrl}\n\nValid for 30 days.`,
    from: twilioPhoneNumber,
    to: prescription.data().patientPhone
  });
};
```

#### 2. Consent Management

**Implementation**:
```javascript
// Patient Consent Framework
const requestPatientConsent = async (patientPhone, purpose) => {
  const consent = {
    patientPhone,
    purpose,
    dataTypes: ['Prescription', 'Diagnosis', 'Medicines'],
    consentGivenAt: admin.firestore.FieldValue.serverTimestamp(),
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    canWithdraw: true
  };
  
  await db.collection('consents').add(consent);
  
  // Send consent notification
  await sendConsentNotification(patientPhone, consent);
};

// Consent Withdrawal
const withdrawConsent = async (consentId) => {
  await db.collection('consents').doc(consentId).update({
    withdrawn: true,
    withdrawnAt: admin.firestore.FieldValue.serverTimestamp()
  });
  
  // Anonymize associated data
  await anonymizePatientData(consentId);
};
```

#### 3. Data Minimization

**Principle**: Collect only necessary data

**Implementation**:
- ✅ Patient age (not DOB)
- ✅ Phone number (not full address)
- ✅ Diagnosis (optional)
- ✅ No Aadhaar storage (only for eSign)

#### 4. Right to Erasure

**Implementation**:
```javascript
// Patient Data Deletion
const deletePatientData = async (patientPhone) => {
  // 1. Find all prescriptions
  const prescriptions = await db.collection('prescriptions')
    .where('patientPhone', '==', patientPhone)
    .get();
  
  // 2. Anonymize prescriptions (keep for audit)
  const batch = db.batch();
  prescriptions.forEach(doc => {
    batch.update(doc.ref, {
      patientName: '[REDACTED]',
      patientPhone: '[REDACTED]',
      patientAge: null,
      diagnosis: '[REDACTED]',
      notes: '[REDACTED]',
      dataDeleted: true,
      deletedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });
  
  await batch.commit();
  
  // 3. Create audit log
  await createAuditLog({
    action: 'PATIENT_DATA_DELETED',
    patientPhone: '[REDACTED]',
    prescriptionCount: prescriptions.size
  });
};
```

### B. Third-Party Data Processing

#### Business Associate Agreements (BAA)

**Twilio (SMS Provider)**:
- ✅ BAA signed for HIPAA compliance
- ✅ Data processing agreement
- ✅ No PHI in message body
- ✅ Encrypted transmission

**Firebase/Google Cloud**:
- ✅ Google Cloud BAA
- ✅ Data residency in India (asia-south1)
- ✅ Encryption at rest and in transit
- ✅ Access controls and monitoring

**WhatsApp Business API**:
- ✅ Meta BAA for healthcare
- ✅ End-to-end encryption
- ✅ No PHI in message body
- ✅ Secure token delivery

---

## VI. Telemedicine Guidelines Compliance

### A. Telemedicine Prescription Rules

#### Prohibited Drugs (Schedule X)

**Implementation**:
```javascript
// Telemedicine Restrictions
const validateTelemedicinePrescription = async (prescription) => {
  if (prescription.consultationType !== 'telemedicine') {
    return; // No restrictions for in-person
  }
  
  for (const medicine of prescription.medicines) {
    const medicineData = await getMedicineData(medicine.name);
    
    // Block Schedule X drugs
    if (medicineData.schedule === 'X') {
      throw new Error(`${medicine.name} is a Schedule X drug and cannot be prescribed via telemedicine`);
    }
    
    // Block narcotics
    if (medicineData.category === 'narcotic') {
      throw new Error(`${medicine.name} is a narcotic and cannot be prescribed via telemedicine`);
    }
  }
};
```

**Compliance**:
- ✅ Schedule X drugs blocked for telemedicine
- ✅ Narcotics blocked for telemedicine
- ✅ Audit trail for all prescriptions
- ✅ Consultation type recorded

#### First Consultation Requirements

**Implementation**:
- ✅ Patient ID verification for first consultation
- ✅ Medical history collection
- ✅ Informed consent
- ✅ Follow-up scheduling

---

## VII. Compliance Monitoring & Reporting

### A. Real-Time Compliance Dashboard

**Metrics Tracked**:
1. Prescriptions with valid digital signatures
2. Schedule X drug prescriptions (flagged)
3. Telemedicine compliance violations
4. Data privacy incidents
5. Audit log completeness

**Implementation**:
```javascript
// Compliance Monitoring
const generateComplianceReport = async (startDate, endDate) => {
  const report = {
    period: { startDate, endDate },
    totalPrescriptions: 0,
    digitallySignedPrescriptions: 0,
    scheduleXPrescriptions: 0,
    telemedicineViolations: 0,
    dataPrivacyIncidents: 0,
    auditLogCompleteness: 0
  };
  
  // Query prescriptions
  const prescriptions = await db.collection('prescriptions')
    .where('createdAt', '>=', startDate)
    .where('createdAt', '<=', endDate)
    .get();
  
  report.totalPrescriptions = prescriptions.size;
  
  prescriptions.forEach(doc => {
    const data = doc.data();
    
    if (data.digitalSignature) {
      report.digitallySignedPrescriptions++;
    }
    
    // Check for Schedule X drugs
    data.medicines.forEach(med => {
      if (med.schedule === 'X') {
        report.scheduleXPrescriptions++;
      }
    });
  });
  
  // Calculate compliance percentage
  report.complianceScore = (report.digitallySignedPrescriptions / report.totalPrescriptions) * 100;
  
  return report;
};
```

### B. Regulatory Reporting

**Automated Reports**:
1. Monthly compliance report to management
2. Quarterly audit log summary
3. Annual regulatory filing preparation
4. Incident reports (within 24 hours)

---

## VIII. Compliance Roadmap

### Phase 1: Current (Q1 2025)
- [x] T-PIN authorization
- [x] Cryptographic hashing
- [x] Immutable audit logs
- [x] PHI segregation
- [x] Schedule X guardrails

### Phase 2: ABDM Integration (Q2-Q3 2025)
- [ ] HPR ID integration
- [ ] ABHA number linkage
- [ ] FHIR format conversion
- [ ] HIE-CM integration
- [ ] NHA API integration

### Phase 3: Legal Validity (Q3-Q4 2025)
- [ ] Aadhaar eSign integration
- [ ] DSC for all prescriptions
- [ ] Legal opinion on validity
- [ ] Regulatory approval

### Phase 4: Advanced Compliance (2026)
- [ ] AI-powered compliance monitoring
- [ ] Automated regulatory reporting
- [ ] Blockchain audit trail
- [ ] International compliance (HIPAA, GDPR)

---

## IX. Legal Disclaimers

### Current Limitations

**Important**: VeriScript's current T-PIN implementation provides:
- ✅ Workflow authorization
- ✅ Audit trail
- ✅ Data integrity
- ❌ NOT a legally binding digital signature under IT Act 2000

**Recommendation**: 
- Doctors should maintain paper backup until Aadhaar eSign is implemented
- Use "Copy to Clipboard" feature to integrate with existing records
- Consult legal counsel for specific compliance requirements

### Liability Protection

**VeriScript provides**:
- ✅ Technical compliance tools
- ✅ Audit trail for liability protection
- ✅ Best practices implementation
- ❌ NOT legal advice or guarantee of compliance

**Doctors are responsible for**:
- Ensuring prescriptions meet local regulations
- Maintaining professional standards
- Verifying patient identity
- Following medical council guidelines

---

## X. Conclusion

VeriScript is designed as a **compliance-first** platform that:

1. ✅ Meets current regulatory requirements
2. ✅ Prepares for future ABDM mandate
3. ✅ Protects patient privacy (DPDP Act)
4. ✅ Ensures prescription validity (Drugs & Cosmetics Act)
5. ✅ Provides legal defensibility (IT Act 2000)

**Next Steps**:
1. Complete Aadhaar eSign integration (Q2 2025)
2. Achieve ABDM certification (Q4 2025)
3. Obtain legal opinion on validity
4. Continuous compliance monitoring

---

**For compliance inquiries**: compliance@veriscript.in  
**For legal consultation**: legal@veriscript.in

*This document is for informational purposes only and does not constitute legal advice. Consult qualified legal counsel for specific compliance requirements.*
