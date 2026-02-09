require('dotenv').config();
const express = require('express');
const sequelize = require('./sequelize');
const User = require('./models/User');
const Course = require('./models/Course');
const SessionRequest = require('./models/SessionRequest');
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 4000;

(async () => {
  await sequelize.sync();
  app.listen(PORT, () => console.log(`Backend running on ${PORT}`));
})();