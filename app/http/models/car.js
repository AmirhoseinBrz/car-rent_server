const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const CarSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: { type: String, required: true },
    typeCar: {
      type: String,
      required: true,
    },
    steering: {
      type: String,
      require: true,
    },
    gasoline: {
      type: Number,
      require: true,
    },
    capacity: {
      type: Number,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    offPrice: { type: Number, require: true },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    likes: { type: [ObjectId], ref: "User" },
    isLiked: { type: Boolean, default: false },
    imageLink: { type: String, default: null },
    gallery: { type: [], default: [] },
    comments: { type: [], default: [] },
  },
  {
    timestamps: true,
  }
);

module.exports = { CarModel: mongoose.model("Car", CarSchema) };
