import mongoose from "mongoose";

const subSectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  timeDuration: {
    type: String,
  },
  description: {
    type: String,
    trim: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
});

export const Subsection = mongoose.model("Subsection", subSectionSchema);
