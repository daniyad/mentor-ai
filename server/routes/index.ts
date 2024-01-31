import express from "express";
import problem from "./problem";
import accounts from "./accounts";
import problem_new from "./problem/problem-new";
import auth from "./auth/login"
import profile from "./profile/profile";


const router = express.Router();

router.use("/problem", problem);
router.use("/problem_new", problem_new);
router.use("/auth", auth)
router.use("/accounts", accounts);
router.use("/profile", profile)

export default router;
