const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');

// POST /api/mobile/reports - Receive new reports from mobile app
router.post('/reports', reportsController.createReport);

// GET /api/mobile/reports/:id - Get report status for mobile app
router.get('/reports/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = require('../config/supabase');
    
    // Get report with department info
    const { data: report, error } = await supabase
      .from('reports')
      .select(`
        id,
        title,
        status,
        verified,
        created_at,
        updated_at,
        admin_notes,
        departments(name)
      `)
      .eq('id', id)
      .single();

    if (error || !report) {
      return res.status(404).json({
        success: false,
        error: 'Report not found'
      });
    }
    
    // Return mobile-friendly response
    const mobileResponse = {
      id: report.id,
      title: report.title,
      status: report.status,
      verified: report.verified,
      created_at: report.created_at,
      updated_at: report.updated_at,
      admin_notes: report.admin_notes || null,
      department: report.departments?.name || null
    };
    
    res.json({
      success: true,
      data: mobileResponse
    });
  } catch (error) {
    console.error('Mobile API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch report status'
    });
  }
});

module.exports = router;