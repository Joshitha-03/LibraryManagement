const mongoose = require("mongoose");

const Transcation = new mongoose.Schema({
    userId: String,
    bookId: String,
    bookTitle: String,
    type: {
        type: String,
        enum: ["ISSUE", "RETURN"],
        required: true
    },
    issueDate: {
        type: Date,
        default: function () {
        return this.type === "ISSUE" ? new Date() : null;
        }
    },
    returnDate: {
        type: Date,
        default: function () {
            return this.type === "RETURN" ? new Date() : null;
        }
    }
});

module.exports = mongoose.model("transcatin", Transcation);