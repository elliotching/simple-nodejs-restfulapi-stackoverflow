
const mongoose = require('mongoose');
// const { Schema } = mongoose;

// const blogSchema = new Schema({
//   title:  String, // String is shorthand for {type: String}
//   author: String,
//   body:   String,
//   comments: [{ body: String, date: Date }],
//   date: { type: Date, default: Date.now },
//   hidden: Boolean,
//   meta: {
//     votes: Number,
//     favs:  Number
//   }
// });
const NoteSchema = mongoose.Schema({
    title: String,
    content: String
}, {
    timestamps: true
});

var mongoose_validate = require("mongoose-validator");

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      validate: mongoose_validate({
        validator: 'isLength',
        arguments: [3, 50],
        message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters',
      }),
    },
    password: {
      type: String,
      required: true,
      // validate: mongoose_validate("len", 8, 100),
    },
    displayusername: {
      type: String,
      required: true,
      // validate: mongoose_validate("len", 4, 200),
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model('Note', NoteSchema);

// module.exports = mongoose.model("User", UserSchema);
