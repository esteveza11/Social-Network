// This file is not a model, it's used as a subdocument schema in Thought model
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Reaction Schema
const ReactionSchema = new Schema({
    reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId()
    },
    reactionBody: {
        type: String,
        required: true,
        maxlength: 280
    },
    username: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (timestamp) => dateFormat(timestamp)
    }
});

module.exports = ReactionSchema;
