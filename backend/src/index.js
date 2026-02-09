require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./sequelize');
const User = require('./models/User');
const Course = require('./models/Course');
const SessionRequest = require('./models/SessionRequest');
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');

const app = express();

// CORS: allow frontend at localhost (dev) and Netlify (prod)
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL || '',
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 4000;

async function start() {
  // Model associations
  // Instructor (User) -> Course
  User.hasMany(Course, { as: 'courses', foreignKey: 'InstructorId' });
  Course.belongsTo(User, { as: 'instructor', foreignKey: 'InstructorId' });

  // SessionRequest associations
  SessionRequest.belongsTo(Course);
  SessionRequest.belongsTo(User); // requester
  SessionRequest.belongsTo(User, { as: 'Instructor', foreignKey: 'InstructorId' });
  User.hasMany(SessionRequest);
  User.hasMany(SessionRequest, { as: 'instructorSessions', foreignKey: 'InstructorId' });

  await sequelize.sync();
  return app.listen(PORT, () => console.log(`Backend running on ${PORT}`));
}

if (require.main === module) {
  start();
}

module.exports = { app, start };