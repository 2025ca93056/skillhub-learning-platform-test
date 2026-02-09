const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const User = sequelize.define('User', {
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false }, // hashed
  name: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('student', 'instructor'), defaultValue: 'student' }
});

module.exports = User;