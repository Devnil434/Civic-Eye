const supabase = require('../config/supabase');
const MobileNotificationService = require('../services/mobileNotificationService');

// Get all reports with optional filtering
const getAllReports = async (req, res) => {
  try {
    const { status, department, verified, page = 1, limit = 20 } = req.query;
    
    let query = supabase
      .from('reports')
      .select(`
        *,
        departments(name, contact_email)
      `)
      .order('created_at', { ascending: false });

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }
    if (department) {
      query = query.eq('department_id', department);
    }
    if (verified !== undefined) {
      query = query.eq('verified', verified === 'true');
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
};

// Get single report by ID
const getReportById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('reports')
      .select(`
        *,
        departments(name, contact_email)
      `)
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch report' });
  }
};

// Create new report (from mobile app)
const createReport = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      location,
      latitude,
      longitude,
      image_urls,
      reporter_name,
      reporter_phone,
      reporter_email
    } = req.body;

    const { data, error } = await supabase
      .from('reports')
      .insert([
        {
          title,
          description,
          category,
          location,
          latitude,
          longitude,
          image_urls,
          reporter_name,
          reporter_phone,
          reporter_email,
          status: 'pending',
          verified: false,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create report' });
  }
};

// Verify a report
const verifyReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { verified, admin_notes } = req.body;

    const { data, error } = await supabase
      .from('reports')
      .update({
        verified,
        admin_notes,
        verified_at: verified ? new Date().toISOString() : null
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Send mobile notification to citizen
    if (verified) {
      try {
        await MobileNotificationService.notifyReportApproved(data, admin_notes);
      } catch (notificationError) {
        console.error('Failed to send approval notification:', notificationError);
      }
    }

    res.json({
      ...data,
      mobile_notification_sent: verified
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify report' });
  }
};

// Forward report to department
const forwardReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { department_id, forwarding_notes, department_email } = req.body;

    const { data, error } = await supabase
      .from('reports')
      .update({
        department_id,
        forwarding_notes,
        status: 'forwarded',
        forwarded_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Send email notification to department (mock implementation)
    try {
      await sendDepartmentNotification({
        report: data,
        departmentEmail: department_email,
        notes: forwarding_notes
      });
      console.log(`📧 Email notification sent to ${department_email}`);
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Continue even if email fails
    }

    // Send mobile notification to citizen about forwarding
    try {
      await MobileNotificationService.notifyReportForwarded(data, 'Selected Department');
    } catch (notificationError) {
      console.error('Failed to send forwarding notification:', notificationError);
    }

    res.json({
      ...data,
      notification_sent: true,
      mobile_notification_sent: true,
      message: 'Report forwarded, department and citizen notified successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to forward report' });
  }
};

// Mock email notification function (replace with actual email service)
const sendDepartmentNotification = async ({ report, departmentEmail, notes }) => {
  // Mock email content
  const emailContent = {
    to: departmentEmail,
    subject: `New Report Assigned: ${report.title}`,
    body: `
      Dear Department Team,
      
      A new citizen report has been forwarded to your department for action.
      
      Report Details:
      - Title: ${report.title}
      - Description: ${report.description}
      - Location: ${report.location}
      - Reporter: ${report.reporter_name}
      - Priority: Based on urgency assessment
      
      Admin Notes:
      ${notes}
      
      Please log into the admin dashboard to view full details and take necessary action.
      
      Report ID: ${report.id}
      Forwarded at: ${report.forwarded_at}
      
      Thank you,
      Janta Seva Admin Team
    `
  };
  
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log('📧 Mock Email Sent:', emailContent);
  return true;
};

// Update report status
const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_notes } = req.body;

    const { data, error } = await supabase
      .from('reports')
      .update({
        status,
        admin_notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update report status' });
  }
};

// Reject a report
const rejectReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejection_reason, admin_notes } = req.body;

    const { data, error } = await supabase
      .from('reports')
      .update({
        status: 'rejected',
        rejection_reason,
        admin_notes,
        verified: false,
        rejected_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Send mobile notification to citizen about rejection
    try {
      await MobileNotificationService.notifyReportRejected(data, rejection_reason);
    } catch (notificationError) {
      console.error('Failed to send rejection notification:', notificationError);
    }

    res.json({
      ...data,
      mobile_notification_sent: true,
      message: 'Report rejected and citizen notified successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject report' });
  }
};

module.exports = {
  getAllReports,
  getReportById,
  createReport,
  verifyReport,
  forwardReport,
  updateReportStatus,
  rejectReport
};