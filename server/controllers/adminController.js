const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const HealthCamp = require('../models/HealthCamp');
const Registration = require('../models/Registration');

const generateToken = (adminId) => {
  return jwt.sign(
    { id: adminId },
    process.env.JWT_SECRET || 'community_health_camp_super_secret_jwt_key_2026',
    { expiresIn: '7d' }
  );
};

// @desc    Register new Admin account
// @route   POST /api/admin/register
const registerAdmin = async (req, res) => {
  try {
    const { username, password, confirmPassword } = req.body;

    if (!username || !username.trim()) {
      return res.status(400).json({ message: 'Username is required.' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password is required and must be at least 6 characters.' });
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      return res.status(400).json({ message: 'Confirm password must match password.' });
    }

    // Check if username already exists in MongoDB
    const existingAdmin = await Admin.findOne({ username: username.trim() });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Username already exists.' });
    }

    // Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save admin document to MongoDB
    const newAdmin = await Admin.create({
      username: username.trim(),
      password: hashedPassword,
    });

    res.status(201).json({
      message: 'Admin account created successfully.',
      admin: {
        id: newAdmin._id,
        username: newAdmin.username,
        createdAt: newAdmin.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error creating admin account', error: error.message });
  }
};

// @desc    Admin login
// @route   POST /api/admin/login
const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Invalid username or password.' });
    }

    // 1. Authenticate against MongoDB Admin collection
    const admin = await Admin.findOne({ username: username.trim() });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    // 2. Compare entered password with stored bcrypt hash
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    // 3. Generate JWT Token
    const token = generateToken(admin._id);

    res.json({
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server login error', error: error.message });
  }
};

// @desc    Get all camps for admin dashboard
// @route   GET /api/admin/camps
const getAllCampsAdmin = async (req, res) => {
  try {
    const camps = await HealthCamp.find().sort({ createdAt: -1 }).lean();

    const campsWithCounts = await Promise.all(
      camps.map(async (camp) => {
        const registrationCount = await Registration.countDocuments({ campId: camp._id });
        return {
          ...camp,
          registeredParticipants: registrationCount,
        };
      })
    );

    res.json(campsWithCounts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching camps', error: error.message });
  }
};

// @desc    Create new health camp
// @route   POST /api/admin/camps
const createCamp = async (req, res) => {
  try {
    const {
      campNameEnglish,
      campNameTelugu,
      organizerName,
      campType,
      date,
      startTime,
      endTime,
      location,
      address,
      descriptionEnglish,
      descriptionTelugu,
      servicesEnglish,
      servicesTelugu,
      contactNumber,
      maxParticipants,
      status,
    } = req.body;

    // Validation
    if (!campNameEnglish || !organizerName || !campType || !date || !startTime || !endTime || !location || !address || !descriptionEnglish || !servicesEnglish || !contactNumber || !maxParticipants) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const newCamp = await HealthCamp.create({
      campNameEnglish: campNameEnglish.trim(),
      campNameTelugu: campNameTelugu ? campNameTelugu.trim() : '',
      organizerName: organizerName.trim(),
      campType,
      date,
      startTime,
      endTime,
      location: location.trim(),
      address: address.trim(),
      descriptionEnglish: descriptionEnglish.trim(),
      descriptionTelugu: descriptionTelugu ? descriptionTelugu.trim() : '',
      servicesEnglish: servicesEnglish.trim(),
      servicesTelugu: servicesTelugu ? servicesTelugu.trim() : '',
      contactNumber: contactNumber.trim(),
      maxParticipants: Number(maxParticipants),
      status: status || 'Upcoming',
    });

    res.status(201).json({ message: 'Health camp created successfully', camp: newCamp });
  } catch (error) {
    res.status(500).json({ message: 'Error creating camp', error: error.message });
  }
};

// @desc    Update health camp
// @route   PUT /api/admin/camps/:id
const updateCamp = async (req, res) => {
  try {
    const camp = await HealthCamp.findById(req.params.id);
    if (!camp) {
      return res.status(404).json({ message: 'Health camp not found' });
    }

    const updatedCamp = await HealthCamp.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json({ message: 'Health camp updated successfully', camp: updatedCamp });
  } catch (error) {
    res.status(500).json({ message: 'Error updating camp', error: error.message });
  }
};

// @desc    Delete health camp
// @route   DELETE /api/admin/camps/:id
const deleteCamp = async (req, res) => {
  try {
    const camp = await HealthCamp.findById(req.params.id);
    if (!camp) {
      return res.status(404).json({ message: 'Health camp not found' });
    }

    await HealthCamp.findByIdAndDelete(req.params.id);
    await Registration.deleteMany({ campId: req.params.id });

    res.json({ message: 'Health camp and related registrations deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting camp', error: error.message });
  }
};

// @desc    Cancel health camp
// @route   PUT /api/admin/camps/:id/cancel
const cancelCamp = async (req, res) => {
  try {
    const camp = await HealthCamp.findById(req.params.id);
    if (!camp) {
      return res.status(404).json({ message: 'Health camp not found' });
    }

    camp.status = 'Cancelled';
    await camp.save();

    res.json({ message: 'Health camp status updated to Cancelled', camp });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling camp', error: error.message });
  }
};

// @desc    Get all registrations for admin
// @route   GET /api/admin/registrations
const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate('campId', 'campNameEnglish campNameTelugu organizerName date location')
      .sort({ registeredAt: -1 })
      .lean();

    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching registrations', error: error.message });
  }
};

// @desc    Get registrations for a specific camp
// @route   GET /api/admin/camps/:id/registrations
const getCampRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ campId: req.params.id })
      .sort({ registeredAt: -1 })
      .lean();

    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching camp registrations', error: error.message });
  }
};

module.exports = {
  loginAdmin,
  registerAdmin,
  getAllCampsAdmin,
  createCamp,
  updateCamp,
  deleteCamp,
  cancelCamp,
  getAllRegistrations,
  getCampRegistrations,
};
