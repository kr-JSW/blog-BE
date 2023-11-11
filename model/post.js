const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true },
    photo: { type: String, required: true },
    categories: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
