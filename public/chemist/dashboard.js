/**
 * Chemist Dashboard JavaScript
 */

let currentUser = null;
let chemistProfile = null;
let currentPrescription = null;

// Initialize dashboard
async function initDashboard() {
  try {
    currentUser = await utils.checkAuth('/chemist/login.html');
    await loadChemistProfile();
    await loadStats();
    await loadRecentActivity();
  } catch (error) {
    console.error('Dashboard initialization error:', error);
  }
}

// Load chemist profile
async function loadChemistProfile() {
  try {
    const docRef = await db.collection('chemists').doc(currentUser.uid).get();
    
    if (docRef.exists) {
      chemistProfile = docRef.data();
      
      document.getElementById('pharmacyName').textContent = chemistProfile.pharmacyName;
      document.getElementById('ownerName').textContent = chemistProfile.ownerName;
      
      const badge = document.getElementById('verificationBadge');
      if (chemistProfile.verificationStatus === 'verified') {
        badge.textContent = 'Verified';
        badge.className = 'badge badge-success';
      } else if (chemistProfile.verificationStatus === 'rejected') {
        badge.textContent = 'Verification Failed';
        badge.className = 'badge badge-error';
      } else {
        badge.textContent = 'Pending Verification';
        badge.className = 'badge badge-warning';
      }
    }
  } catch (error) {
    console.error('Error loading chemist profile:', error);
  }
}

// Load statistics
async function loadStats() {
  try {
    const prescriptionsRef = db.collection('prescriptions')
      .where('dispensedBy', '==', currentUser.uid);
    
    const snapshot = await prescriptionsRef.get();
    
    let total = 0;
    let today = 0;
    let monthly = 0;
    
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    snapshot.forEach(doc => {
      const data = doc.data();
      total++;
      
      if (data.dispensedAt) {
        const dispensedDate = data.dispensedAt.toDate();
        
        if (dispensedDate >= todayStart) {
          today++;
        }
        
        if (dispensedDate >= monthStart) {
          monthly++;
        }
      }
    });
    
    document.getElementById('totalDispensed').textContent = total;
    document.getElementById('todayCount').textContent = today;
    document.getElementById('monthlyCount').textContent = monthly;
    
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

// Load recent activity
async function loadRecentActivity() {
  try {
    const prescriptionsRef = db.collection('prescriptions')
      .where('dispensedBy', '==', currentUser.uid)
      .orderBy('dispensedAt', 'desc')
      .limit(10);
    
    const snapshot = await prescriptionsRef.get();
    
    const tbody = document.getElementById('activityTable');
    
    if (snapshot.empty) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" style="text-align: center; padding: 2rem; color: var(--gray-500);">
            No activity yet. Verify your first prescription!
          </td>
        </tr>
      `;
      return;
    }
    
    tbody.innerHTML = '';
    
    snapshot.forEach(doc => {
      const data = doc.data();
      const row = document.createElement('tr');
      
      row.innerHTML = `
        <td>${utils.formatDate(data.dispensedAt)}</td>
        <td>${data.patientName}</td>
        <td>${data.doctorName}</td>
        <td>${data.medicines.length} medicine(s)</td>
      `;
      
      tbody.appendChild(row);
    });
    
  } catch (error) {
    console.error('Error loading recent activity:', error);
    const tbody = document.getElementById('activityTable');
    tbody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align: center; padding: 2rem; color: var(--error-color);">
          Error loading activity. Please refresh.
        </td>
      </tr>
    `;
  }
}

// Handle verification form submission
document.addEventListener('DOMContentLoaded', () => {
  const verificationForm = document.getElementById('verificationForm');
  
  if (verificationForm) {
    verificationForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const prescriptionId = document.getElementById('prescriptionId').value.trim();
      const verificationCode = document.getElementById('verificationCode').value.trim();
      
      await verifyPrescription(prescriptionId, verificationCode);
    });
  }
});

// Verify prescription
async function verifyPrescription(prescriptionId, verificationCode) {
  utils.showLoading('Verifying prescription...');
  
  try {
    // Call Cloud Function to verify
    const verifyFunction = functions.httpsCallable('verifyPrescription');
    const result = await verifyFunction({ prescriptionId, verificationCode });
    
    if (!result.data.success) {
      throw new Error(result.data.message || 'Verification failed');
    }
    
    currentPrescription = result.data.prescription;
    
    utils.hideLoading();
    utils.showToast('Prescription verified successfully!', 'success');
    
    // Display prescription details
    displayPrescriptionDetails(currentPrescription, prescriptionId);
    
  } catch (error) {
    console.error('Verification error:', error);
    utils.hideLoading();
    utils.showToast(error.message || 'Verification failed', 'error');
  }
}

// Display prescription details
function displayPrescriptionDetails(prescription, prescriptionId) {
  const detailsDiv = document.getElementById('prescriptionDetails');
  
  // Build medicines HTML
  let medicinesHtml = '';
  prescription.medicines.forEach((med, index) => {
    medicinesHtml += `
      <div class="medicine-item">
        <div style="font-weight: 600; margin-bottom: 0.25rem;">${index + 1}. ${med.name}</div>
        <div style="font-size: 0.875rem; color: var(--gray-600);">
          <div>Dosage: ${med.dosage}</div>
          <div>Frequency: ${med.frequency}</div>
          <div>Duration: ${med.duration}</div>
        </div>
      </div>
    `;
  });
  
  // Build details HTML
  const detailsHtml = `
    <div class="verification-badge verified">
      ✓ Prescription Verified
    </div>
    
    <div style="margin-bottom: 2rem;">
      <h3>Doctor Information</h3>
      <div class="grid-2">
        <div>
          <div style="font-size: 0.875rem; color: var(--gray-600);">Doctor Name</div>
          <div style="font-weight: 600;">${prescription.doctorName}</div>
        </div>
        <div>
          <div style="font-size: 0.875rem; color: var(--gray-600);">Registration Number</div>
          <div style="font-weight: 600;">${prescription.doctorRegistration}</div>
        </div>
        <div>
          <div style="font-size: 0.875rem; color: var(--gray-600);">Clinic</div>
          <div style="font-weight: 600;">${prescription.clinicName}</div>
        </div>
        <div>
          <div style="font-size: 0.875rem; color: var(--gray-600);">Date</div>
          <div style="font-weight: 600;">${utils.formatDate(prescription.createdAt)}</div>
        </div>
      </div>
    </div>
    
    <div style="margin-bottom: 2rem;">
      <h3>Patient Information</h3>
      <div class="grid-2">
        <div>
          <div style="font-size: 0.875rem; color: var(--gray-600);">Name</div>
          <div style="font-weight: 600;">${prescription.patientName}</div>
        </div>
        <div>
          <div style="font-size: 0.875rem; color: var(--gray-600);">Phone</div>
          <div style="font-weight: 600;">${utils.formatPhoneNumber(prescription.patientPhone)}</div>
        </div>
        ${prescription.patientAge ? `
        <div>
          <div style="font-size: 0.875rem; color: var(--gray-600);">Age</div>
          <div style="font-weight: 600;">${prescription.patientAge} years</div>
        </div>
        ` : ''}
        ${prescription.diagnosis ? `
        <div>
          <div style="font-size: 0.875rem; color: var(--gray-600);">Diagnosis</div>
          <div style="font-weight: 600;">${prescription.diagnosis}</div>
        </div>
        ` : ''}
      </div>
    </div>
    
    <div style="margin-bottom: 2rem;">
      <h3>Medicines Prescribed</h3>
      <div class="medicine-list">
        ${medicinesHtml}
      </div>
    </div>
    
    ${prescription.notes ? `
    <div style="margin-bottom: 2rem;">
      <h3>Additional Notes</h3>
      <div style="background: var(--gray-50); padding: 1rem; border-radius: var(--radius-md);">
        ${prescription.notes}
      </div>
    </div>
    ` : ''}
    
    <div style="display: flex; gap: 1rem; justify-content: center;">
      <button class="btn btn-outline" onclick="resetForm()">
        Verify Another
      </button>
      <button class="btn btn-secondary btn-lg" onclick="dispensePrescription('${prescriptionId}')">
        Mark as Dispensed
      </button>
    </div>
  `;
  
  detailsDiv.innerHTML = detailsHtml;
  detailsDiv.style.display = 'block';
  
  // Scroll to details
  detailsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Dispense prescription
async function dispensePrescription(prescriptionId) {
  if (!confirm('Confirm that you have dispensed all medicines to the patient?')) {
    return;
  }
  
  utils.showLoading('Marking as dispensed...');
  
  try {
    // Update prescription in Firestore
    await db.collection('prescriptions').doc(prescriptionId).update({
      status: 'dispensed',
      dispensedAt: firebase.firestore.FieldValue.serverTimestamp(),
      dispensedBy: currentUser.uid,
      chemistName: chemistProfile.pharmacyName,
      chemistLicenseId: chemistProfile.licenseNumber
    });
    
    // Update chemist's dispensed count
    await db.collection('chemists').doc(currentUser.uid).update({
      dispensedCount: firebase.firestore.FieldValue.increment(1)
    });
    
    utils.hideLoading();
    utils.showToast('Prescription dispensed successfully!', 'success');
    
    // Reset form and reload stats
    setTimeout(() => {
      resetForm();
      loadStats();
      loadRecentActivity();
    }, 1500);
    
  } catch (error) {
    console.error('Error dispensing prescription:', error);
    utils.hideLoading();
    utils.showToast('Failed to mark as dispensed', 'error');
  }
}

// Reset form
function resetForm() {
  document.getElementById('verificationForm').reset();
  document.getElementById('prescriptionDetails').style.display = 'none';
  currentPrescription = null;
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Open QR scanner (placeholder)
function openQRScanner() {
  utils.showToast('QR Scanner feature coming soon! Use manual entry for now.', 'info');
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', initDashboard);
