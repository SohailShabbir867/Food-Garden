const Contact = require("../models/Contact");

const createContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    const fields = [name, email, subject, message];

    if (!fields.every((value) => typeof value === "string" && value.trim())) {
      return res.status(400).json({ message: "Name, email, subject and message are required" });
    }

    const ticketId = `CONT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const contact = await Contact.create({
      ticketId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    });

    res.status(201).json({ message: "Message sent successfully. We will get back to you soon.", ticketId: contact.ticketId });
  } catch (error) {
    next(error);
  }
};

module.exports = { createContact };
