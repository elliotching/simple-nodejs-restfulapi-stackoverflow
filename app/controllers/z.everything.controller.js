const User = require("../users/user.model.js");
const uuid = require("uuid");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const base64 = (text) => {
  return Buffer.from(text).toString("base64");
};
const trim = (text) => {
  return text.replace(/=/g, "");
};
const hash = (text) => {
  return crypto.createHash("sha256").update(text).digest("hex");
};
const hashHmac = (text, key) => {
  return crypto.createHmac("sha256", key).update(text).digest("base64");
};
const jsonStringOf = (json) => {
  return JSON.stringify(json);
};
const defJwt = () => {
  return jwt.sign({ foo: "bar" }, "shhhhh");
};
const unknownError = "Some error occurred while creating the User.";
// JWT signed by elliot
// JWT signed by elliot
// YES! by ELLIOT!!
let jwtSign = (user, payload, secretKey) => {
  return new Promise((resolve, reject) => {
    let defaultHeader = base64(
      jsonStringOf({
        alg: "HS256",
        typ: "JWT",
      })
    );

    let payloadString = base64(jsonStringOf(payload));

    let sign = (h, p, key) => {
      return new Promise((resolve, reject) => {
        let finalSign = hashHmac(trim(h) + "." + trim(p), key);
        if (finalSign || finalSign !== "") {
          resolve(trim(h) + "." + trim(p) + "." + finalSign);
        } else {
          reject(false);
        }
      });
    };
    sign(defaultHeader, payloadString, secretKey)
      .then((sign) => {
        // return sign;
        user.token = sign;
        resolve(user);
      })
      .catch((e) => {
        // throw e;
        reject(e);
      });
  });
};
exports.register = (request, response) => {
  // return modifyUseridUuid(null, response);
  // Validate requestuest
  // return response.send({
  //     message: , //base64
  //     // message: hashHmac("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIifQ"),
  // });
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
          token: "",
          timestamp: request.body.timestamp,
        });
        return saveUserInfo(user, response);
      }
      response.status(500).send({
        message: request.body.username + " existed. Do you want to sign in?",
      });
    })
    .catch((err) => {
      response.status(500).send({
        message: err.message || unknownError,
      });
    });
};

const saveUserInfo = (user, response) => {
  user
    .save() // Save
    .then((data) => {
      generateUuid(data)
        .then((finalUuid) => modifyPasswordHashing(data, finalUuid))
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

const modifyPasswordHashing = (data, uuid) => {
  // TODO: get id and hashing password
  var hashedPassword = hash(data.password + data._id);
  return new Promise((resolve, reject) => {
    data.updateOne(
      { password: hashedPassword },
      // {},
      (err) => {
        if (err) {
          reject(
            err.message +
              " or Failed to update password with customized/hashed password"
          );
        } else {
          resolve(uuid);
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

exports.loginUser = (request, response) => {
  let searchUsername = () => {
    return new Promise((resolve, reject) => {
      User.findOne({ username: request.body.username })
        .then((user) => {
          if (!user) {
            // sign up
            resolve(false);
          } else {
            resolve(user);
            // success
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  let verifyPassword = (user) => {
    return new Promise((resolve, reject) => {
      try {
        let hashedPassword = hash(request.body.password + user._id);
        if (user.password === hashedPassword) {
          resolve(user);
        } else {
          reject("user not exist");
        }
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  };
  let saveJwt = (user) => {
    let updateToken = () => {
      return new Promise((resolve, reject) => {
        User.findOneAndUpdate(
          { username: user.username },
          { token: user.token },
          (err) => {
            if (err) {
              reject(
                err.message +
                  " or Failed to update password with customized/hashed password"
              );
            } else {
              resolve(user);
            }
          }
        );
        
        resolve(user);
      });
    };
    return new Promise((resolve, reject) => {
      updateToken()
        .then((_) => {
          resolve({
            token: user.token,
            displayusername: user.displayusername,
            userid: user.userid,
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  //LOGINNNNNNNNNNNN
  searchUsername()
    .then((user) => verifyPassword(user))
    .then((user) =>
      jwtSign(
        user,
        {
          username: request.body.username,
          userid: user.userid,
          timestamp: request.body.timestamp,
        },
        "shhhhh"
      )
    )
    .then((user) => saveJwt(user))
    .then((loginResponse) => {
      return response.status(200).send(loginResponse);
    })
    .catch((error) => {
      return response.status(500).send({
        message:
          error.message ||
          error ||
          "Some error occurred while retrieving notes.",
      });
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
        message: err.message || "Some error occurred while retrieving notes.",
      });
    });
};

// Retrieve and return all notes from the database.
exports.aaaaa = (request, response) => {
  let deleteeveryone = () => {
    return new Promise((resolve, reject) => {
      User.deleteMany({}, {}, (err) => {
        reject(err);
      });
      resolve(true);
    });
  };

  deleteeveryone()
    .then(() => {
      return response.status(200).send({
        message: "success",
      });
    })
    .catch((err) => {
      return response.status(500).send({
        message: err.message || "Some error occurred while retrieving notes.",
      });
    });
};

// const deleteeveryone = new Promise((resolve, reject) => {
//   User.deleteMany({}, {}, (err) => {
//       reject(err);
//       // response.send("deleted all");
//   });
//   resolve(true);
// });

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
