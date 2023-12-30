"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv");
var express_1 = require("express");
var bcrypt_1 = require("bcrypt");
var user_1 = require("../models/user");
var utils_1 = require("../utils/utils");
var jsonwebtoken_1 = require("jsonwebtoken");
var token_1 = require("../middlewares/token");
var bad_words_1 = require("bad-words");
var problem_1 = require("../models/problem");
var accounts = express_1.default.Router();
accounts.post("/signup", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, email, password, emailRegex, passwordRegex, usernameRegex, filter, hashedPas, user, userModel, userFromDb, id, token, e_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 8, , 9]);
                _a = req.body, username = _a.username, email = _a.email, password = _a.password;
                if (!username || !email || !password) {
                    res.status(400).json({
                        success: false,
                        message: "Missing required fields.",
                    });
                    return [2 /*return*/];
                }
                emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
                usernameRegex = /^[a-zA-Z0-9_-]{3,15}$/;
                if (!emailRegex.test(email)) {
                    res.status(400).json({
                        success: false,
                        message: "Email is not valid.",
                    });
                    return [2 /*return*/];
                }
                if (!passwordRegex.test(password)) {
                    res.status(400).json({
                        success: false,
                        message: "Password is not valid. Password must contain at least one letter (uppercase or lowercase) and one digit, and must be at least 8 characters in length.",
                    });
                    return [2 /*return*/];
                }
                if (!usernameRegex.test(username)) {
                    res.status(400).json({
                        success: false,
                        message: "Username must be between 3 to 15 characters and can only contain letters, numbers, hyphens, and underscores.",
                    });
                    return [2 /*return*/];
                }
                filter = new bad_words_1.default();
                if (filter.isProfane(username)) {
                    res.status(400).json({
                        success: false,
                        message: "Username contains inappropriate language.",
                    });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, (0, utils_1.existsUsername)(username)];
            case 1:
                if (!_b.sent()) return [3 /*break*/, 2];
                res.status(409).json({
                    success: false,
                    message: "Username already exists.",
                });
                return [2 /*return*/];
            case 2: return [4 /*yield*/, (0, utils_1.existsEmail)(email)];
            case 3:
                if (_b.sent()) {
                    res.status(409).json({
                        success: false,
                        message: "Email already exists.",
                    });
                    return [2 /*return*/];
                }
                _b.label = 4;
            case 4: return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
            case 5:
                hashedPas = _b.sent();
                user = {
                    username: username,
                    email: email,
                    password: hashedPas,
                };
                userModel = new user_1.default(user);
                return [4 /*yield*/, userModel.save()];
            case 6:
                _b.sent();
                return [4 /*yield*/, user_1.default.findOne({
                        username: username,
                        email: email,
                        password: hashedPas,
                    })];
            case 7:
                userFromDb = _b.sent();
                id = userFromDb ? userFromDb.id.toString() : "none";
                token = jsonwebtoken_1.default.sign(user.username, process.env.ACCESS_TOKEN_SECRET);
                console.log("User '", user.username, "' signed up at ", new Date());
                res.status(201).json({
                    token: token,
                    id: id,
                    success: true,
                    message: "Account created successfully",
                });
                return [3 /*break*/, 9];
            case 8:
                e_1 = _b.sent();
                console.log(e_1);
                res.status(500).json({
                    success: false,
                    message: "Error creating account",
                });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); });
accounts.post("/login", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username_or_email, password, user, token, e_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, username_or_email = _a.username_or_email, password = _a.password;
                if (!username_or_email || !password) {
                    res.status(400).json({
                        success: false,
                        message: "Missing required fields",
                    });
                    return [2 /*return*/];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, user_1.default.findOne({
                        $or: [
                            { username: username_or_email },
                            { email: username_or_email },
                        ],
                    })];
            case 2:
                user = _b.sent();
                if (user == null) {
                    res.status(400).json({
                        success: false,
                        message: "Username or Email doesn't exists",
                    });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, bcrypt_1.default.compare(password, user.password)];
            case 3:
                if (_b.sent()) {
                    token = jsonwebtoken_1.default.sign(user.username, process.env.ACCESS_TOKEN_SECRET);
                    console.log("User '", user.username, "' logged in at ", new Date());
                    res.json({
                        token: token,
                        id: user.id,
                        success: true,
                        message: "Logged in successfully",
                    });
                }
                else {
                    console.log("User '", user.username, "' failed login (incorrect password) at ", new Date());
                    res.json({ success: false, message: "Password incorrect" });
                }
                return [3 /*break*/, 5];
            case 4:
                e_2 = _b.sent();
                console.log(e_2);
                res.status(500).json({ success: false, message: "Error" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
accounts.post("/delete/:id", token_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, user_1.default.findByIdAndDelete(id)];
            case 1:
                _a.sent();
                res.json({
                    success: true,
                    message: "Account deleted successfully",
                });
                return [3 /*break*/, 3];
            case 2:
                e_3 = _a.sent();
                res.json({ success: false, message: e_3 });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
accounts.get("/id/:id", token_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                return [4 /*yield*/, user_1.default.findById(id)];
            case 1:
                user = _a.sent();
                if (!user) {
                    res.status(404).json({ success: false, message: "User not found" });
                    return [2 /*return*/];
                }
                res.json(user);
                return [2 /*return*/];
        }
    });
}); });
accounts.get("/:name", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var name, user, allProblems, easyProblems, mediumProblems, hardProblems, easySolved, mediumSolved, hardSolved, i, publicUser;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                name = req.params.name;
                return [4 /*yield*/, user_1.default.findOne({
                        username: name,
                    })];
            case 1:
                user = _a.sent();
                if (!user) {
                    res.status(404).json({ success: false, message: "User not found" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, problem_1.default.find()];
            case 2:
                allProblems = _a.sent();
                easyProblems = 0;
                mediumProblems = 0;
                hardProblems = 0;
                easySolved = 0;
                mediumSolved = 0;
                hardSolved = 0;
                for (i = 0; i < allProblems.length; i++) {
                    if (allProblems[i].main.difficulty === "easy") {
                        easyProblems++;
                        if (user.problems_solved.includes(allProblems[i].main.name)) {
                            easySolved++;
                        }
                    }
                    else if (allProblems[i].main.difficulty === "medium") {
                        mediumProblems++;
                        if (user.problems_solved.includes(allProblems[i].main.name)) {
                            mediumSolved++;
                        }
                    }
                    else {
                        hardProblems++;
                        if (user.problems_solved.includes(allProblems[i].main.name)) {
                            hardSolved++;
                        }
                    }
                }
                publicUser = {
                    username: user.username,
                    email: user.email,
                    submissions: user.submissions,
                    problems_starred: user.problems_starred,
                    problems_solved: user.problems_solved,
                    easy_problems_count: easyProblems,
                    medium_problems_count: mediumProblems,
                    hard_problems_count: hardProblems,
                    problems_solved_easy: easySolved,
                    problems_solved_medium: mediumSolved,
                    problems_solved_hard: hardSolved,
                    problems_attempted: user.problems_attempted,
                    problems_solved_count: user.problems_solved_count,
                    rank: user.rank,
                    views: user.views,
                    solution_count: user.solution_count,
                    reputation_count: user.reputation_count,
                };
                res.json(publicUser);
                return [2 /*return*/];
        }
    });
}); });
exports.default = accounts;
