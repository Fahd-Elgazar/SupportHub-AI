const supportHubService = require("../services/supportHub.service");
const ticketModel = require("../models/ticket.model");
const feedbackModel = require("../models/feedback.model");
const env = require("../config/env");

/*
|--------------------------------------------------------------------------
| Ask Support
|--------------------------------------------------------------------------
*/

exports.askSupport = async (req, res, next) => {
  try {
    const { question } = req.body;

    const savedTicket = await supportHubService.generateSupportResponse(question);

    return res.status(200).json({
      success: true,
      message: "Ticket processed successfully.",
      data: savedTicket,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Submit Feedback
|--------------------------------------------------------------------------
*/

exports.submitFeedback = async (req, res, next) => {
  try {
    const feedback = await feedbackModel.createFeedback(req.body);

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully.",
      data: feedback,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Get All Tickets
|--------------------------------------------------------------------------
*/

exports.getTickets = async (req, res, next) => {
  try {
    const tickets = await ticketModel.getAllTickets();

    return res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Get Ticket By ID
|--------------------------------------------------------------------------
*/

exports.getTicketById = async (req, res, next) => {
  try {
    const ticket = await ticketModel.getTicketById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Get All Feedback
|--------------------------------------------------------------------------
*/

exports.getFeedback = async (req, res, next) => {
  try {
    const feedback = await feedbackModel.getAllFeedback();

    return res.status(200).json({
      success: true,
      count: feedback.length,
      data: feedback,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Validate Request
|--------------------------------------------------------------------------
*/

exports.validateRequest = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Request is valid.",
  });
};

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

exports.healthCheck = (req, res) => {
  return res.status(200).json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
};

/*
|--------------------------------------------------------------------------
| API Version
|--------------------------------------------------------------------------
*/

exports.version = (req, res) => {
  return res.status(200).json({
    success: true,
    api_version: env.API_VERSION,
    prompt_version: env.PROMPT_VERSION,
    provider: env.AI_PROVIDER,
  });
};