// apis/event/routes.js
const express = require("express");
const upload = require("../../middlewares/multer");
const eventRouter = express.Router();
const {
  createEvent,
  getEvents,
  updateEvent,
  getEventById,
  deleteEvent,
  getMyEvents,
} = require("./controllers");
const passport = require("passport");
const { ensureOrganization } = require("../../middlewares/ensureOrganization");

eventRouter.post(
  "/create",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "image", maxCount: 1 },
  ]),
  passport.authenticate("jwt", { session: false }),
  ensureOrganization,
  createEvent
);

eventRouter.get("/", getEvents);
eventRouter.get(
  "/my",
  passport.authenticate("jwt", { session: false }),
  getMyEvents
);

eventRouter.get("/eventbyid/:id", getEventById);

eventRouter.put(
  "/updateevent/:id",
  passport.authenticate("jwt", { session: false }),
  ensureOrganization,
  updateEvent
);

eventRouter.delete(
  "/deleteevent/:id",
  passport.authenticate("jwt", { session: false }),
  ensureOrganization,
  deleteEvent
);

module.exports = eventRouter;
