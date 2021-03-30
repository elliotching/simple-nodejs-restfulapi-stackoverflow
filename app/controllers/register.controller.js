// const User = require("../models/user.model.js");

// // Create and Save a new Note
// exports.create = (req, res) => {
//   // Validate request
//   if (!req.body.content) {
//     return res.status(403).send({
//       message: "Failed",
//     });
//   }

//   // Create a Note
//   const user = new User({
//     username:"",
//     password:""
//   });

//   // Save Note in the database
//   user
//     .save()
//     .then((data) => {
//       res.send(data);
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: err.message || "Some error occurred while creating the Note.",
//       });
//     });
// };

// // Retrieve and return all notes from the database.
// exports.findAll = (req, res) => {
//   User.find()
//     .then((notes) => {
//       res.send(notes);
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: err.message || "Some error occurred while retrieving notes.",
//       });
//     });
// };

// // Find a single note with a noteId
// exports.findOne = (req, res) => {};

// // Update a note identified by the noteId in the request
// exports.update = (req, res) => {};

// // Delete a note with the specified noteId in the request
// exports.delete = (req, res) => {};
// // 404 not found
// exports.unknown = (req, res) => {
  
//     return res.status(404).send({
//       message: "Failed",
//     });
// };
