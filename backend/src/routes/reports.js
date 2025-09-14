const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');

// GET /api/reports - Get all reports with filtering
router.get('/', reportsController.getAllReports);

// GET /api/reports/:id - Get single report
router.get('/:id', reportsController.getReportById);

// POST /api/reports - Create new report (from mobile app)
router.post('/', reportsController.createReport);

// PUT /api/reports/:id/verify - Verify a report
router.put('/:id/verify', reportsController.verifyReport);

// PUT /api/reports/:id/reject - Reject a report with reason
router.put('/:id/reject', reportsController.rejectReport);

// PUT /api/reports/:id/forward - Forward report to department
router.put('/:id/forward', reportsController.forwardReport);

// PUT /api/reports/:id/status - Update report status
router.put('/:id/status', reportsController.updateReportStatus);

module.exports = router;