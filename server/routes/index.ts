import express from "express";
import problem from "./problem";
import accounts from "./accounts";
import problem_new from "./problem-new";


const router = express.Router();

router.use("/problem", problem);
router.use("/problem_new", problem_new);
router.use("/accounts", accounts);

export default router;
