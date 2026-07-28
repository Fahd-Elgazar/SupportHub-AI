const supportHubService = require("../services/supportHub.service");
const env = require("../config/env");

exports.askSupport = async (req, res, next) => {
  try {
    const result = await supportHubService.generateSupportResponse(
      req.body.question
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

exports.submitFeedback = async (req, res, next) => {
  try {
    const feedback = await supportHubService.saveFeedback(req.body);

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully.",
      data: feedback,
    });
  } catch (error) {
    next(error);
  }
};

exports.validateRequest = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Request is valid.",
  });
};

exports.healthCheck = async (req, res) => {
  return res.status(200).json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
};

exports.version = async (req, res) => {
  return res.status(200).json({
    success: true,
    api_version: env.API_VERSION,
    prompt_version: env.PROMPT_VERSION,
    provider: env.AI_PROVIDER,
  });
};