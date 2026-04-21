const sequelize = require('../config/database');
const User = require('./User');
const Swipe = require('./Swipe');
const Match = require('./Match');
const Message = require('./Message');

// ===================== ASSOCIATIONS =====================

// User <-> Swipes
User.hasMany(Swipe, { foreignKey: 'swiper_id', as: 'swipesMade' });
Swipe.belongsTo(User, { foreignKey: 'swiper_id', as: 'swiper' });

User.hasMany(Swipe, { foreignKey: 'swiped_id', as: 'swipesReceived' });
Swipe.belongsTo(User, { foreignKey: 'swiped_id', as: 'swiped' });

// User <-> Matches
User.hasMany(Match, { foreignKey: 'user1_id', as: 'matchesAsUser1' });
Match.belongsTo(User, { foreignKey: 'user1_id', as: 'user1' });

User.hasMany(Match, { foreignKey: 'user2_id', as: 'matchesAsUser2' });
Match.belongsTo(User, { foreignKey: 'user2_id', as: 'user2' });

// Match <-> Messages
Match.hasMany(Message, { foreignKey: 'match_id', as: 'messages' });
Message.belongsTo(Match, { foreignKey: 'match_id', as: 'match' });

// User <-> Messages
User.hasMany(Message, { foreignKey: 'sender_id', as: 'messagesSent' });
Message.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });

module.exports = {
  sequelize,
  User,
  Swipe,
  Match,
  Message
};