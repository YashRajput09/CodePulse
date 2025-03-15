import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import userRoute from './routes/user_route.js';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import winston from 'winston';

const app = express();

// app.use(morgan('dev'));


// --> import.meta.url → Returns the full URL of the current file (e.g., file:///C:/Users/HP/Desktop/CodePulse/backend/app.js).
// --> fileURLToPath(import.meta.url) → Converts the URL into a normal file path (e.g., C:\Users\HP\Desktop\CodePulse\backend\app.js).
const __filename = fileURLToPath(import.meta.url); 

// --> path.dirname(__filename) → Extracts the directory path from the full file path (e.g., C:\Users\HP\DesktopCodePulse\backend).
const __dirname = path.dirname(__filename);

// --> path.join(__dirname, 'app.log') → Creates the full path for 'app.log' in the same directory as script (e.g., C:\Users\HP\Desktop\CodePulse\backend\app.log).
// --> fs.createWriteStream(..., flags: 'a') → Opens (or creates) app.log for writing, flags: 'a' means append mode (so New logs will be added instead of overwriting the file.).
// const logStream = fs.createWriteStream(path.join(__dirname, 'app.log'), { flags: 'a'});
// app.use(morgon('combined', { stream: logStream})); 


// Winston logger

// Ensure logs directory exists
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

winston.addColors({
    info: 'cyan',
    warn: 'yellow',
    error: 'red',
    debug: 'magenta'
});
const logger = winston.createLogger({  //create a logger
    level: 'info', // set log level // This means logs of level info, warn, and error will be captured (but not debug logs).
    format: winston.format.combine( // Combine multiple formats //define formate
        winston.format.timestamp(), //add timestamp to each log entry
        winston.format.json(), //convert log entry to JSON format
        winston.format.colorize(), // Enable colors for the console
      winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level}] ${message}`) // Print only the message 
    ),
    transports: [  //define transports array where logs are stored
      new winston.transports.Console(), // Logs info, warn, and error to console
      new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }), // Logs errors to a file
      new winston.transports.File({ filename: path.join(logDir, 'logs.log') }),// Logs all levels to a file
    ]
  });
//   console.log("logger: ",logger);
  
// --> path.join(__dirname, 'app.log') → Creates the full path for 'app.log' in the same directory as script (e.g., C:\Users\HP\Desktop\CodePulse\backend\app.log).
// --> fs.createWriteStream(..., flags: 'a') → Opens (or creates) app.log for writing, flags: 'a' means append mode (so New logs will be added instead of overwriting the file.).
const logStream = fs.createWriteStream(path.join(__dirname, 'app.log'), { flags: 'a'});

  // Morgan with Winston
  app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// define session options
const sessionOptions = {
    secret: "secret code",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 28 * 24 * 60 * 60 * 1000,
    maxAge: 28 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    } 
}

//MIDDLEWARES
app.use(session(sessionOptions));
app.use(express.json()); // Parse application/json
app.use(express.urlencoded({ extended: true })); // Parse application/x-www-form-urlencoded
app.use(cookieParser());

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

const port = process.env.PORT ;
const dburl = process.env.MONGODB_ATLUS_URL;
async function dbConnection() {

    try{
        await mongoose.connect(dburl);
        // console.log("connected");
        logger.info('\x1b[36mServer started successfully! log\x1b[0m');
    } catch( err ){
        logger.error('\x1b[31mDatabase connection failed! log\x1b[0m');
    }
    app.listen(port, () =>{
        // console.log(`Listening on port: ${port}`);
        logger.info(`Listening on port: ${port}`);

    });
}
dbConnection();


app.use('/user', userRoute);
app.use('/log', (req, res) => {
    // console.log(req.session);
    res.send("Logged");
});