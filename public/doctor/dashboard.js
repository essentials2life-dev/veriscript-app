/**
 * Doctor Dashboard JavaScript
 */

let currentUser = null;
let doctorProfile = null;
let medicineCounter = 0;

// Initialize dashboard
async function initDashboard() {
  try {
    currentUser = await utils.checkAuth('/doctor/login.html');
    await loadDoctorProfile();
    await loadStats();
    await loadPrescriptions();
  } catch (error) {
    console.error('Dashboard initialization error:', error);
  }
}

// Load doctor profile
async function loadDoctorProfile() {
  try {
    const docRef = await db.collection('doctors').doc(currentUser.uid).get();
    
    if (docRef.exists) {
      doctorProfile = docRef.data();
      
      // Update UI
      document.getElementById('doctorName').textContent = `Welcome, ${doctorProfile.fullName}`;
      document.getElementById('clinicName').textContent = doctorProfile.clinicName;
      
      // Update subscription badge
      const badge = document.getElementById('subscriptionBadge');
      if (doctorProfile.subscriptionPlan === 'pro') {
        badge.textContent = 'Pro Plan';
        badge.className = 'badge badge-success';
      } else {
        badge.textContent = 'Free Plan';
        badge.className = 'badge badge-info';
      }
    }
  } catch (error) {
    console.error('Error loading doctor profile:', error);
  }
}

// Load statistics
async function loadStats() {
  try {
    const prescriptionsRef = db.collection('prescriptions')
      .where('doctorId', '==', currentUser.uid);
    
    const snapshot = await prescriptionsRef.get();
    
    let total = 0;
    let dispensed = 0;
    let pending = 0;
    let monthly = 0;
    
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    snapshot.forEach(doc => {
      const data = doc.data();
      total++;
      
      if (data.status === 'dispensed') {
        dispensed++;
      } else if (data.status === 'pending') {
        pending++;
      }
      
      // Check if created this month
      if (data.createdAt && data.createdAt.toDate() >= firstDayOfMonth) {
        monthly++;
      }
    });
    
    // Update UI
    document.getElementById('totalPrescriptions').textContent = total;
    document.getElementById('dispensedCount').textContent = dispensed;
    document.getElementById('pendingCount').textContent = pending;
    document.getElementById('monthlyCount').textContent = monthly;
    
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

// Load prescriptions
async function loadPrescriptions() {
  try {
    const prescriptionsRef = db.collection('prescriptions')
      .where('doctorId', '==', currentUser.uid)
      .orderBy('createdAt', 'desc')
      .limit(10);
    
    const snapshot = await prescriptionsRef.get();
    
    const tbody = document.getElementById('prescriptionsTable');
    
    if (snapshot.empty) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; padding: 2rem; color: var(--gray-500);">
            No prescriptions yet. Create your first prescription!
          </td>
        </tr>
      `;
      return;
    }
    
    tbody.innerHTML = '';
    
    snapshot.forEach(doc => {
      const data = doc.data();
      const row = document.createElement('tr');
      
      const statusBadge = getStatusBadge(data.status);
      
      row.innerHTML = `
        <td>${data.patientName}</td>
        <td>${utils.formatPhoneNumber(data.patientPhone)}</td>
        <td>${utils.formatDate(data.createdAt)}</td>
        <td>${statusBadge}</td>
        <td>
          <button class="btn btn-outline btn-sm" onclick="viewPrescription('${doc.id}')">
            View
          </button>
        </td>
      `;
      
      tbody.appendChild(row);
    });
    
  } catch (error) {
    console.error('Error loading prescriptions:', error);
    const tbody = document.getElementById('prescriptionsTable');
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 2rem; color: var(--error-color);">
          Error loading prescriptions. Please refresh.
        </td>
      </tr>
    `;
  }
}

// Get status badge HTML
function getStatusBadge(status) {
  const badges = {
    pending: '<span class="badge badge-warning">Pending</span>',
    dispensed: '<span class="badge badge-success">Dispensed</span>',
    expired: '<span class="badge badge-error">Expired</span>'
  };
  return badges[status] || '<span class="badge badge-info">Unknown</span>';
}

// Open new prescription modal
function openNewPrescriptionModal() {
  document.getElementById('newPrescriptionModal').classList.add('active');
  document.getElementById('prescriptionForm').reset();
  document.getElementById('medicinesList').innerHTML = '';
  medicineCounter = 0;
  
  // Add one medicine field by default
  addMedicine();
}

// Close modal
function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

// Add medicine field
function addMedicine() {
  medicineCounter++;
  const medicinesList = document.getElementById('medicinesList');
  
  const medicineItem = document.createElement('div');
  medicineItem.className = 'medicine-item';
  medicineItem.id = `medicine-${medicineCounter}`;
  
  medicineItem.innerHTML = `
    <div style="flex: 1;">
      <div class="grid-2" style="gap: 0.5rem;">
        <input 
          type="text" 
          class="form-input" 
          placeholder="Medicine name"
          id="medicineName-${medicineCounter}"
          required
        >
        <input 
          type="text" 
          class="form-input" 
          placeholder="Dosage (e.g., 500mg)"
          id="medicineDosage-${medicineCounter}"
          required
        >
      </div>
      <div class="grid-2" style="gap: 0.5rem; margin-top: 0.5rem;">
        <input 
          type="text" 
          class="form-input" 
          placeholder="Frequency (e.g., 2x daily)"
          id="medicineFrequency-${medicineCounter}"
          required
        >
        <input 
          type="text" 
          class="form-input" 
          placeholder="Duration (e.g., 5 days)"
          id="medicineDuration-${medicineCounter}"
          required
        >
      </div>
    </div>
    <button 
      type="button" 
      class="btn btn-danger btn-sm" 
      onclick="removeMedicine(${medicineCounter})"
      style="margin-left: 0.5rem;"
    >
      ×
    </button>
  `;
  
  medicinesList.appendChild(medicineItem);
}

// Remove medicine field
function removeMedicine(id) {
  const medicineItem = document.getElementById(`medicine-${id}`);
  if (medicineItem) {
    medicineItem.remove();
  }
}

// Handle prescription form submission
document.addEventListener('DOMContentLoaded', () => {
  const prescriptionForm = document.getElementById('prescriptionForm');
  
  if (prescriptionForm) {
    prescriptionForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      utils.showLoading('Creating prescription...');
      
      try {
        // Collect medicines
        const medicines = [];
        const medicinesList = document.getElementById('medicinesList');
        const medicineItems = medicinesList.querySelectorAll('.medicine-item');
        
        medicineItems.forEach(item => {
          const id = item.id.split('-')[1];
          const name = document.getElementById(`medicineName-${id}`).value;
          const dosage = document.getElementById(`medicineDosage-${id}`).value;
          const frequency = document.getElementById(`medicineFrequency-${id}`).value;
          const duration = document.getElementById(`medicineDuration-${id}`).value;
          
          if (name && dosage && frequency && duration) {
            medicines.push({ name, dosage, frequency, duration });
          }
        });
        
        if (medicines.length === 0) {
          throw new Error('Please add at least one medicine');
        }
        
        // Create prescription data
        const prescriptionData = {
          doctorId: currentUser.uid,
          doctorName: doctorProfile.fullName,
          doctorRegistration: doctorProfile.registrationNumber,
          clinicName: doctorProfile.clinicName,
          clinicAddress: doctorProfile.address,
          patientName: document.getElementById('patientName').value,
          patientPhone: '+91' + document.getElementById('patientPhone').value,
          patientAge: parseInt(document.getElementById('patientAge').value) || null,
          diagnosis: document.getElementById('diagnosis').value || null,
          medicines: medicines,
          notes: document.getElementById('notes').value || null,
          status: 'pending',
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        // Save to Firestore
        const docRef = await db.collection('prescriptions').add(prescriptionData);
        
        utils.hideLoading();
        utils.showToast('Prescription created successfully!', 'success');
        
        // Close modal and refresh
        closeModal('newPrescriptionModal');
        await loadStats();
        await loadPrescriptions();
        
      } catch (error) {
        console.error('Error creating prescription:', error);
        utils.hideLoading();
        utils.showToast(error.message || 'Failed to create prescription', 'error');
      }
    });
  }
});

// View prescription details
async function viewPrescription(prescriptionId) {
  utils.showLoading('Loading prescription...');
  
  try {
    const docRef = await db.collection('prescriptions').doc(prescriptionId).get();
    
    if (!docRef.exists) {
      throw new Error('Prescription not found');
    }
    
    const data = docRef.data();
    
    // Build medicines HTML
    let medicinesHtml = '';
    data.medicines.forEach((med, index) => {
      medicinesHtml += `
        <div style="background: var(--gray-50); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 0.5rem;">
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
      <div style="margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h4 style="margin: 0;">Patient Information</h4>
          ${getStatusBadge(data.status)}
        </div>
        <div class="grid-2">
          <div>
            <div style="font-size: 0.875rem; color: var(--gray-600);">Name</div>
            <div style="font-weight: 600;">${data.patientName}</div>
          </div>
          <div>
            <div style="font-size: 0.875rem; color: var(--gray-600);">Phone</div>
            <div style="font-weight: 600;">${utils.formatPhoneNumber(data.patientPhone)}</div>
          </div>
          ${data.patientAge ? `
          <div>
            <div style="font-size: 0.875rem; color: var(--gray-600);">Age</div>
            <div style="font-weight: 600;">${data.patientAge} years</div>
          </div>
          ` : ''}
          ${data.diagnosis ? `
          <div>
            <div style="font-size: 0.875rem; color: var(--gray-600);">Diagnosis</div>
            <div style="font-weight: 600;">${data.diagnosis}</div>
          </div>
          ` : ''}
        </div>
      </div>
      
      <div style="margin-bottom: 1.5rem;">
        <h4>Medicines Prescribed</h4>
        ${medicinesHtml}
      </div>
      
      ${data.notes ? `
      <div style="margin-bottom: 1.5rem;">
        <h4>Additional Notes</h4>
        <div style="background: var(--gray-50); padding: 1rem; border-radius: var(--radius-md);">
          ${data.notes}
        </div>
      </div>
      ` : ''}
      
      <div style="margin-bottom: 1.5rem;">
        <h4>Prescription Details</h4>
        <div class="grid-2">
          <div>
            <div style="font-size: 0.875rem; color: var(--gray-600);">Created</div>
            <div style="font-weight: 600;">${utils.formatDate(data.createdAt)}</div>
          </div>
          ${data.verificationCode ? `
          <div>
            <div style="font-size: 0.875rem; color: var(--gray-600);">Verification Code</div>
            <div style="font-weight: 600; font-family: var(--font-mono);">${data.verificationCode}</div>
          </div>
          ` : ''}
          ${data.dispensedAt ? `
          <div>
            <div style="font-size: 0.875rem; color: var(--gray-600);">Dispensed At</div>
            <div style="font-weight: 600;">${utils.formatDate(data.dispensedAt)}</div>
          </div>
          <div>
            <div style="font-size: 0.875rem; color: var(--gray-600);">Dispensed By</div>
            <div style="font-weight: 600;">${data.chemistName || 'N/A'}</div>
          </div>
          ` : ''}
        </div>
      </div>
      
      ${data.qrCodeUrl ? `
      <div style="text-align: center; padding: 1rem; background: var(--gray-50); border-radius: var(--radius-md);">
        <div style="font-size: 0.875rem; color: var(--gray-600); margin-bottom: 0.5rem;">Patient QR Code</div>
        <img src="${data.qrCodeUrl}" alt="QR Code" style="max-width: 200px;">
      </div>
      ` : ''}
    `;
    
    document.getElementById('prescriptionDetails').innerHTML = detailsHtml;
    document.getElementById('viewPrescriptionModal').classList.add('active');
    
    utils.hideLoading();
    
  } catch (error) {
    console.error('Error loading prescription:', error);
    utils.hideLoading();
    utils.showToast('Failed to load prescription', 'error');
  }
}

// Open templates modal (placeholder)
function openTemplatesModal() {
  utils.showToast('Templates feature coming soon!', 'info');
}

// View analytics (placeholder)
function viewAnalytics() {
  utils.showToast('Analytics feature coming soon!', 'info');
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', initDashboard);
