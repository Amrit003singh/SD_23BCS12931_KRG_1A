const express = require('express');
const { Message, Match, User } = require('../models');
const { Op } = require('sequelize');
const router = express.Router();

// ⚠️ This route MUST be first (before /:matchId)
// GET unread message count
router.get('/unread/count', async (req, res) => {
  try {
    const userId = req.user.id;

    const matches = await Match.findAll({
      where: {
        [Op.or]: [
          { user1_id: userId },
          { user2_id: userId }
        ]
      }
    });

    const matchIds = matches.map(m => m.id);

    if (matchIds.length === 0) {
      return res.json({ unread: 0 });
    }

    const unreadCount = await Message.count({
      where: {
        match_id: { [Op.in]: matchIds },
        sender_id: { [Op.ne]: userId },
        is_read: false
      }
    });

    res.json({ unread: unreadCount });
  } catch (err) {
    console.error('Error fetching unread count:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET all messages for a match
router.get('/:matchId', async (req, res) => {
  try {
    const { matchId } = req.params;
    const userId = req.user.id;

    const match = await Match.findOne({
      where: { id: matchId }
    });

    if (!match) {
      return res.status(404).json({ error: 'Match not found.' });
    }

    if (match.user1_id !== userId && match.user2_id !== userId) {
      return res.status(403).json({ error: 'Not authorized.' });
    }

    const messages = await Message.findAll({
      where: { match_id: matchId },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'name', 'photo_url']
        }
      ],
      order: [['created_at', 'ASC']]
    });

    // Mark unread as read
    await Message.update(
      { is_read: true },
      {
        where: {
          match_id: matchId,
          sender_id: { [Op.ne]: userId },
          is_read: false
        }
      }
    );

    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST send a new message
router.post('/:matchId', async (req, res) => {
  try {
    const { matchId } = req.params;
    const userId = req.user.id;
    const { content } = req.body;

    console.log(`📨 Sending message - Match: ${matchId}, User: ${userId}`);

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Message content is required.' });
    }

    const match = await Match.findOne({
      where: { id: matchId }
    });

    if (!match) {
      return res.status(404).json({ error: 'Match not found.' });
    }

    if (match.user1_id !== userId && match.user2_id !== userId) {
      return res.status(403).json({ error: 'Not authorized.' });
    }

    const message = await Message.create({
      match_id: parseInt(matchId),
      sender_id: userId,
      content: content.trim()
    });

    const fullMessage = await Message.findByPk(message.id, {
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'name', 'photo_url']
        }
      ]
    });

    console.log(`✅ 💬 Message sent successfully!`);

    res.status(201).json(fullMessage);
  } catch (err) {
    console.error('❌ Error sending message:', err);
    res.status(500).json({ error: 'Server error sending message.' });
  }
});

module.exports = router;