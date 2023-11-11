const mongoose = require("mongoose");
const { Schema } = mongoose;
const crypto = require("crypto");

const codeSchema = new Schema(
  {
    code: { type: String },
  },
  { timestamps: true }
);

codeSchema.pre("save", function (next) {
  const subscriptionCode = crypto.randomBytes(16).toString("hex");
  this.code = subscriptionCode;

  next();
});

module.exports = mongoose.model("Code", codeSchema);
