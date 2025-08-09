import express from 'express';
import dotenv from 'dotenv';
dotenv.config(); 
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import passport from './lib/passport.js';
import cors from 'cors';

import authRoutes from './routes/auth.route.js';

import { connectDB } from './lib/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log('Current directory:', __dirname);

const app = express();

const PORT = process.env.PORT || 5000;


// app.use(cors({
//     origin: process.env.CLIENT_URL, // Allow requests from your frontend URL
//     credentials: true // Allow cookies to be sent
// }));

app.use(express.json({ limit: "10mb" })); // allow express to parse JSON data
app.use(cookieParser()); // to parse cookies from the request

// Initialize Passport
app.use(passport.initialize());

app.use("/api/auth", authRoutes);

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get(/(.*)/, (req, res) => {
	res.sendFile(path.resolve(__dirname, '/client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log('Server is running on http://localhost:' + PORT);
  connectDB();
}); 