import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import authRoute from "./routes/authRoute.js";
import usersRoute from "./routes/usersRoute.js";
import villasRoute from "./routes/villasRoute.js";
import roomsRoute from "./routes/roomsRoute.js";
import orderRoute from "./routes/orderRoute.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";

const app = express();
dotenv.config();

// Database connection
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to mongoDB.");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

// Middlewares
app.use(cors({
  origin: process.env.FRONT_END_URL || "http://localhost:3000",
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Using environment variable for email
    pass: process.env.EMAIL_PASS, // Using environment variable for password
  }
});

// Routes
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/villas", villasRoute);
app.use("/api/rooms", roomsRoute);
app.use("/api/order", orderRoute);

// Route for serving static files
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, 'uploads')));

// Email sending route
app.post('/api/send-email', (req, res) => {
  const { fullName, email, message } = req.body;

  if (!fullName || !email || !message) {
    return res.status(400).send('All fields are required.');
  }

  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender email
    to: process.env.EMAIL_USER,   // Receiver email (same email for simplicity)
    subject: `Message from ${fullName}`,
    text: `Message from ${fullName} (${email}): \n\n${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error while sending email:', error);
      return res.status(500).send('Failed to send email.');
    }
    res.status(200).send('Email sent successfully: ' + info.response);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

// Start server
app.listen(8800, () => {
  connect();
  console.log("Connected to backend.");
});
