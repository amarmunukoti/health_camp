const HealthCamp = require('../models/HealthCamp');
const Registration = require('../models/Registration');

// Helper to auto-update camps whose date has passed
const autoUpdateCampStatuses = async () => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    await HealthCamp.updateMany(
      { date: { $lt: todayStr }, status: 'Upcoming' },
      { $set: { status: 'Completed' } }
    );
  } catch (err) {
    console.error('Error auto-updating camp statuses:', err.message);
  }
};

// @desc    Get all health camps with registration counts
// @route   GET /api/camps
const getAllCamps = async (req, res) => {
  try {
    await autoUpdateCampStatuses();

    const camps = await HealthCamp.find().sort({ date: 1, createdAt: -1 }).lean();

    // Attach registration count to each camp
    const campsWithCounts = await Promise.all(
      camps.map(async (camp) => {
        const registrationCount = await Registration.countDocuments({ campId: camp._id });
        return {
          ...camp,
          registeredParticipants: registrationCount,
          availableSlots: Math.max(0, camp.maxParticipants - registrationCount),
        };
      })
    );

    res.json(campsWithCounts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching camps', error: error.message });
  }
};

// @desc    Get upcoming health camps only
// @route   GET /api/camps/upcoming
const getUpcomingCamps = async (req, res) => {
  try {
    await autoUpdateCampStatuses();

    const camps = await HealthCamp.find({ status: 'Upcoming' }).sort({ date: 1 }).lean();

    const campsWithCounts = await Promise.all(
      camps.map(async (camp) => {
        const registrationCount = await Registration.countDocuments({ campId: camp._id });
        return {
          ...camp,
          registeredParticipants: registrationCount,
          availableSlots: Math.max(0, camp.maxParticipants - registrationCount),
        };
      })
    );

    res.json(campsWithCounts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching upcoming camps', error: error.message });
  }
};

// @desc    Get single camp by ID
// @route   GET /api/camps/:id
const getCampById = async (req, res) => {
  try {
    await autoUpdateCampStatuses();

    const camp = await HealthCamp.findById(req.params.id).lean();
    if (!camp) {
      return res.status(404).json({ message: 'Health camp not found' });
    }

    const registrationCount = await Registration.countDocuments({ campId: camp._id });

    res.json({
      ...camp,
      registeredParticipants: registrationCount,
      availableSlots: Math.max(0, camp.maxParticipants - registrationCount),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching camp details', error: error.message });
  }
};

// @desc    Register citizen for a camp
// @route   POST /api/camps/:id/register
const registerCitizen = async (req, res) => {
  try {
    const campId = req.params.id;
    const { fullName, age, gender, mobileNumber, address } = req.body;
    const userId = req.user._id;

    // 1. Validation
    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ message: 'Full name is required' });
    }
    if (!age || isNaN(age) || age < 1 || age > 120) {
      return res.status(400).json({ message: 'Please enter a valid age between 1 and 120' });
    }
    if (!gender || !['Male', 'Female', 'Other'].includes(gender)) {
      return res.status(400).json({ message: 'Please select a valid gender' });
    }
    if (!mobileNumber || !/^[0-9]{10}$/.test(mobileNumber.trim())) {
      return res.status(400).json({ message: 'Please enter a valid 10-digit mobile number' });
    }
    if (!address || !address.trim()) {
      return res.status(400).json({ message: 'Address is required' });
    }

    // 2. Check camp existence & status
    const camp = await HealthCamp.findById(campId);
    if (!camp) {
      return res.status(404).json({ message: 'Health camp not found' });
    }
    if (camp.status === 'Cancelled') {
      return res.status(400).json({ message: 'Registration disabled: This health camp has been cancelled' });
    }
    if (camp.status === 'Completed') {
      return res.status(400).json({ message: 'Registration disabled: This health camp has already ended' });
    }

    // 3. Check capacity limit
    const currentRegCount = await Registration.countDocuments({ campId });
    if (currentRegCount >= camp.maxParticipants) {
      return res.status(400).json({ message: 'Registration full: Maximum participant limit has been reached' });
    }

    // 4. Check duplicate mobile registration for same camp
    const existingRegistration = await Registration.findOne({
      campId,
      mobileNumber: mobileNumber.trim(),
    });
    if (existingRegistration) {
      return res.status(400).json({
        message: 'Duplicate Registration: This mobile number is already registered for this health camp',
      });
    }

    // 5. Generate unique Registration ID
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const registrationId = `REG-${Date.now().toString().slice(-6)}-${randomNum}`;

    // 6. Save registration
    const registration = await Registration.create({
      registrationId,
      campId,
      userId,
      fullName: fullName.trim(),
      age: Number(age),
      gender,
      mobileNumber: mobileNumber.trim(),
      address: address.trim(),
    });

    res.status(201).json({
      message: 'Registration Successful!',
      registration: {
        registrationId: registration.registrationId,
        fullName: registration.fullName,
        age: registration.age,
        gender: registration.gender,
        mobileNumber: registration.mobileNumber,
        address: registration.address,
        registeredAt: registration.registeredAt,
        camp: {
          id: camp._id,
          campNameEnglish: camp.campNameEnglish,
          campNameTelugu: camp.campNameTelugu,
          organizerName: camp.organizerName,
          date: camp.date,
          startTime: camp.startTime,
          endTime: camp.endTime,
          location: camp.location,
          address: camp.address,
          contactNumber: camp.contactNumber,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

module.exports = {
  getAllCamps,
  getUpcomingCamps,
  getCampById,
  registerCitizen,
};
