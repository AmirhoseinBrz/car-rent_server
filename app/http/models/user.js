const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    avatar: { type: String },
    biography: { type: String, default: null },
    likedProducts: { type: [ObjectId], default: [] },
    email: {
      type: String,
      required: true,
    },
    role: { type: String, default: "USER" },
    password: {
      type: String,
      required: true,
    },
    isActive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// UserSchema.virtual("avatarUrl").get(() => {
//   if (this.avatar) return `${process.env.SERVER_URL}/${this.avatar}`;
//   return null;
// });

module.exports = { UserModel: mongoose.model("User", UserSchema) };
