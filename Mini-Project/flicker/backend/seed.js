const { sequelize, User, Swipe, Match, Message } = require('./models');

const seedData = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to Database');

    await sequelize.sync({ force: true });
    console.log('✅ Tables recreated');

    // ===================== CREATE USERS =====================
    console.log('\n🌱 Creating users...');

    const alice = await User.create({
      name: 'Alice Johnson',
      email: 'alice@test.com',
      password: 'password123',
      age: 25,
      gender: 'female',
      interested_in: 'male',
      bio: 'Love hiking, coffee, and good conversations! ☕🏔️',
      location: 'New York, USA',
      photo_url: 'https://randomuser.me/api/portraits/women/1.jpg'
    });
    console.log(`  ✅ Created: ${alice.name}`);

    const bob = await User.create({
      name: 'Bob Smith',
      email: 'bob@test.com',
      password: 'password123',
      age: 27,
      gender: 'male',
      interested_in: 'female',
      bio: 'Software developer by day, guitarist by night 🎸',
      location: 'San Francisco, USA',
      photo_url: 'https://randomuser.me/api/portraits/men/1.jpg'
    });
    console.log(`  ✅ Created: ${bob.name}`);

    const charlie = await User.create({
      name: 'Charlie Davis',
      email: 'charlie@test.com',
      password: 'password123',
      age: 24,
      gender: 'male',
      interested_in: 'female',
      bio: 'Foodie 🍕 | Traveler ✈️ | Dog person 🐕',
      location: 'London, UK',
      photo_url: 'https://randomuser.me/api/portraits/men/32.jpg'
    });
    console.log(`  ✅ Created: ${charlie.name}`);

    const diana = await User.create({
      name: 'Diana Wilson',
      email: 'diana@test.com',
      password: 'password123',
      age: 26,
      gender: 'female',
      interested_in: 'male',
      bio: 'Artist 🎨 | Yoga lover 🧘‍♀️ | Netflix addict',
      location: 'Los Angeles, USA',
      photo_url: 'https://randomuser.me/api/portraits/women/44.jpg'
    });
    console.log(`  ✅ Created: ${diana.name}`);

    const emma = await User.create({
      name: 'Emma Brown',
      email: 'emma@test.com',
      password: 'password123',
      age: 23,
      gender: 'female',
      interested_in: 'everyone',
      bio: 'Bookworm 📚 | Cat mom 🐱 | Always up for an adventure!',
      location: 'Toronto, Canada',
      photo_url: 'https://randomuser.me/api/portraits/women/68.jpg'
    });
    console.log(`  ✅ Created: ${emma.name}`);

    const frank = await User.create({
      name: 'Frank Miller',
      email: 'frank@test.com',
      password: 'password123',
      age: 28,
      gender: 'male',
      interested_in: 'female',
      bio: 'Gym enthusiast 💪 | Chef wannabe 👨‍🍳 | Movie buff 🎬',
      location: 'Chicago, USA',
      photo_url: 'https://randomuser.me/api/portraits/men/45.jpg'
    });
    console.log(`  ✅ Created: ${frank.name}`);

    const grace = await User.create({
      name: 'Grace Lee',
      email: 'grace@test.com',
      password: 'password123',
      age: 25,
      gender: 'female',
      interested_in: 'male',
      bio: 'Dancing through life 💃 | Sushi lover 🍣 | Positive vibes only ✨',
      location: 'Seoul, South Korea',
      photo_url: 'https://randomuser.me/api/portraits/women/75.jpg'
    });
    console.log(`  ✅ Created: ${grace.name}`);

    const henry = await User.create({
      name: 'Henry Park',
      email: 'henry@test.com',
      password: 'password123',
      age: 29,
      gender: 'male',
      interested_in: 'female',
      bio: 'Photographer 📸 | Mountain climber ⛰️ | Coffee snob ☕',
      location: 'Denver, USA',
      photo_url: 'https://randomuser.me/api/portraits/men/22.jpg'
    });
    console.log(`  ✅ Created: ${henry.name}`);

    const sofia = await User.create({
      name: 'Sofia Martinez',
      email: 'sofia@test.com',
      password: 'password123',
      age: 24,
      gender: 'female',
      interested_in: 'male',
      bio: 'Med student 🩺 | Beach lover 🏖️ | Salsa dancer 💃',
      location: 'Miami, USA',
      photo_url: 'https://randomuser.me/api/portraits/women/90.jpg'
    });
    console.log(`  ✅ Created: ${sofia.name}`);

    const james = await User.create({
      name: 'James Cooper',
      email: 'james@test.com',
      password: 'password123',
      age: 26,
      gender: 'male',
      interested_in: 'female',
      bio: 'Startup founder 🚀 | Basketball fan 🏀 | Pizza lover 🍕',
      location: 'Austin, USA',
      photo_url: 'https://randomuser.me/api/portraits/men/67.jpg'
    });
    console.log(`  ✅ Created: ${james.name}`);

    const lily = await User.create({
      name: 'Lily Chen',
      email: 'lily@test.com',
      password: 'password123',
      age: 22,
      gender: 'female',
      interested_in: 'everyone',
      bio: 'Music producer 🎵 | Anime fan 🎌 | Bubble tea addict 🧋',
      location: 'Tokyo, Japan',
      photo_url: 'https://randomuser.me/api/portraits/women/33.jpg'
    });
    console.log(`  ✅ Created: ${lily.name}`);

    const ryan = await User.create({
      name: 'Ryan Thompson',
      email: 'ryan@test.com',
      password: 'password123',
      age: 30,
      gender: 'male',
      interested_in: 'female',
      bio: 'Architect 🏗️ | Wine enthusiast 🍷 | World traveler 🌍',
      location: 'Paris, France',
      photo_url: 'https://randomuser.me/api/portraits/men/86.jpg'
    });
    console.log(`  ✅ Created: ${ryan.name}`);

    // ===================== CREATE SWIPES & MATCHES =====================
    console.log('\n🌱 Creating swipes and matches...');

    // Alice and Bob like each other → MATCH!
    await Swipe.create({ swiper_id: alice.id, swiped_id: bob.id, direction: 'right' });
    await Swipe.create({ swiper_id: bob.id, swiped_id: alice.id, direction: 'right' });
    const match1 = await Match.create({
      user1_id: Math.min(alice.id, bob.id),
      user2_id: Math.max(alice.id, bob.id)
    });
    console.log(`  💕 Match: ${alice.name} & ${bob.name}`);

    // Alice and Charlie like each other → MATCH!
    await Swipe.create({ swiper_id: alice.id, swiped_id: charlie.id, direction: 'right' });
    await Swipe.create({ swiper_id: charlie.id, swiped_id: alice.id, direction: 'right' });
    const match2 = await Match.create({
      user1_id: Math.min(alice.id, charlie.id),
      user2_id: Math.max(alice.id, charlie.id)
    });
    console.log(`  💕 Match: ${alice.name} & ${charlie.name}`);

    // Bob and Diana like each other → MATCH!
    await Swipe.create({ swiper_id: bob.id, swiped_id: diana.id, direction: 'right' });
    await Swipe.create({ swiper_id: diana.id, swiped_id: bob.id, direction: 'right' });
    const match3 = await Match.create({
      user1_id: Math.min(bob.id, diana.id),
      user2_id: Math.max(bob.id, diana.id)
    });
    console.log(`  💕 Match: ${bob.name} & ${diana.name}`);

    // Emma and James like each other → MATCH!
    await Swipe.create({ swiper_id: emma.id, swiped_id: james.id, direction: 'right' });
    await Swipe.create({ swiper_id: james.id, swiped_id: emma.id, direction: 'right' });
    const match4 = await Match.create({
      user1_id: Math.min(emma.id, james.id),
      user2_id: Math.max(emma.id, james.id)
    });
    console.log(`  💕 Match: ${emma.name} & ${james.name}`);

    // Some one-sided swipes
    await Swipe.create({ swiper_id: frank.id, swiped_id: alice.id, direction: 'right' });
    await Swipe.create({ swiper_id: alice.id, swiped_id: frank.id, direction: 'left' });
    console.log(`  👎 ${alice.name} passed on ${frank.name}`);

    await Swipe.create({ swiper_id: grace.id, swiped_id: henry.id, direction: 'right' });
    console.log(`  ❤️ ${grace.name} liked ${henry.name} (waiting...)`);

    await Swipe.create({ swiper_id: lily.id, swiped_id: ryan.id, direction: 'right' });
    console.log(`  ❤️ ${lily.name} liked ${ryan.name} (waiting...)`);

    // ===================== CREATE MESSAGES =====================
    console.log('\n🌱 Creating messages...');

    // Alice & Bob conversation
    await Message.create({ match_id: match1.id, sender_id: alice.id, content: 'Hey Bob! Love your guitar photos! 🎸' });
    await delay(100);
    await Message.create({ match_id: match1.id, sender_id: bob.id, content: 'Thanks Alice! Do you play any instruments?' });
    await delay(100);
    await Message.create({ match_id: match1.id, sender_id: alice.id, content: 'I used to play piano! We should jam sometime 🎹' });
    await delay(100);
    await Message.create({ match_id: match1.id, sender_id: bob.id, content: "That would be awesome! There's a great music café downtown" });
    await delay(100);
    await Message.create({ match_id: match1.id, sender_id: alice.id, content: "I know that place! Let's go this weekend? ☕" });
    await delay(100);
    await Message.create({ match_id: match1.id, sender_id: bob.id, content: "It's a date! Saturday at 3pm? 😊" });
    console.log(`  💬 6 messages between ${alice.name} & ${bob.name}`);

    // Alice & Charlie conversation
    await Message.create({ match_id: match2.id, sender_id: charlie.id, content: "Hi Alice! I see you love hiking too! 🏔️" });
    await delay(100);
    await Message.create({ match_id: match2.id, sender_id: alice.id, content: "Yes! Have you been to any good trails recently?" });
    await delay(100);
    await Message.create({ match_id: match2.id, sender_id: charlie.id, content: "I just did the Appalachian Trail last month! It was incredible" });
    await delay(100);
    await Message.create({ match_id: match2.id, sender_id: alice.id, content: "Omg that's on my bucket list! How long did it take? 😍" });
    console.log(`  💬 4 messages between ${alice.name} & ${charlie.name}`);

    // Bob & Diana conversation
    await Message.create({ match_id: match3.id, sender_id: bob.id, content: "Hey Diana! Your art is amazing! 🎨" });
    await delay(100);
    await Message.create({ match_id: match3.id, sender_id: diana.id, content: "Thank you so much! Are you into art?" });
    await delay(100);
    await Message.create({ match_id: match3.id, sender_id: bob.id, content: "I love visiting galleries! There's a new exhibition at MoMA" });
    console.log(`  💬 3 messages between ${bob.name} & ${diana.name}`);

    // Emma & James conversation
    await Message.create({ match_id: match4.id, sender_id: james.id, content: "Hey Emma! Fellow cat lover here 🐱" });
    await delay(100);
    await Message.create({ match_id: match4.id, sender_id: emma.id, content: "OMG yes! How many cats do you have? 😻" });
    await delay(100);
    await Message.create({ match_id: match4.id, sender_id: james.id, content: "Two! Luna and Mochi. They're my whole world 🌙🍡" });
    await delay(100);
    await Message.create({ match_id: match4.id, sender_id: emma.id, content: "Those names are adorable! I need to see pictures!! 📸" });
    await delay(100);
    await Message.create({ match_id: match4.id, sender_id: james.id, content: "How about I show you in person over coffee? ☕😊" });
    console.log(`  💬 5 messages between ${emma.name} & ${james.name}`);

    // ===================== SUMMARY =====================
    console.log('\n========================================');
    console.log('🌱 SEED COMPLETE!');
    console.log('========================================');
    console.log(`👤 Users created: 12`);
    console.log(`💕 Matches created: 4`);
    console.log(`💬 Messages created: 18`);
    console.log('========================================');
    console.log('\n📋 Test Accounts (all passwords: password123):');
    console.log('┌──────────────────────────────────────┐');
    console.log('│  alice@test.com    - Alice Johnson    │');
    console.log('│  bob@test.com      - Bob Smith        │');
    console.log('│  charlie@test.com  - Charlie Davis    │');
    console.log('│  diana@test.com    - Diana Wilson     │');
    console.log('│  emma@test.com     - Emma Brown       │');
    console.log('│  frank@test.com    - Frank Miller     │');
    console.log('│  grace@test.com    - Grace Lee        │');
    console.log('│  henry@test.com    - Henry Park       │');
    console.log('│  sofia@test.com    - Sofia Martinez   │');
    console.log('│  james@test.com    - James Cooper     │');
    console.log('│  lily@test.com     - Lily Chen        │');
    console.log('│  ryan@test.com     - Ryan Thompson    │');
    console.log('└──────────────────────────────────────┘');
    console.log('\n💕 Matches:');
    console.log('  • Alice & Bob (6 messages)');
    console.log('  • Alice & Charlie (4 messages)');
    console.log('  • Bob & Diana (3 messages)');
    console.log('  • Emma & James (5 messages)');
    console.log('\n🔥 Ready to go!\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

seedData();