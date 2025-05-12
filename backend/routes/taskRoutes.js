const express = require('express');
const auth = require('../middleware/authMiddleware');
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  toggleStatus
} = require('../controllers/taskController');

const router = express.Router();

router.post('/', auth, createTask);
router.get('/:projectId', auth, getTasks);
router.put('/:id', auth, updateTask);
router.delete('/:id', auth, deleteTask);
router.patch('/:id/status', auth, toggleStatus);

module.exports = router;
