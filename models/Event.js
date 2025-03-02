// models/Event.js
const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
  images: [
    {
      type: String,
    },
  ],
  date: {
    type: Date,
  },
  startTime: {
    type: String,
  },
  endTime: {
    type: String,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  location: {
    type: String,
  },
  gender: {
    type: String,
  },
  maxParticipants: {
    type: Number,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Ensure this references User if User is used for organizations
  },
  pendingRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Attendee" }],
  confirmedAttendees: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Attendee" },
  ],
  rejectedAttendees: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Attendee" },
  ],
  attendanceChecklist: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("Event", EventSchema);
