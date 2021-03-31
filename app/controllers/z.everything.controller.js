const User = require("../users/user.model.js");
const uuid = require("uuid");

const unknownError = "Some error occurred while creating the User.";
// Create and Save a new Note
exports.register = (request, response) => {
    // return modifyUseridUuid(null, response);
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
            modifyPasswordHashing(data)
                .then((_) => generateUuid())
                .then((finalUuid) => modifyUseridUuid(data, finalUuid))
                .then((_) => {
                    return response.send({
                        message: "Created user " + user.username,
                    });
                })
                .catch((err) => {
                    return response.status(500).send({
                        message: err.message,
                    });
                });
        })
        .catch((err) => {
            return response.status(500).send({
                message: err.message || unknownError,
            });
        });
};

const modifyPasswordHashing = (data) => {
    // TODO: get id and hashing password
    return new Promise((resolve, reject) => {
        data.updateOne(
            { password: "customizedpassword" },
            // {},
            (err) => {
                if (err) {
                    reject(
                        err.message +
                            " or Failed to update password with customized/hashed password"
                    );
                } else {
                    resolve(data);
                }
            }
        );
    });
};

const generateUuid = () => {
    return new Promise((resolve, reject) => {
        var newUuid = uuid.v4();
        User.findOne({ userid: newUuid })
            .then((uuidfound) => {
                if (uuidfound) {
                    resolve(generateUuid());
                } else {
                    resolve(newUuid);
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
};

const modifyUseridUuid = (user, newUuid) => {
    return new Promise((resolve, reject) => {
        console.log("modifyUseridUuid");
        user.updateOne({ userid: newUuid }, (err, data) => {
            if (err) {
                reject("unknown error while insrting new uuid");
            } else {
                resolve(true);
            }
        });
    });
};
const jeffBuysCake = (cakeType) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (cakeType === "black forest") {
                resolve("black forest cake!");
            } else {
                reject("No cake 😢");
            }
        }, 1000);
    });
};
// Retrieve and return all notes from the database.
exports.findAll = (request, response) => {
    User.find()
        .sort({ createdAt: "descending" })
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
