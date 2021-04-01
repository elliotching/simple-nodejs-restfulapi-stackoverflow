const express = require("express");
const bodyParser = require("body-parser");

// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// Configuring the database
// const dbConfig = require("./config/database.config.js");
const mongoose = require("mongoose");
const isDocker = require("is-docker");

mongoose.Promise = global.Promise;

function mongoUrl(port) {
  if (isDocker()) {
    return "mongodb://mongodd:" + port + "/db_nodejs_user_cars";
  }

  return "mongodb://localhost:" + port + "/db_nodejs_user_cars";
}
// Connecting to the database
console.log("Connecting to the database\n");
console.log("Connecting to the database\n");
mongoose
  .connect(mongoUrl("27017"), {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Successfully connected to the database\n" + mongoUrl("27017"));
  })
  .catch((err) => {
    console.log("Could not connect to the database. Exiting now...\n", err);
    process.exit();
  });

// mongoose
// .connect(mongoUrl("28017"), {
//   useNewUrlParser: true,
// })
// .then(() => {
//   console.log("Successfully connected to the database\n" + mongoUrl("28017"));
// })
// .catch((err) => {
//   console.log("Could not connect to the database. Exiting now...\n", err);
//   console.log("Retry in port 27017...");
//   mongoose
//     .connect(mongoUrl("27017"), {
//       useNewUrlParser: true,
//     })
//     .then(() => {
//       console.log(
//         "Successfully connected to the database\n" + mongoUrl("27017")
//       );
//     })
//     .catch((err) => {
//       console.log("Could not connect to the database. Exiting now...\n", err);
//       process.exit();
//     });
// });

// define a simple route
app.get("/", (req, res) => {
  res.json({
    message:
      "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes.",
  });
});

// Require Notes routes
// require('./app/routes/full.routes.js')(app);

require("./app/routes/routes.js")(app);

// let ssss = (...args) => {
//   console.log(args);
// };
// ssss("","","");
// listen for requests

// let a = ["1","2","3","3","4","4"]
// let b = ["5","6","7","5","4","5"]
// a.forEach((aa, i) => {
//   let foundOfEach = false;
//   console.log(aa);
//   b.forEach((bb, j) => {
//     if (aa == bb) {
//       foundOfEach = true;
//       continue;
//     }
    
//     console.log(foundOfEach);
    
//   });
// });

// return;
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
