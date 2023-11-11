const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, unique: true },
  photo: {
    type: String,
    default:
      "https://cdn.pixabay.com/photo/2023/09/03/15/15/dark-eyed-junco-8230875_640.jpg",
  },
});

module.exports = mongoose.model("Category", categorySchema);
