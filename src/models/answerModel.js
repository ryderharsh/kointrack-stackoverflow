const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var answerSchema = new Schema(
  {
    answerdesc: {
      type: String,
      required: true,
    },
    questionid: {
      type: String,
      required: true,
    },
    createdby: {
      type: String,
      required: true,
    },
    popularity: {
      type: Number,
      required: true,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

var answerModel = mongoose.model("answer", answerSchema, "answer");

module.exports = answerModel;
