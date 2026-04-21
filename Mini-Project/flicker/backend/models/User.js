const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    },
    set(value) {
      this.setDataValue('email', value.toLowerCase().trim());
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 100]
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 50]
    }
  },
  age: {
    type: DataTypes.INTEGER,
    validate: {
      min: 18,
      max: 100
    }
  },
  bio: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  gender: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  interested_in: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  photo_url: {
    type: DataTypes.STRING,
    defaultValue: 'https://ui-avatars.com/api/?background=ff6b6b&color=fff&size=200&name=User'
  },
  location: {
    type: DataTypes.STRING,
    defaultValue: ''
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
      // Set default avatar with user's name
      if (!user.photo_url || user.photo_url.includes('name=User')) {
        user.photo_url = `https://ui-avatars.com/api/?background=ff6b6b&color=fff&size=200&name=${encodeURIComponent(user.name)}`;
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Instance method to compare password
User.prototype.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method to return safe user data (no password)
User.prototype.toSafeJSON = function() {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

module.exports = User;