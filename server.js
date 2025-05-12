require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path'); // For serving frontend in production

const app = express();

// ===== CORS Configuration =====
const allowedOrigins = [
  'http://localhost:5500', // If using Live Server (VSCode)
  'http://127.0.0.1:5500', // Alternative localhost
  'http://localhost:3000', // React/Vue dev server
  'https://your-portfolio-website.com' // Your live domain
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// ===== Body Parser =====
app.use(express.json());

// ===== Serve Frontend in Production =====
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Handle React routing, return all requests to the frontend
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// ===== Email Route =====
app.post('/send', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER,
      subject: `New message from ${name}`,
      text: message
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email sent!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ===== Start Server =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));