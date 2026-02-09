const express = require('express');
const { Op } = require('sequelize');
const User = require('../models/User');
const Course = require('../models/Course');
const SessionRequest = require('../models/SessionRequest');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Auth middleware
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.sendStatus(401);
  }
}

// List users
router.get('/users', auth, async (req, res) => {
  const users = await User.findAll({ attributes: ['id', 'email', 'name', 'role'] });
  res.json(users);
});

// List courses
router.get('/courses', auth, async (req, res) => {
  const courses = await Course.findAll();
  res.json(courses);
});

// Request new session
router.post('/sessions/request', auth, async (req, res) => {
  const { courseId, instructorId } = req.body;
  const session = await SessionRequest.create({
    CourseId: courseId,
    InstructorId: instructorId,
    UserId: req.user.userId,
    status: 'pending',
  });
  res.status(201).json(session);
});

// Instructor accept/reject
router.post('/sessions/respond', auth, async (req, res) => {
  const { sessionId, action } = req.body;
  const session = await SessionRequest.findByPk(sessionId);
  if (!session) return res.status(404).json({ error: 'Not found' });
  // Assume validation of instructor
  session.status = action === 'accept' ? 'accepted' : 'rejected';
  await session.save();
  res.json(session);
});

module.exports = router;