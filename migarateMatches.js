const mongoose = require('mongoose');
const Session = require('./models/session'); // Adjust path if needed

async function runMigration() {
  await mongoose.connect('mongodb://127.0.0.1:27017/sshDB');

  const sessions = await Session.find();

  for (const session of sessions) {
    const oldMatches = session.matches;

    // If the current match is a plain ObjectId, we migrate it
    if (oldMatches.length > 0 && typeof oldMatches[0] === 'object' && !oldMatches[0].sessionID) {
      const newMatches = oldMatches.map(matchId => ({
        sessionID: matchId,
        text: '',
        isLike: true,
      }));

      // 💥 Replace the array entirely
      session.matches = newMatches;

      try {
        await session.save();
        console.log(`Migrated session ${session._id}`);
      } catch (e) {
        console.error(`Failed session ${session._id}:`, e.message);
      }
    }
  }

  console.log('Migration complete');
  mongoose.disconnect();
}

runMigration();
