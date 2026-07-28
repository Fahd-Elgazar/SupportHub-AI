const express = require("express");
const router = express.Router();

const supportController = require("../controllers/supportHub.controller");
const validate = require("../middleware/validate");

const {
  supportRequestSchema,
  feedbackSchema,
} = require("../schemas/supportRequest.schema");

/*
 * POST /api/supporthub-ai
 * Ask AI a support question
 */
router.post(
  "/",
  validate(supportRequestSchema),
  supportController.askSupport
);

/*
 * POST /api/supporthub-ai/feedback
 * Save user feedback about AI response
 */
router.post(
  "/feedback",
  validate(feedbackSchema),
  supportController.submitFeedback
);

/*
 * GET /api/supporthub-ai/health
 * Health check
 */
router.get("/health", supportController.healthCheck);

/*
 * GET /api/supporthub-ai/version
 * Prompt/API version
 */
router.get("/version", supportController.version);

/*
 * POST /api/supporthub-ai/validate
 * Validate request only
 */
router.post(
  "/validate",
  validate(supportRequestSchema),
  supportController.validateRequest
);

module.exports = router;