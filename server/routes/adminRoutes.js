const express = require('express');
const router = express.Router();
const {
  loginAdmin,
  registerAdmin,
  getAllCampsAdmin,
  createCamp,
  updateCamp,
  deleteCamp,
  cancelCamp,
  getAllRegistrations,
  getCampRegistrations,
} = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/authMiddleware');

// Public admin authentication & creation
router.post('/login', loginAdmin);
router.post('/register', registerAdmin);

// Protected admin routes
router.get('/camps', protectAdmin, getAllCampsAdmin);
router.post('/camps', protectAdmin, createCamp);
router.put('/camps/:id', protectAdmin, updateCamp);
router.delete('/camps/:id', protectAdmin, deleteCamp);
router.put('/camps/:id/cancel', protectAdmin, cancelCamp);
router.get('/registrations', protectAdmin, getAllRegistrations);
router.get('/camps/:id/registrations', protectAdmin, getCampRegistrations);

module.exports = router;
