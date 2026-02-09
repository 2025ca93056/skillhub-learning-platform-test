const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const SessionRequest = sequelize.define('SessionRequest', {
  status: { type: DataTypes.ENUM('pending', 'accepted', 'rejected'), defaultValue: 'pending' }
});

module.exports = SessionRequest;