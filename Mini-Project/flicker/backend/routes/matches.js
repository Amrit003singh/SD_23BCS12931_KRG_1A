const express = require('express');
const { Match, User, Message } = require('../models');
const { Op } = require('sequelize');
const router = express.Router();

// GET all matches for current user
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;

    const matches = await Match.findAll({
      where: {
        [Op.or]: [
          { user1_id: userId },
          { user2_id: userId }
        ]
      },
      include: [
        {
          model: User,
          as: 'user1',
          attributes: { exclude: ['password'] }
        },
        {
          model: User,
          as: 'user2',
          attributes: { exclude: ['password'] }
        }
      ],
      order: [['created_at', 'DESC']]
    });

    // Format response - return the OTHER user's info
    const formatted = matches.map(match => {
      const otherUser = match.user1_id === userId ? match.user2 : match.user1;
      return {
        match_id: match.id,
        matched_at: match.created_at,
        user_id: otherUser.id,
        name: otherUser.name,
        age: otherUser.age,
        bio: otherUser.bio,
        photo_url: otherUser.photo_url,
        gender: otherUser.gender,
        location: otherUser.location
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error('Error fetching matches:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// DELETE unmatch
router.delete('/:matchId', async (req, res) => {
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

    // Delete all messages for this match
    await Message.destroy({ where: { match_id: matchId } });

    // Delete match
    await match.destroy();

    console.log(`💔 Match ${matchId} unmatched by user ${userId}`);
    res.json({ message: 'Unmatched successfully.' });
  } catch (err) {
    console.error('Error unmatching:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;