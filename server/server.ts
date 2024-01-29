require("dotenv").config();

import express from "express";
import router from "./routes/index";
import mongoose from "mongoose";
import { customCors } from "./middlewares/cors";
import sessions from "./middlewares/sessions";
import passport = require('passport')
import initializePassport from "./passport/passport-config";

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

app.use(customCors);
app.use(express.json());


app.use("/api", router);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

app.listen(port, () => {
    console.log(`server listening at port: ${port}`);
});
