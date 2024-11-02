require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const axios = require("axios");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'build')));
app.use("/uploads", express.static("uploads"));
app.use(cors({
  origin: "http://localhost:3000", // Set this to your frontend URL for production
  credentials: true, 
}));
app.use(cookieParser());


// Routes
app.use("/user", require("./routes/userRouter"));
app.use("/api", require("./routes/categoryRouter"));
// app.use("/api", require("./routes/upload"));
app.use("/api", require("./routes/productRouter"));
app.use("/api", require("./routes/paymentRouter"));
app.use("/api", require("./routes/orderRoutes"));

// Telegram message route
app.post('/sendToTelegram', async (req, res) => {
  const { token, chatId, message } = req.body;

  if (!token || !chatId || !message) {
    return res.status(400).json({ error: 'Token, chatId, and message are required' });
  }

  try {
    const response = await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: chatId,
      text: message,
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
// Catch-all route to serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// MongoDB connection
const URI = process.env.MONGO_URI;
mongoose.connect(URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });


// Server setup
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

