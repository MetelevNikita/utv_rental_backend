const express = require("express");

// module

const {getFeedbackMessage, createFeedbackMessage } = require("../Controller/feedbackController.js")

// 

const feedbackRouter = express.Router()

// 

feedbackRouter.get('/message', getFeedbackMessage)
feedbackRouter.post('/message', createFeedbackMessage)


// 

module.exports = feedbackRouter