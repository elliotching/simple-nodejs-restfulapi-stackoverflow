const express = require("express");
const bodyParser = require("body-parser");

// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// Configuring the database
const dbConfig = require("./config/database.config.js");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

var url = "mongodb://mongo:28017/easy-notes";
// Connecting to the database
console.log("Connecting to the database\n" + url);
mongoose
  .connect(url, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Successfully connected to the database\n" + url);
  })
  .catch((err) => {
    console.log("Could not connect to the database. Exiting now...\n", err);
    console.log("Retry in port 27017...");
    url = "mongodb://mongo:27017/easy-notes";
    mongoose
      .connect("mongodb://mongo:27017/easy-notes", {
        useNewUrlParser: true,
      })
      .then(() => {
        console.log("Successfully connected to the database\n" + url);
      })
      .catch((err) => {
        console.log("Could not connect to the database. Exiting now...\n", err);
        process.exit();
      });
  });

// define a simple route
app.get("/", (req, res) => {
  res.json({
    message:
      "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes.",
  });
});

// Require Notes routes
// require('./app/routes/full.routes.js')(app);

require("./app/routes/note.routes.js")(app);

// listen for requests
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
