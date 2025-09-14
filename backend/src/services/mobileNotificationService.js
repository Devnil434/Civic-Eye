const supabase = require('../config/supabase');

// Mobile app notification service
class MobileNotificationService {
  
  // Send status update to citizen's mobile app
  static async notifyStatusUpdate(reportId, status, message, citizenDetails) {
    try {
      const notification = {
        report_id: reportId,
        recipient_phone: citizenDetails.phone,
        recipient_email: citizenDetails.email,
        notification_type: 'status_update',
        title: `Report Status Updated`,
        message: message,
        status: status,
        sent_at: new Date().toISOString(),
        delivery_status: 'pending'
      };

      // Store notification in database for tracking
      const { data, error } = await supabase
        .from('notifications')
        .insert([notification])
        .select()
        .single();

      if (error) {
        console.error('Failed to store notification:', error);
        return false;
      }

      // Mock push notification (replace with actual service like FCM)
      await this.sendPushNotification(notification);
      
      // Mock SMS notification (replace with actual SMS service)
      await this.sendSMSNotification(notification);

      // Update delivery status
      await supabase
        .from('notifications')
        .update({ delivery_status: 'sent' })
        .eq('id', data.id);

      console.log(`📱 Mobile notification sent for report ${reportId}`);
      return true;
      
    } catch (error) {
      console.error('Mobile notification failed:', error);
      return false;
    }
  }

  // Send push notification to mobile app
  static async sendPushNotification(notification) {
    // Mock implementation - replace with Firebase Cloud Messaging (FCM)
    const pushData = {
      to: `/topics/user_${notification.recipient_phone}`, // FCM topic
      notification: {
        title: notification.title,
        body: notification.message,
        icon: 'report_icon',
        click_action: `REPORT_${notification.report_id}`
      },
      data: {
        report_id: notification.report_id,
        status: notification.status,
        type: notification.notification_type
      }
    };

    console.log('🔔 Mock Push Notification:', pushData);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return true;
  }

  // Send SMS notification
  static async sendSMSNotification(notification) {
    // Mock implementation - replace with SMS service like Twilio
    const smsData = {
      to: notification.recipient_phone,
      from: '+91-JANTA-SEVA',
      body: `Janta Seva Update: ${notification.message}. Check your app for details. Report ID: ${notification.report_id}`
    };

    console.log('📱 Mock SMS:', smsData);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    return true;
  }

  // Notify citizen when report is approved
  static async notifyReportApproved(report, adminNotes) {
    const message = `Your report "${report.title}" has been approved and verified. ${adminNotes ? 'Admin notes: ' + adminNotes : 'Action will be taken soon.'}`;
    
    return await this.notifyStatusUpdate(
      report.id,
      'approved',
      message,
      {
        phone: report.reporter_phone,
        email: report.reporter_email
      }
    );
  }

  // Notify citizen when report is rejected
  static async notifyReportRejected(report, rejectReason) {
    const message = `Your report "${report.title}" has been reviewed. Reason: ${rejectReason}. You can submit a new report with additional details if needed.`;
    
    return await this.notifyStatusUpdate(
      report.id,
      'rejected',
      message,
      {
        phone: report.reporter_phone,
        email: report.reporter_email
      }
    );
  }

  // Notify citizen when report is forwarded to department
  static async notifyReportForwarded(report, departmentName) {
    const message = `Your report "${report.title}" has been forwarded to ${departmentName} for action. You will receive updates on progress.`;
    
    return await this.notifyStatusUpdate(
      report.id,
      'forwarded',
      message,
      {
        phone: report.reporter_phone,
        email: report.reporter_email
      }
    );
  }

  // Notify citizen when report status changes (in-progress, resolved, etc.)
  static async notifyStatusChange(report, newStatus, updateMessage) {
    const statusMessages = {
      'in_progress': `Work has started on your report "${report.title}". ${updateMessage || 'Our team is actively working on this issue.'}`,
      'resolved': `Great news! Your report "${report.title}" has been resolved. ${updateMessage || 'Thank you for using Janta Seva.'}`,
      'closed': `Your report "${report.title}" has been closed. ${updateMessage || 'If you still face issues, please submit a new report.'}`
    };

    const message = statusMessages[newStatus] || `Your report "${report.title}" status has been updated to ${newStatus}. ${updateMessage}`;
    
    return await this.notifyStatusUpdate(
      report.id,
      newStatus,
      message,
      {
        phone: report.reporter_phone,
        email: report.reporter_email
      }
    );
  }

  // Get notification history for a report
  static async getNotificationHistory(reportId) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('report_id', reportId)
        .order('sent_at', { ascending: false });

      if (error) {
        console.error('Failed to fetch notification history:', error);
        return [];
      }

      return data;
    } catch (error) {
      console.error('Error getting notification history:', error);
      return [];
    }
  }
}

module.exports = MobileNotificationService;