"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var problem_1 = require("./problem");
var accounts_1 = require("./accounts");
var router = express_1.default.Router();
router.use("/problem", problem_1.default);
router.use("/accounts", accounts_1.default);
exports.default = router;
