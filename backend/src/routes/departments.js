const express = require('express');
const router = express.Router();
const departmentsController = require('../controllers/departmentsController');

// GET /api/departments - Get all departments
router.get('/', departmentsController.getAllDepartments);

// GET /api/departments/:id - Get single department
router.get('/:id', departmentsController.getDepartmentById);

// POST /api/departments - Create new department
router.post('/', departmentsController.createDepartment);

module.exports = router;