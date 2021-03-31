const User = require("../users/user.model.js");
const unknownError = "Some error occurred while creating the User.";
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
                    userid: "TODO: generate uuid",
                    timestamp: request.body.timestamp,
                });

                return saveUserInfo(user, response);
            }
            response.status(500).send({
                message:
                    request.body.username + " existed. Do you want to sign in?",
            });
        })
        .catch((err) => {
            response.status(500).send({
                message: err.message || unknownError,
            });
        });
};

const saveUserInfo = (user, response) => {
    user.save() // Save
        .then((data) => {
            // TODO: get id and hashing password
            data.updateOne(
                { password: "customizedpassword" },
                // {},
                (err, docs) => {
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
        })
        .catch((err) => {
            response.status(500).send({
                message: err.message || unknownError,
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
                message:
                    err.message ||
                    "Some error occurred while retrieving notes.",
            });
        });
};

// Retrieve and return all notes from the database.
exports.aaaaa = (request, response) => {
    User.deleteMany({}, {}, (err) => {
        response.send(err.message);
        // response.send("deleted all");
    });
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
