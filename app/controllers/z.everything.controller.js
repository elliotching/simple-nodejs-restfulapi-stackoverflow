const User = require("../users/user.model.js");
const CarSchema = require("../car/car.model.js");
const carnames = require("../car/carnamessss.js");
const carbrands = require("../car/carbrandsssssss.js");
const uuid = require("uuid");
const crypto = require("crypto");
const secretkeyjwt = "fsp!hzbU@_^gZ8mvfAn2";
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
  return jwt.sign({ foo: "bar" }, secretkeyjwt);
};
const unknownError = "Failed";

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

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

const validateToken = (token) => {
  return new Promise((resolve, reject) => {
    User.findOne({ token: token }, (err, data) => {
      if (err) {
        reject(err);
      }
      if (data) {
        resolve(data);
      } else {
        reject("token not found");
      }
    });
  });
};

const update = (condition, toUpdate) => {
  return new Promise((resolve, reject) => {
    User.findOneAndUpdate(
      condition, //{ username: user.username }
      toUpdate, //{ token: user.token },
      (err, data) => {
        if (err) {
          reject(err.message);
        } else {
          resolve(data);
        }
      }
    );
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
          reject(err.message);
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
      if (!request.body.username) {
        reject(false);
      }
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
        if (!request.body.password) {
          reject(false);
        }
        let hashedPassword = hash(request.body.password + user._id);
        if (user.password === hashedPassword) {
          resolve(user);
        } else {
          reject(false);
        }
      } catch (e) {
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
              reject(err.message);
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
  checkLengthReq(request.body, 3)
    .then((_) => searchUsername())
    .then((user) => verifyPassword(user))
    .then((user) =>
      jwtSign(
        user,
        {
          username: request.body.username,
          userid: user.userid,
          timestamp: request.body.timestamp,
        },
        secretkeyjwt
      )
    )
    .then((user) => saveJwt(user))
    .then((loginResponse) => {
      return response.status(200).send(loginResponse);
    })
    .catch((error) => {
      return response.status(500).send({
        message: error.message || error || unknownError,
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
        message: error.message || error || unknownError,
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
        message: err.message || err || unknownError,
      });
    });
};

exports.logout = (request, response) => {
  var requestBody = Object.keys(request.body);
  if (requestBody.length == 1 && requestBody[0] == "timestamp") {
  } else {
    return response.status(403).send({
      message: "Failed",
    });
  }
  let validationToken = "";
  validationToken = request.header("authorization").split(" ")[1];

  validateToken(validationToken)
    .then((data) => update({ username: data.username }, { token: "" }))
    .then((data) => {
      return response.send({
        message: "logged out",
      });
    })
    .catch((err) => {
      // return response.send({
      //   message: requestBody,
      // });
      return response.status(403).send({
        message: err.message || err || "Failed",
      });
    });
};
function checkLengthReq(req, requiredLength) {
  return new Promise((resolve, reject) => {
    var requestBody = Object.keys(req);
    if (requestBody.length == requiredLength) {
      // TODO: loop
      resolve(true);
    } else {
      reject(false);
    }
  });
}
exports.getprofileuser = (request, response) => {
  checkLengthReq(request.body, 1)
    .then((success) => {
      // GET VALIDATION TOKEN FROM REQUEST (aka. JWT)
      return new Promise((resolve, reject) => {
        if (success) {
          let validationToken = "";
          validationToken = request.header("authorization").split(" ")[1];
          if (validationToken) {
            resolve(validationToken);
          } else {
            reject(false);
          }
        }
      });
    })
    .then((validationToken) => validateToken(validationToken))
    .then((data) => {
      return response.send({
        username: data.username,
        userid: data.userid,
        displayusername: data.displayusername,
      });
    })
    .catch((err) => {
      return response.status(403).send({
        message: "Failed",
      });
    });
};

exports.updateprofileuser = (request, response) => {
  // "displayusername": "change my name",
  // "timestamp": "2019-11-22T02:11:22.0000Z"
  if (!request.body.displayusername) {
    return response.status(403).send({
      message: "Failed",
    });
  }
  checkLengthReq(request.body, 2)
    .then((success) => {
      // GET VALIDATION TOKEN FROM REQUEST (aka. JWT)
      return new Promise((resolve, reject) => {
        if (success) {
          let validationToken = "";
          validationToken = request.header("authorization").split(" ")[1];
          if (validationToken) {
            resolve(validationToken);
          } else {
            reject(false);
          }
        }
      });
    })
    .then((validationToken) => validateToken(validationToken))
    .then((user) =>
      update(
        { username: user.username },
        { displayusername: request.body.displayusername }
      )
    )
    .then((user) => {
      return new Promise((resolve, reject) => {
        User.findOne({ username: user.username }, (err, user) => {
          if (err) reject(err);
          if (user) resolve(user);
        });
      });
    })
    .then((data) => {
      return response.send({
        displayusername: data.displayusername,
        username: data.username,
        userid: data.userid,
      });
    })
    .catch((err) => {
      return response.status(403).send({
        message: "Failed",
      });
    });
};

exports.carlist = (request, response) => {
  return new Promise((resolve, reject) => {
    var requestBody = Object.keys(request);
    if (
      requestBody.length >= 3 &&
      request.body.carname != null &&
      request.body.pageindex &&
      request.body.pagesize
    ) {
      // TODO: loop
      resolve(true);
    } else {
      reject(false);
    }
  })
    .then((success) => {
      // GET VALIDATION TOKEN FROM REQUEST (aka. JWT)
      return new Promise((resolve, reject) => {
        if (success) {
          let validationToken = "";
          validationToken = request.header("authorization").split(" ")[1];
          if (validationToken) {
            resolve(validationToken);
          } else {
            reject(false);
          }
        }
      });
    })
    .then((token)=>validateToken(token))
    .then((success) => {
      return new Promise((resolve, reject) => {
        let start = (request.body.pageindex - 1) * request.body.pagesize;
        if (start <= -1) {
          start = 0;
        }
        CarSchema.find(
          request.body.carname == ""
            ? {}
            : { carname: new RegExp(request.body.carname, "i") }
        )
          .sort({ id: "ascending" })
          .where("id")
          .gte(("000" + start).slice(-4))
          .limit(request.body.pagesize)
          .exec((err, car) => {
            if (err) reject(err);
            if (car) resolve(car);
          });
      });
    })
    .then((carsss) => {
      return response.send(carsss);
    })
    .catch((err) => {
      return response.status(403).send({
        message: err.message || err || "Failed",
      });
    });
  // .then()
};

exports.carsave = (request, response) => {
  return new Promise((resolve, reject) => {
    CarSchema.find()
      .limit(1)
      .then((list) => {
        if (list.length >= 1) {
          // reject(false);
          resolve(true);
        } else {
          resolve(true);
        }
      });
  })
    .then((_) => {
      return new Promise((resolve, reject) => {
        let n = 0;
        for (let index = n; index < n + 100; index++) {
          let randname = getRandomInt(carnames.length);
          let randbrand = getRandomInt(carbrands.length);
          let car = new CarSchema({
            id: ("000" + index).slice(-4),
            carname: carnames[randname],
            brand: carbrands[randbrand],
            description:
              "Car of " +
              ("000" + index).slice(-4) +
              " is a brand new car. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            variance: [],
          });

          for (let jndex = 0; jndex < 2; jndex++) {
            car.variance.push({
              id: ("000" + jndex).slice(-4),
              name: jndex == 0 ? "manual" : "auto",
              price: 175000 + index * 1000 + jndex * 200,
            });
          }

          car.save();
        }
        resolve(true);
      });
    })
    .then((carsss) => {
      return response.send({
        message: "success",
      });
    })
    .catch((err) => {
      return response.status(403).send({
        message: err.message || err || "Failed",
      });
    });
};

exports.cardelete = (request, response) => {
  return new Promise((resolve, reject) => {
    CarSchema.deleteMany().then((value) => {
      if (value.ok == 1) {
        resolve(true);
      } else {
        reject(false);
      }
    });
  })
    .then((carsss) => {
      return response.send({
        message: "success",
      });
    })
    .catch((err) => {
      return response.status(403).send({
        message: err.message || err || "Failed",
      });
    });
};
