require("dotenv").config();

import express from "express";
import router from "./routes/index";
import mongoose from "mongoose";
import { customCors } from "./middlewares/cors";
import sessions from "./middlewares/sessions";
import passport = require('passport')
import initializePassport from "./passport/passport-config";
import errorHandler from "./middlewares/server-error-filter";
import cors from "cors"

const MONGODB_URI = process.env.MONGODB_URI || "";
mongoose.connect(MONGODB_URI);

export const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
    console.log("Connected to MongoDB");
});



const app: express.Application = express();
const port = process.env.PORT || 80;

app.use(sessions)
app.use(passport.session())
initializePassport()

app.use(cors({
    origin: 'http://localhost:3000', // Replace with your client's origin
    credentials: true
}));
app.use(express.json());


app.use("/api", router);
app.use(errorHandler)

app.listen(port, () => {
    console.log(`server listening at port: ${port}`);
});
