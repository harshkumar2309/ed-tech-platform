import mongoose from "mongoose";

const ratingAndReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  rating: {
    type: Number,
    required: true,
  },
  reviews: {
    type: String,
    required: true,
  }
});

export const RatingAndReview = mongoose.model(
  "RatingAndReview",
  ratingAndReviewSchema,
);
