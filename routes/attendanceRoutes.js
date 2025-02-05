const express = require('express');
const Attendance = require('../models/Attendance');
const router = express.Router();
const { sendSMS, sendEmail } = require('../utils/notifications');
const { generatePDFReport, generateExcelReport } = require('../utils/reports');

// Check-In
router.post('/checkin', async (req, res) => {
  const { userId } = req.body;
  try {
    const attendance = new Attendance({ userId });
    await attendance.save();
    res.status(201).json({ message: 'Check-in successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check-Out
router.post('/checkout', async (req, res) => {
  const { attendanceId } = req.body;
  try {
    const attendance = await Attendance.findById(attendanceId);
    if (!attendance) return res.status(404).json({ message: 'Attendance record not found' });

    attendance.checkOut = Date.now();
    await attendance.save();
    res.status(200).json({ message: 'Check-out successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Notify if a user is late
router.post('/checkin', async (req, res) => {
  const { userId } = req.body;
  try {
    const attendance = new Attendance({ userId });
    await attendance.save();

    // Example notification logic
    const user = await User.findById(userId);
    const now = new Date();
    const lateThreshold = new Date();
    lateThreshold.setHours(9, 0, 0); // 9:00 AM
    if (now > lateThreshold) {
      sendSMS(user.phone, 'You are late today!');
      sendEmail(user.email, 'Late Attendance Alert', 'You checked in late today.');
    }

    res.status(201).json({ message: 'Check-in successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/reports', async (req, res) => {
  const { startDate, endDate, userId } = req.query;
  try {
    const query = {};
    if (startDate && endDate) {
      query.checkIn = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (userId) {
      query.userId = userId;
    }

    const data = await Attendance.find(query).populate('userId');
    const fileType = req.query.type || 'pdf';
    const fileName = `attendance_report.${fileType}`;

    if (fileType === 'pdf') {
      generatePDFReport(data, fileName);
    } else if (fileType === 'excel') {
      await generateExcelReport(data, fileName);
    }

    res.download(fileName);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
