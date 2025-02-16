import { config } from "dotenv";
import cors from "cors";
import express from "express";
import nodemailer from "nodemailer";

config();

const app = express();
app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  debug:true
});

app.post("/send-mail", async (req, res) => {
  const { email, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ error: "Email and message are required" });
  }

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: "New Message From Visitor",
    text: `From: ${email} \n\nMessage:\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions).then((info) => {
      console.log("Email sent:", info);
      return res.status(200).json({ success: "Message sent successfully" });
    });
  } catch (error) {
    console.error("Error sending email:", error.message);
    return res.status(500).json({
      error: "Error sending email",
      details: error.message,
    });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
