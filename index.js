const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Middleware to parse JSON data
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// Rate Limiting Middleware (e.g., max 100 requests per 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later."
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465, // SSL
  secure: true, // True for SSL
  auth: {
    user: 'rajashariq008@gmail.com', // Your Gmail
    pass: 'mxdo zepy kfjx tvcj ', // App Password from Google
  },
});
// Email template function
const createEmailTemplate = (firstName, lastName, phone, email, message) => {
  return `
    <h2>Contact Form Submission</h2>
    <p><strong>First Name:</strong> ${firstName}</p>
    <p><strong>Last Name:</strong> ${lastName}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Message:</strong> ${message}</p>
  `;
};

// Route to handle "Contact Us" form submissions
app.post('/contact-us', (req, res) => {
  const { firstName, lastName, phone, email, message } = req.body;

  // Check if all fields are provided
  if (!firstName || !lastName || !phone || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Create email content
  const mailOptions = {
    from: email, // User's email who submitted the form
    to: 'shrqiftikhar008@gmail.com', // Replace with your email
    subject: 'New Contact Form Submission',
    html: createEmailTemplate(firstName, lastName, phone, email, message)
  };

  // Send the email
 
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ error: 'Error sending email.' });
    } else {
      console.log('Email sent successfully: %s', info.messageId);
      return res.status(200).json({ success: 'Email sent successfully!' });
    }

    return res.status(200).json({
      message: 'Form submitted successfully!',
      data: {
        firstName,
        lastName,
        phone,
        email,
        message
      }
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
