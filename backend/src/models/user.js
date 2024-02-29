import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  tokens: { type: Number, default: 100 },
  winStreak: { type: Number, default: 0 },
  id: { type: String },
});

export default mongoose.model("User", userSchema);