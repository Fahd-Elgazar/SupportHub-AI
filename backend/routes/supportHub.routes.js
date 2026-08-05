const express = require("express");

const router = express.Router();

const controller = require("../controllers/supportHub.controller");

const validate = require("../middleware/validate");

const supportRequestSchema = require("../schemas/supportRequest.schema");
const feedbackSchema = require("../schemas/feedback.schema");
const statusUpdateSchema = require("../schemas/statusUpdate.schema");

/*
|--------------------------------------------------------------------------
| AI Support
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  validate(supportRequestSchema),
  controller.askSupport
);

/*
|--------------------------------------------------------------------------
| Feedback
|--------------------------------------------------------------------------
*/

router.post(
  "/feedback",
  validate(feedbackSchema),
  controller.submitFeedback
);

/*
|--------------------------------------------------------------------------
| Tickets
|--------------------------------------------------------------------------
*/

router.get(
  "/tickets",
  controller.getTickets
);

router.get(
  "/ticket/:id",
  controller.getTicketById
);

router.patch(
  "/ticket/:id/status",
  validate(statusUpdateSchema),
  controller.updateTicketStatus
);

router.get(
  "/ticket/:id/feedback",
  controller.getFeedbackByTicket
);

/*
|--------------------------------------------------------------------------
| Feedback
|--------------------------------------------------------------------------
*/

router.get(
  "/feedback",
  controller.getFeedback
);

/*
|--------------------------------------------------------------------------
| Utilities
|--------------------------------------------------------------------------
*/

router.get(
  "/health",
  controller.healthCheck
);

router.get(
  "/version",
  controller.version
);

router.get(
  "/validate",
  controller.validateRequest
);

module.exports = router;