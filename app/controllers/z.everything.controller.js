const User = require("../users/user.model.js");

// Create and Save a new Note
exports.register = (request, response) => {
  // Validate requestuest
  if (!request.body.username) {
    return response.status(403).send({
      message: "Failed",
    });
  }
  User.findOne({ username: request.body.username })
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

        return user // Save
          .save()
          .then((data) => {
            data.updateOne(
              { password: "customizedpassword" },
              // {},
              function (err, docs) {
                if (err) {
                  return response.status(403).send({
                    message: "Failed",
                  });
                } else {
                  return response.send({
                    message: "Created user" + data.username,
                  });
                }
              }
            );
            // .then((data02) => {
            //   console.log(data02);
            //   response.send(data02);
            // })
            // .catch((err) => {
            //   response.status(500).send({
            //     message:
            //       err.message ||
            //       "Some error occurred while creating the User.",
            //   });
            // });
          })
          .catch((err) => {
            response.status(500).send({
              message:
                err.message || "Some error occurred while creating the User.",
            });
          });
      }
      response.status(500).send({
        message: request.body.username + " existed. Do you want to sign in?",
      });
    })
    .catch((err) => {
      response.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    });
};

// Retrieve and return all notes from the database.
exports.findAll = (request, response) => {
  User.find()
    .then((data) => {
      response.send(data);
    })
    .catch((err) => {
      response.status(500).send({
        message: err.message || "Some error occurred while retrieving notes.",
      });
    });
};

// Retrieve and return all notes from the database.
exports.aaaaa = (request, response) => {
  // User.deleteMany()
  //   .then((data) => {
  //     response.send(data);
  //   })
  //   .catch((err) => {
  //     response.status(500).send({
  //       message: err.message || "Some error occurred while retrieving notes.",
  //     });
  //   });
};

// const saveUser =

// // Find a single note with a noteId
// exports.findOne = (request, response) => {};

// // Update a note identified by the noteId in the requestuest
// exports.update = (request, response) => {};

// // Delete a note with the specified noteId in the requestuest
// exports.delete = (request, response) => {};
// // 404 not found
// exports.unknown = (request, response) => {

//     return response.status(404).send({
//       message: "Failed",
//     });
// };
