// apis/event/controllers.js
const path = require("path");
const Event = require("../../models/Event");
const User = require("../../models/User");

exports.getEvents = async (req, res, next) => {
  try {
    const events = await Event.find().populate("owner");
    res.status(201).json(events);
  } catch (err) {
    next(err);
  }
};
exports.getMyEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ owner: req.user._id }).populate("owner");
    res.status(201).json(events);
  } catch (err) {
    next(err);
  }
};

exports.getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate({
        path: "confirmedAttendees",
        populate: {
          path: "userId",
          model: "User",
        },
      })
      .populate("attendanceChecklist")
      .populate({
        path: "rejectedAttendees",
        populate: {
          path: "userId",
          model: "User",
        },
      })
      .populate({
        path: "pendingRequests",
        populate: {
          path: "userId",
          model: "User",
        },
      }); // this line to populate the attendance checklist

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
};

exports.createEvent = async (req, res, next) => {
  if (req.files) {
    console.log("pictures are here");
    console.log(req.files);
    req.body.images = req.files?.images?.map((file) =>
      file.path.replace("\\", "/")
    );
    req.body.image = req.body.images[0];
  }
  try {
    const {
      eventName,
      images,
      image,
      details,
      date,
      address,
      city,
      state,
      startTime,
      endTime,
      location,
      gender,
      numberOfAttendees,
      organizationId,
    } = req.body;
    console.log(req.body);

    // Set the owner to the authenticated user's ID
    const ownerId = req.user._id;

    // Create the new event
    const event = await Event.create({
      name: eventName,
      images,
      image,
      description: details,
      date,
      address,
      city,
      state,
      startTime,
      endTime,
      location,
      gender,
      maxParticipants: numberOfAttendees,
      owner: ownerId,
      organizationId,
    });

    // Update the owner with the new event ID
    await User.findByIdAndUpdate(req.user._id, {
      $push: { events: event._id },
    });

    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
};

exports.updateEvent = async (req, res, next) => {
  if (req.file) {
    console.log(req.file);
    req.body.image = req.file.path.replace("\\", "/");
  }
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (err) {
    next(err);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    next(err);
  }
};
