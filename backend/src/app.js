import express from "express";
import cookieParser from "cookie-parser";

// Import module routes
import authRoutes from "./modules/auth/auth.routes.js";
import profileRoutes from "./modules/profile/profile.routes.js";
import courseRoutes from "./modules/course/course.routes.js";
import sectionRoutes from "./modules/section/section.routes.js";
import subSectionRoutes from "./modules/subSection/subSection.routes.js";
import courseProgressRoutes from "./modules/courseProgress/courseProgress.routes.js";
import tagRoutes from "./modules/tag/tag.routes.js";
import ratingRoutes from "./modules/rating/rating.routes.js";
import resetPasswordRoutes from "./modules/resetPassword/resetPassword.routes.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Mount module routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/section", sectionRoutes);
app.use("/api/v1/sub-section", subSectionRoutes);
app.use("/api/v1/course-progress", courseProgressRoutes);
app.use("/api/v1/tag", tagRoutes);
app.use("/api/v1/rating", ratingRoutes);
app.use("/api/v1/reset-password", resetPasswordRoutes);

// Default route
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running...",
  });
});

export default app;
