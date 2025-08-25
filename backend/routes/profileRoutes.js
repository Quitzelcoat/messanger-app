const express = require('express');
const router = express.Router();
const {
  getMe,
  updateMe,
  changePassword,
} = require('../controllers/profileController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/me', authMiddleware, getMe);
router.put('/me', authMiddleware, updateMe);
router.put('/me/password', authMiddleware, changePassword);

module.exports = router;
