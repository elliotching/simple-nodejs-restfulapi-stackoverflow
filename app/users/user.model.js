const mongoose = require("mongoose");
const mongoose_validate = require("mongoose-validator");

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      validate: mongoose_validate({
        validator: "isLength",
        arguments: [6, 100],
        message: "Name should be between {ARGS[0]} and {ARGS[1]} characters",
      }),
    },
    password: {
      type: String,
      required: true,
      validate: mongoose_validate({
        validator: "isLength",
        arguments: [1, 100],
      }),
    },
    displayusername: {
      type: String,
      required: true,
      validate: mongoose_validate({
        validator: "isLength",
        arguments: [1, 100],
      }),
      // validate: mongoose_validate("len", 4, 200),
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("User", UserSchema);
