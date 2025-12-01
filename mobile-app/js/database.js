// VeriScript Database Operations
// Complete Firestore CRUD Operations

class DatabaseManager {
  constructor() {
    this.db = firebase.firestore();
    this.cache = new Map();
    this.listeners = new Map();
  }

  // ==================== PRESCRIPTIONS ====================

  // Create prescription
  async createPrescription(prescriptionData) {
    try {
      const user = authManager.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const prescription = {
        doctorId: user.uid,
        doctorName: user.name,
        doctorEmail: user.email,
        patientName: prescriptionData.patientName,
        patientAge: prescriptionData.patientAge,
        patientGender: prescriptionData.patientGender,
        patientPhone: prescriptionData.patientPhone || '',
        diagnosis: prescriptionData.diagnosis,
        medicines: prescriptionData.medicines || [],
        notes: prescriptionData.notes || '',
        followUp: prescriptionData.followUp || '',
        qrCode: '', // Will be generated
        status: 'active',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      const docRef = await this.db.collection('prescriptions').add(prescription);

      // Generate QR code
      const qrCode = await this.generateQRCode(docRef.id);
      await docRef.update({ qrCode });

      // Track usage
      await this.trackPrescriptionUsage(user.uid);

      console.log('✅ Prescription created:', docRef.id);

      return {
        success: true,
        id: docRef.id,
        prescription: { ...prescription, id: docRef.id, qrCode }
      };
    } catch (error) {
      console.error('❌ Create prescription error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get prescription by ID
  async getPrescription(prescriptionId) {
    try {
      // Check cache first
      if (this.cache.has(`prescription_${prescriptionId}`)) {
        return {
          success: true,
          prescription: this.cache.get(`prescription_${prescriptionId}`)
        };
      }

      const doc = await this.db.collection('prescriptions')
        .doc(prescriptionId)
        .get();

      if (!doc.exists) {
        throw new Error('Prescription not found');
      }

      const prescription = {
        id: doc.id,
        ...doc.data()
      };

      // Cache it
      this.cache.set(`prescription_${prescriptionId}`, prescription);

      return {
        success: true,
        prescription
      };
    } catch (error) {
      console.error('❌ Get prescription error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get doctor's prescriptions
  async getDoctorPrescriptions(doctorId, options = {}) {
    try {
      const {
        limit = 20,
        startAfter = null,
        status = 'all',
        orderBy = 'createdAt',
        orderDirection = 'desc'
      } = options;

      let query = this.db.collection('prescriptions')
        .where('doctorId', '==', doctorId)
        .orderBy(orderBy, orderDirection);

      if (status !== 'all') {
        query = query.where('status', '==', status);
      }

      if (startAfter) {
        query = query.startAfter(startAfter);
      }

      query = query.limit(limit);

      const snapshot = await query.get();

      const prescriptions = [];
      snapshot.forEach(doc => {
        prescriptions.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return {
        success: true,
        prescriptions,
        lastDoc: snapshot.docs[snapshot.docs.length - 1],
        hasMore: snapshot.docs.length === limit
      };
    } catch (error) {
      console.error('❌ Get doctor prescriptions error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update prescription
  async updatePrescription(prescriptionId, updates) {
    try {
      await this.db.collection('prescriptions')
        .doc(prescriptionId)
        .update({
          ...updates,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

      // Clear cache
      this.cache.delete(`prescription_${prescriptionId}`);

      console.log('✅ Prescription updated:', prescriptionId);

      return { success: true };
    } catch (error) {
      console.error('❌ Update prescription error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Delete prescription
  async deletePrescription(prescriptionId) {
    try {
      await this.db.collection('prescriptions')
        .doc(prescriptionId)
        .delete();

      // Clear cache
      this.cache.delete(`prescription_${prescriptionId}`);

      console.log('✅ Prescription deleted:', prescriptionId);

      return { success: true };
    } catch (error) {
      console.error('❌ Delete prescription error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Search prescriptions
  async searchPrescriptions(searchTerm, doctorId) {
    try {
      // Firestore doesn't support full-text search
      // We'll search by patient name (case-insensitive)
      const snapshot = await this.db.collection('prescriptions')
        .where('doctorId', '==', doctorId)
        .orderBy('patientName')
        .startAt(searchTerm.toUpperCase())
        .endAt(searchTerm.toUpperCase() + '\uf8ff')
        .limit(20)
        .get();

      const prescriptions = [];
      snapshot.forEach(doc => {
        prescriptions.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return {
        success: true,
        prescriptions
      };
    } catch (error) {
      console.error('❌ Search prescriptions error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ==================== PATIENTS ====================

  // Create/Update patient
  async savePatient(patientData) {
    try {
      const user = authManager.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const patient = {
        doctorId: user.uid,
        name: patientData.name,
        age: patientData.age,
        gender: patientData.gender,
        phone: patientData.phone || '',
        email: patientData.email || '',
        address: patientData.address || '',
        medicalHistory: patientData.medicalHistory || '',
        allergies: patientData.allergies || '',
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      if (patientData.id) {
        // Update existing
        await this.db.collection('patients')
          .doc(patientData.id)
          .update(patient);

        return {
          success: true,
          id: patientData.id
        };
      } else {
        // Create new
        patient.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        const docRef = await this.db.collection('patients').add(patient);

        return {
          success: true,
          id: docRef.id
        };
      }
    } catch (error) {
      console.error('❌ Save patient error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get doctor's patients
  async getDoctorPatients(doctorId, options = {}) {
    try {
      const { limit = 50, orderBy = 'name' } = options;

      const snapshot = await this.db.collection('patients')
        .where('doctorId', '==', doctorId)
        .orderBy(orderBy)
        .limit(limit)
        .get();

      const patients = [];
      snapshot.forEach(doc => {
        patients.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return {
        success: true,
        patients
      };
    } catch (error) {
      console.error('❌ Get patients error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ==================== ANALYTICS ====================

  // Get dashboard stats
  async getDashboardStats(doctorId) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const thisMonth = new Date();
      thisMonth.setDate(1);
      thisMonth.setHours(0, 0, 0, 0);

      // Total prescriptions
      const totalSnapshot = await this.db.collection('prescriptions')
        .where('doctorId', '==', doctorId)
        .get();

      // Today's prescriptions
      const todaySnapshot = await this.db.collection('prescriptions')
        .where('doctorId', '==', doctorId)
        .where('createdAt', '>=', today)
        .get();

      // This month's prescriptions
      const monthSnapshot = await this.db.collection('prescriptions')
        .where('doctorId', '==', doctorId)
        .where('createdAt', '>=', thisMonth)
        .get();

      // Total patients
      const patientsSnapshot = await this.db.collection('patients')
        .where('doctorId', '==', doctorId)
        .get();

      return {
        success: true,
        stats: {
          totalPrescriptions: totalSnapshot.size,
          todayPrescriptions: todaySnapshot.size,
          monthPrescriptions: monthSnapshot.size,
          totalPatients: patientsSnapshot.size
        }
      };
    } catch (error) {
      console.error('❌ Get dashboard stats error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Track prescription usage
  async trackPrescriptionUsage(userId) {
    try {
      await this.db.collection('usage').add({
        userId,
        type: 'prescription',
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
    } catch (error) {
      console.error('❌ Track usage error:', error);
    }
  }

  // Track voice usage
  async trackVoiceUsage(userId, data) {
    try {
      await this.db.collection('voiceUsage').add({
        userId,
        transcriptLength: data.transcriptLength || 0,
        processingTime: data.processingTime || 0,
        success: data.success || false,
        cost: data.cost || 0,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
    } catch (error) {
      console.error('❌ Track voice usage error:', error);
    }
  }

  // ==================== REAL-TIME LISTENERS ====================

  // Listen to prescription changes
  listenToPrescription(prescriptionId, callback) {
    const unsubscribe = this.db.collection('prescriptions')
      .doc(prescriptionId)
      .onSnapshot(
        (doc) => {
          if (doc.exists) {
            callback({
              success: true,
              prescription: {
                id: doc.id,
                ...doc.data()
              }
            });
          }
        },
        (error) => {
          console.error('❌ Listen to prescription error:', error);
          callback({
            success: false,
            error: error.message
          });
        }
      );

    this.listeners.set(`prescription_${prescriptionId}`, unsubscribe);
    return unsubscribe;
  }

  // Listen to doctor's prescriptions
  listenToDoctorPrescriptions(doctorId, callback, options = {}) {
    const { limit = 20, status = 'all' } = options;

    let query = this.db.collection('prescriptions')
      .where('doctorId', '==', doctorId)
      .orderBy('createdAt', 'desc')
      .limit(limit);

    if (status !== 'all') {
      query = query.where('status', '==', status);
    }

    const unsubscribe = query.onSnapshot(
      (snapshot) => {
        const prescriptions = [];
        snapshot.forEach(doc => {
          prescriptions.push({
            id: doc.id,
            ...doc.data()
          });
        });

        callback({
          success: true,
          prescriptions
        });
      },
      (error) => {
        console.error('❌ Listen to prescriptions error:', error);
        callback({
          success: false,
          error: error.message
        });
      }
    );

    this.listeners.set(`prescriptions_${doctorId}`, unsubscribe);
    return unsubscribe;
  }

  // Unsubscribe from listener
  unsubscribe(key) {
    const unsubscribe = this.listeners.get(key);
    if (unsubscribe) {
      unsubscribe();
      this.listeners.delete(key);
    }
  }

  // Unsubscribe from all listeners
  unsubscribeAll() {
    this.listeners.forEach(unsubscribe => unsubscribe());
    this.listeners.clear();
  }

  // ==================== HELPERS ====================

  // Generate QR code data
  async generateQRCode(prescriptionId) {
    const baseUrl = window.location.origin;
    return `${baseUrl}/pages/patient/view-prescription.html?id=${prescriptionId}`;
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }
}

// Create global database manager instance
const dbManager = new DatabaseManager();

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DatabaseManager, dbManager };
}

console.log('✅ Database module loaded');
