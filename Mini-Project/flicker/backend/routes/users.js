const express = require('express');
const { User, Swipe } = require('../models');
const { Op } = require('sequelize');
const router = express.Router();

// GET current user profile
router.get('/me', async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json(user.toSafeJSON());
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// UPDATE current user profile
router.put('/me', async (req, res) => {
  try {
    const { name, age, bio, gender, interested_in, photo_url, location } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    await user.update({
      name: name || user.name,
      age: age !== undefined ? age : user.age,
      bio: bio !== undefined ? bio : user.bio,
      gender: gender !== undefined ? gender : user.gender,
      interested_in: interested_in !== undefined ? interested_in : user.interested_in,
      photo_url: photo_url !== undefined ? photo_url : user.photo_url,
      location: location !== undefined ? location : user.location
    });

    console.log(`✏️ Profile updated: ${user.name}`);
    res.json(user.toSafeJSON());
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET potential matches (users to swipe on)
router.get('/feed', async (req, res) => {
  try {
    const userId = req.user.id;

    // Get IDs of users already swiped on
    const swipedUsers = await Swipe.findAll({
      where: { swiper_id: userId },
      attributes: ['swiped_id']
    });

    const swipedIds = swipedUsers.map(s => s.swiped_id);
    swipedIds.push(userId); // Exclude self

    // Get users not yet swiped on
    const users = await User.findAll({
      where: {
        id: { [Op.notIn]: swipedIds }
      },
      attributes: { exclude: ['password'] },
      limit: 20,
      order: [['created_at', 'DESC']]
    });

    res.json(users);
  } catch (err) {
    console.error('Error fetching feed:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST swipe on a user
router.post('/swipe', async (req, res) => {
  try {
    const { swiped_id, direction } = req.body;
    const swiper_id = req.user.id;

    if (!swiped_id || !direction) {
      return res.status(400).json({ error: 'swiped_id and direction are required.' });
    }

    if (!['left', 'right'].includes(direction)) {
      return res.status(400).json({ error: 'Direction must be left or right.' });
    }

    if (swiper_id === swiped_id) {
      return res.status(400).json({ error: "You can't swipe on yourself!" });
    }

    // Check if already swiped
    const existingSwipe = await Swipe.findOne({
      where: { swiper_id, swiped_id }
    });

    if (existingSwipe) {
      return res.status(400).json({ error: 'Already swiped on this user.' });
    }

    // Create swipe
    await Swipe.create({ swiper_id, swiped_id, direction });

    let matched = false;

    // If right swipe, check for mutual match
    if (direction === 'right') {
      const { Match } = require('../models');

      const mutualSwipe = await Swipe.findOne({
        where: {
          swiper_id: swiped_id,
          swiped_id: swiper_id,
          direction: 'right'
        }
      });

      if (mutualSwipe) {
        // Create match (lower ID first for consistency)
        const [u1, u2] = swiper_id < swiped_id
          ? [swiper_id, swiped_id]
          : [swiped_id, swiper_id];

        const existingMatch = await Match.findOne({
          where: { user1_id: u1, user2_id: u2 }
        });

        if (!existingMatch) {
          await Match.create({ user1_id: u1, user2_id: u2 });
          matched = true;
          console.log(`💕 New match: User ${u1} & User ${u2}`);
        }
      }
    }

    const emoji = direction === 'right' ? '❤️' : '👎';
    console.log(`${emoji} User ${swiper_id} swiped ${direction} on User ${swiped_id}`);

    res.json({
      message: direction === 'right' ? 'Liked!' : 'Passed',
      direction,
      matched
    });
  } catch (err) {
    console.error('Error swiping:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;