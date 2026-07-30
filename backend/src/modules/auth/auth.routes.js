import { Router } from "express";
import { sendOTP, signUp, login, changePassword } from "./auth.controller.js";
import { auth } from "../../middlewares/auth.js";

const router = Router();

router.post("/sendotp", sendOTP);
router.post("/signup", signUp);
router.post("/login", login);
router.post("/change-password", auth, changePassword);

export default router;
