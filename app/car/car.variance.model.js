const mongoose = require("mongoose");
const mongoose_validate = require("mongoose-validator");

module.exports = mongoose.model("carvariance", {
  id: String,
  name: String,
  price: String,
});
