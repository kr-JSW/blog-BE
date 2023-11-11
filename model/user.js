const mongoose = require("mongoose");
const { Schema } = mongoose;
const crypto = require("crypto");

const userSchema = new Schema({
  nickname: { type: String, required: true, unique: true },
  salt: { type: String },
  hashedPassword: { type: String, required: true },
  role: { type: String, default: "user" },
  photo: {
    type: String,
    default:
      "https://cdn.pixabay.com/photo/2016/04/01/09/50/boy-1299608_1280.png",
  },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("hashedPassword")) {
    this.salt = await this.createSalt();
    this.hashedPassword = await this.encryptPwd(this.hashedPassword, this.salt);
  }
  next();
});

userSchema.methods = {
  encryptPwd: function (pwd, salt) {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(pwd, salt, 2, 32, "sha512", (err, key) => {
        if (err) {
          reject(err);
        } else {
          let value = key.toString("base64");
          resolve(value);
        }
      });
    });
  },
  createSalt: function () {
    return crypto.randomBytes(32).toString("hex");
  },
  checkPwd: async function (pwd) {
    return (await this.encryptPwd(pwd, this.salt)) === this.hashedPassword;
  },
};

module.exports = mongoose.model("User", userSchema);
