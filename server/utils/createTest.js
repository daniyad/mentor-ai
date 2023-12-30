"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeTestFile = void 0;
var acorn_1 = require("acorn");
var handleTestFunction = "\nfunction handleTests(testCases, func) {\n    let testCase;\n    let problemInput;\n    let expectedOut;\n    let yourOut;\n    let testCaseNumber;\n    let status;\n    let ERR;\n    let date = new Date();\n    let runtime;\n    let t1;\n    for (let i = 0; i < testCases.length; i++) {\n            let out;\n            try {\n                    const input = testCases[i].slice(0, testCases[i].length - 1);\n                    const exOutput = testCases[i][testCases[i].length - 1];\n                    t1 = performance.now();\n                    out = func(...input);\n                    if (!equality(out, exOutput)) {\n                            problemInput = JSON.stringify(input);\n                            testCase = testCases[i];\n                            expectedOut = JSON.stringify(exOutput);\n                            yourOut = JSON.stringify(out);\n                            testCaseNumber = i;\n                            status = \"Wrong Answer\";\n\n                            ERR = `Wrong answer; Test Case Number: ${i}; Input: ${JSON.stringify(input)}; Expected Output: ${exOutput}; Your Output: ${out};`;\n                    }\n            } catch (e) {\n                    ERR = e;\n                    status = \"Runtime Error\";\n            }\n    }\n    runtime = performance.now() - t1;\n\n    if (ERR == undefined && testCase == undefined) status = \"Accepted\";\n    return `{ \"status\":\"${status}\",\n\"date\":\"${date}\",\n\"runtime\": \"${runtime}\",\n\"error_message\": \"${ERR}\",\n\"test_case_number\" :\"${testCaseNumber}\",\n\"test_case\":\"${testCase}\",\n\"input\": \"${problemInput}\",\n\"expected_output\":\"${expectedOut}\",\n\"user_output\":\"${yourOut}\"\n}`;\n}\n\nfunction equality(item1, item2) {\n    const isArrayItem1 = Array.isArray(item1);\n    const isArrayItem2 = Array.isArray(item2);\n    if (isArrayItem1 !== isArrayItem2) return false;\n    if (isArrayItem1) {\n            if (item1.length !== item2.length) return false;\n            for (let i = 0; i < item1.length; i++) {\n                    const indexof = item2.indexOf(item1[i]);\n                    if (indexof === -1) return false;\n                    item2.splice(indexof, 1);\n            }\n            if (item2.length !== 0) return false;\n            else return true;\n    }\n    return item1 === item2;\n}";
function writeTestFile(codeBody, testCases, functionName) {
    try {
        acorn_1.default.parse(codeBody, { ecmaVersion: 2022 });
    }
    catch (e) {
        console.log(e);
        return new Promise(function (resolve, reject) {
            reject({
                stdout: {
                    status: "Runtime Error",
                    date: new Date(),
                    runtime: 0,
                    error_message: "Runtime Error",
                    test_case_number: undefined,
                    test_case: undefined,
                    expected_output: undefined,
                    user_output: undefined,
                },
                stdout_string: e,
                stderr: "",
                code_body: codeBody,
            });
            resolve({
                stdout: {
                    status: "Runtime Error",
                    date: new Date(),
                    runtime: 0,
                    error_message: e,
                    test_case_number: undefined,
                    test_case: undefined,
                    expected_output: undefined,
                    user_output: undefined,
                },
                stdout_string: e,
                stderr: "",
                code_body: codeBody,
            });
        });
    }
    var data = "(function x() { try {" +
        codeBody +
        handleTestFunction +
        "try { return (handleTests(".concat(JSON.stringify(testCases), ", ").concat(functionName, ")); } catch (e) { return (`{ \"status\":\"Runtime Error\",\n        \"date\":\"").concat(new Date(), "\",\n        \"runtime\": 0,\n        \"error_message\": \"${e}\",\n        \"test_case_number\" :\"undefined\",\n        \"test_case\":\"undefined\",\n        \"expected_output\":\"undefined\",\n        \"user_output\":\"undefined\"\n        }`); }} catch (e) { return (`{ \"status\":\"Runtime Error\",\n        \"date\":\"").concat(new Date(), "\",\n        \"runtime\": 0,\n        \"error_message\": \"${e}\",\n        \"test_case_number\" :\"undefined\",\n        \"test_case\":\"undefined\",\n        \"expected_output\":\"undefined\",\n        \"user_output\":\"undefined\"\n        }`); }})()");
    return new Promise(function (resolve, reject) {
        try {
            var stdout = eval(data);
            console.log(stdout);
            resolve({
                stdout: JSON.parse(stdout),
                stdout_string: stdout,
                stderr: "",
                code_body: codeBody,
            });
        }
        catch (error) {
            return reject({
                stdout: error,
                stdout_string: "",
                stderr: "",
                code_body: codeBody,
            });
        }
    });
}
exports.writeTestFile = writeTestFile;
