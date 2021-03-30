const User = requestuire("../users/user.model.js");

// Create and Save a new Note
exports.register = (request, res) => {
  // Validate requestuest
  if (!request.body.username) {
    return res.status(403).send({
      message: "Failed",
    });
  }
  User.findOne({username:request.body.username})
    .then((usernameFound) => {
      // console.log("Found!\n");
      // console.log(usernameFound);
      if (!usernameFound) {
        // Create a User
        const user = new User({
          username: request.body.username,
          password: request.body.password,
          displayusername: request.body.displayusername,
        });

        return saveUser(user, res);
      }
      res.status(500).send({
        message: request.body.username + " existed. Do you want to sign in?",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    });
};

const saveUser = (user, res) => {
  // Save User in the database
  user
    .save()
    .then((data) => {
      response.send({
        username: data.username,
        displayusername: data.displayusername,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    });
};

// // Retrieve and return all notes from the database.
// exports.findAll = (request, res) => {
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
// exports.findOne = (request, res) => {};

// // Update a note identified by the noteId in the requestuest
// exports.update = (request, res) => {};

// // Delete a note with the specified noteId in the requestuest
// exports.delete = (request, res) => {};
// // 404 not found
// exports.unknown = (request, res) => {

//     return res.status(404).send({
//       message: "Failed",
//     });
// };
