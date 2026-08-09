// backend/models/Contact.js

const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ["admin", "user"],
    default: "admin",
  },
  text: {
    type: String,
    required: true,
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
});

const contactSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
    },
    phone: {
      type: String,
      default: "",
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
    },
    status: {
      type: String,
      enum: ["unread", "read", "replied"],
      default: "unread",
    },
    replies: [replySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
