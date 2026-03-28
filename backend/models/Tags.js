import mongoose from "mongoose";

const TagsSchema = new mongoose.Schema({
  tagName: {
    type: String,
    required: true,
  },
  tagDescription: {
    type: String,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Courses",
  }
});

export const Tag = mongoose.model("Tag", TagsSchema);
