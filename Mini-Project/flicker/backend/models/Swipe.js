const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Swipe = sequelize.define('Swipe', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  swiper_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  swiped_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  direction: {
    type: DataTypes.ENUM('left', 'right'),
    allowNull: false
  }
}, {
  tableName: 'swipes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  indexes: [
    {
      unique: true,
      fields: ['swiper_id', 'swiped_id']
    }
  ]
});

module.exports = Swipe;