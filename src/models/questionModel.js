const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var questionSchema = new Schema(
  {
    questiondesc: {
      type: String,
      required: true,
    },
    createdby: {
      type: String,
      required: true,
    },
    answerid: [{ type: String }],
    popularity: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

var questionModel = mongoose.model("question", questionSchema, "question");

module.exports = questionModel;
