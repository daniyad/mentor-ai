import session from 'express-session';
import MongoStore from 'connect-mongo'

const sessions = session({
  secret: process.env.SESSIONS_SECRET_KEY || "",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || ""
  })
})

export default sessions
