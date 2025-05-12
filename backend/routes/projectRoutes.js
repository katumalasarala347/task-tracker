const express = require('express');
const auth = require('../middleware/authMiddleware');
const { createProject, getProjects } = require('../controllers/projectController');
const router = express.Router();

router.post('/', auth, createProject);
router.get('/', auth, getProjects);

module.exports = router;
