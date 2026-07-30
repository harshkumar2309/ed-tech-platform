import { Router } from "express";
import { resetPasswordToken } from "./resetPassword.controller.js";

const router = Router();

router.post("/reset-password-token", resetPasswordToken);

export default router;
