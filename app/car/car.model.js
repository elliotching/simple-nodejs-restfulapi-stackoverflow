const mongoose = require("mongoose");
const mongoose_validate = require("mongoose-validator");

module.exports = mongoose.model("cars", {
  id: String,
  carname: String,
  brand: String,
  description: String,
  variance: [{ id: String, name: String, price: String }],
});
