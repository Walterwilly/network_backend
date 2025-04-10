import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from 'bcrypt';
import jsonwebtoken from "jsonwebtoken";
import cookieParser from 'cookie-parser';
import connect from "./src/config/mongodb.js";

// config dotenv first, then import files that might need to use environment variables.
// dotenv allows you to set the environment variable in development/production
// but when we deploy, we will set environment variable on the platform of deployment

dotenv.config({
    path: [
        "./.env",
        "./.env.production",
        "./.env.development",
    ]
});

// import routeHandler from "./src/routeHandler.js";
import authenticationRoute from './src/router/authenticationRoute.js'
import apiRoute from './src/router/apiRoute.js'
 
const app = express();

const corsOption = {
    origin: ["http://127.0.0.1:3000", "http://localhost:3000"],
    credentials: true,
    method: ["GET", "POST"]
}

app.use(cors(corsOption));
app.options('*', cors(corsOption));
app.use(express.json());
app.use(cookieParser());
app.use('/auth', authenticationRoute);
app.use('/api', apiRoute);

const PORT = process.env.PORT;

app.listen(PORT, async (req, res) => {
    await connect()
    console.log(`Server is listening at port ${PORT}`);
});