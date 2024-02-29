import User from "../models/user.js";

const coinToss = async (req, res) => {
  const { userId, wager, choice } = req.body;
  const outcome = Math.random() < 0.5 ? "Heads" : "Tails";
  const user = await User.findById(userId);

  if (!user || user.tokens < wager) {
    return res.status(400).json({ message: "Invalid request" });
  }

  if (choice === outcome) {
    // If the user wins, increment the win streak and calculate winnings
    user.winStreak += 1;
    let winnings = wager * 2; // Base winnings are 2x the wager

    // Apply bonus payouts based on the win streak
    if (user.winStreak === 3) {
      winnings = wager * 3; // 3x for 3 consecutive wins
    } else if (user.winStreak === 4) {
      winnings = wager * 4; // 4x for 4 consecutive wins
    } else if (user.winStreak === 5) {
      winnings = wager * 10; // 10x for 5 consecutive wins
      user.winStreak = 0; // Reset win streak after 5 wins
    }

    user.tokens += winnings; // Award winnings
  } else {
    // If the user loses, reset the win streak and subtract the wager
    user.winStreak = 0;
    user.tokens -= wager;
  }

  await user.save();
  res.json({ outcome, userTokens: user.tokens, winStreak: user.winStreak });
};

export default coinToss;
