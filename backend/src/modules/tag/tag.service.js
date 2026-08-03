// Tag service — business logic for tag module

import { Tag } from "../tag/tag.model.js";

// ──────────────────────────────────────────────
// Helper: throw an error that the controller can
// translate into an HTTP response
// ──────────────────────────────────────────────
const throwError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  throw error;
};

export const createTagService = async (name, description) => {
  // validate data
  if (!name || !description) {
    throwError(404, "All fields are required");
  }

  // create entry in db
  const tagDetails = await Tag.create({
    tagName: name,
    tagDescription: description,
  });

  console.log(tagDetails);
  return tagDetails;
};