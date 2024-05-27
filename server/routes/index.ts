import express from "express";
import problem_new from "./problem/problem-new";
import auth from "./auth/login"
import profile from "./profile/profile";
import mentor from "./mentor/mentor";


const router = express.Router();

router.use("/problem_new", problem_new);
router.use("/auth", auth)
router.use("/profile", profile)
router.use("/mentor", mentor)

export default router;
