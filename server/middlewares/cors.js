"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customCors = void 0;
function customCors(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, content-type, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "ture");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, OPTIONS, DELETE");
    if (req.method === "OPTIONS") {
        return res.status(200).json({
            body: "OK",
        });
    }
    next();
}
exports.customCors = customCors;
