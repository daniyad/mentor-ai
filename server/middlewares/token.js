"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
require("dotenv");
function authenticateToken(req, res, next) {
    var authHeader = req.headers["authorization"];
    var token = authHeader;
    if (!token) {
        return res
            .status(401)
            .json({ success: false, message: "Token not provided" });
    }
    jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res
                .status(403)
                .json({ success: false, message: "Invalid token" });
        }
        req.user = decoded === null || decoded === void 0 ? void 0 : decoded.toString();
        next();
    });
}
exports.authenticateToken = authenticateToken;
