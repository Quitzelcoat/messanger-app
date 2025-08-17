const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getMessages,
  deleteMessage,
} = require('../controllers/messageController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);
router.post('/', sendMessage);
router.get('/', getMessages);

router.delete('/:id', deleteMessage);

module.exports = router;
