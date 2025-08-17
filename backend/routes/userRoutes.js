const express = require('express');
const router = express.Router();

const { getUsers, getUserById } = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getUsers);
router.get('/:id', authMiddleware, getUserById);

module.exports = router;
