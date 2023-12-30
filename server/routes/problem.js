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
var express_1 = require("express");
var createTest_1 = require("../utils/createTest");
var problem_1 = require("../models/problem");
var user_1 = require("../models/user");
var utils_1 = require("../utils/utils");
var problem = express_1.default.Router();
problem.post("/all", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, search, difficulty, acceptance, title, allProblems, allProblemsSorted, user, sOrA, allProblemsArray, i, i, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.body.id;
                search = req.query.search || "";
                difficulty = req.query.difficulty || "";
                acceptance = req.query.acceptance || "";
                title = req.query.title || "";
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, problem_1.default.find({ "main.name": { $regex: search, $options: "i" } }, "main.id main.name main.acceptance_rate_count main.difficulty main.like_count main.dislike_count")
                        .sort({ "main.id": 1 })
                        .exec()];
            case 2:
                allProblems = _a.sent();
                allProblemsSorted = (0, utils_1.sortByAcceptance)(acceptance.toString(), (0, utils_1.sortByDifficulty)(difficulty.toString(), (0, utils_1.sortByTitle)(title.toString(), allProblems)));
                return [4 /*yield*/, user_1.default.findById(id)];
            case 3:
                user = _a.sent();
                sOrA = {
                    solved: user === null || user === void 0 ? void 0 : user.problems_solved,
                    attempted: user === null || user === void 0 ? void 0 : user.problems_attempted,
                };
                allProblemsArray = JSON.parse(JSON.stringify(allProblemsSorted));
                if (sOrA.attempted) {
                    for (i = 0; i < allProblemsArray.length; i++) {
                        if (sOrA.attempted.includes(allProblemsArray[i].main.name)) {
                            allProblemsArray[i].main.status = "attempted";
                        }
                    }
                }
                if (sOrA.solved) {
                    for (i = 0; i < allProblemsArray.length; i++) {
                        if (sOrA.solved.includes(allProblemsArray[i].main.name)) {
                            allProblemsArray[i].main.status = "solved";
                        }
                    }
                }
                res.json(allProblemsArray);
                return [3 /*break*/, 5];
            case 4:
                e_1 = _a.sent();
                console.log(e_1);
                res.json({ success: false, message: "Internal Server Error" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
problem.post("/submit/:name", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var name, _a, id, problem_name, problem_2, user_2, history_1, e_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                name = req.params.name;
                _a = req.body, id = _a.id, problem_name = _a.problem_name;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, problem_1.default.findOne({
                        "main.name": name,
                    })];
            case 2:
                problem_2 = _b.sent();
                return [4 /*yield*/, user_1.default.findById(id)];
            case 3:
                user_2 = _b.sent();
                if (!user_2) {
                    res.json([
                        {
                            problem_name: problem_name,
                            status: "Runtime Error",
                            error: "user not found",
                            time: new Date(),
                            runtime: 0,
                            language: "JavaScript",
                            memory: Math.random() * 80,
                            code_body: undefined,
                        },
                    ]);
                    return [2 /*return*/];
                }
                if (user_2.submissions) {
                    history_1 = user_2.submissions;
                }
                else {
                    history_1 = null;
                }
                if (problem_2) {
                    (0, createTest_1.writeTestFile)(req.body.code, problem_2.test, problem_2.function_name)
                        .then(function (resolve) { return __awaiter(void 0, void 0, void 0, function () {
                        var submission, subsByName;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(resolve.stdout != undefined)) return [3 /*break*/, 2];
                                    console.log(resolve.stdout);
                                    submission = [
                                        {
                                            problem_name: problem_name,
                                            status: resolve.stdout.status,
                                            error: resolve.stdout.error_message,
                                            time: resolve.stdout.date,
                                            runtime: resolve.stdout.runtime,
                                            language: "JavaScript",
                                            memory: Math.random() * 80,
                                            code_body: resolve.code_body,
                                            input: resolve.stdout.input,
                                            expected_output: resolve.stdout.expected_output,
                                            user_output: resolve.stdout.user_output,
                                        },
                                    ];
                                    if (history_1 != null) {
                                        submission.push.apply(submission, history_1);
                                    }
                                    subsByName = submission.filter(function (elem) { return elem.problem_name === problem_name; });
                                    user_2.submissions = submission;
                                    if (submission[0].status === "Accepted") {
                                        if (!user_2.problems_solved.includes(problem_name)) {
                                            user_2.problems_solved.push(problem_name);
                                            user_2.problems_solved_count += 1;
                                        }
                                    }
                                    else {
                                        if (!user_2.problems_attempted.includes(problem_name)) {
                                            user_2.problems_attempted.push(problem_name);
                                        }
                                    }
                                    return [4 /*yield*/, user_2.save()];
                                case 1:
                                    _a.sent();
                                    res.json(subsByName);
                                    _a.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    }); })
                        .catch(function (e) { return __awaiter(void 0, void 0, void 0, function () {
                        var submission, subsByName;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    submission = [
                                        {
                                            problem_name: problem_name,
                                            status: "Runtime Error",
                                            error: e,
                                            time: new Date(),
                                            runtime: 0,
                                            language: "JavaScript",
                                            memory: Math.random() * 80,
                                            code_body: undefined,
                                        },
                                    ];
                                    if (history_1) {
                                        submission.push.apply(submission, history_1);
                                    }
                                    if (!user_2.problems_attempted.includes(problem_name)) {
                                        user_2.problems_attempted.push(problem_name);
                                    }
                                    subsByName = submission.filter(function (elem) { return elem.problem_name === problem_name; });
                                    user_2.submissions = submission;
                                    return [4 /*yield*/, user_2.save()];
                                case 1:
                                    _a.sent();
                                    res.json(subsByName);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                }
                return [3 /*break*/, 5];
            case 4:
                e_2 = _b.sent();
                console.log(e_2);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
problem.post("/submissions/:name", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var name, id, user, subsByName, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                name = req.params.name;
                id = req.body.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, user_1.default.findById(id)];
            case 2:
                user = _a.sent();
                if (!user) {
                    res.json([]);
                    return [2 /*return*/];
                }
                if (!user.submissions) {
                    res.json([]);
                    return [2 /*return*/];
                }
                subsByName = user.submissions.filter(function (elem) { return elem.problem_name === name; });
                res.json(subsByName);
                return [3 /*break*/, 4];
            case 3:
                e_3 = _a.sent();
                console.log(e_3);
                res.json([]);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
problem.post("/:name", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var name, id, problem_3, user, problemJson, response, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                name = req.params.name;
                id = req.body.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, problem_1.default.findOne({
                        "main.name": name,
                    })];
            case 2:
                problem_3 = _a.sent();
                return [4 /*yield*/, user_1.default.findById(id)];
            case 3:
                user = _a.sent();
                problemJson = JSON.parse(JSON.stringify(problem_3));
                if (user === null || user === void 0 ? void 0 : user.problems_attempted.includes(name)) {
                    problemJson.main.status = "attempted";
                }
                if (user === null || user === void 0 ? void 0 : user.problems_solved.includes(name)) {
                    problemJson.main.status = "solved";
                }
                if (problemJson) {
                    response = problemJson;
                    res.json(response);
                }
                else {
                    res.json({ error: "problem not found" });
                }
                return [3 /*break*/, 5];
            case 4:
                e_4 = _a.sent();
                console.log(e_4);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
problem.get("/:name/editorial", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var name, problem_4, response, e_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                name = req.params.name;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, problem_1.default.findOne({
                        "main.name": name,
                    })];
            case 2:
                problem_4 = _a.sent();
                if (problem_4) {
                    response = problem_4.editorial;
                    res.json(response);
                }
                return [3 /*break*/, 4];
            case 3:
                e_5 = _a.sent();
                console.log(e_5);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = problem;
