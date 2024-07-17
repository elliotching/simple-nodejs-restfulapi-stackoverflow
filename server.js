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

const PORT = process.env.PORT || 3000;

function mongoUrl(port) {
    if (isDocker()) {
        return (
            "mongodb://mongodd:" +
            port +
            "/db_nodejs_user_cars"
        );
    }

    return (
        "mongodb://localhost:" +
        port +
        "/db_nodejs_user_cars"
    );
}
// Connecting to the database
console.log("Connecting to the database\n");
console.log("Connecting to the database\n");
// mongoose
//   .connect(mongoUrl("27017"), {
//     useNewUrlParser: true,
//   })
//   .then(() => {
//     console.log("Successfully connected to the database\n" + mongoUrl("27017"));
//   })
//   .catch((err) => {
//     console.log("Could not connect to the database. Exiting now...\n", err);
//     process.exit();
//   });

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
app.get("/hello", (req, res) => {
    res.json({
        message: "Hello World",
    });
});

require("./app/routes/routes.js")(app);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

// my atlas online mongodb::
// mongosh "mongodb+srv://iad72njd.cr5gg5j.mongodb.net/" --apiVersion 1 --username elliotching --password BrZGKaBdWvtc2KEY
// UI web access:
// https://cloud.mongodb.com/v2/669785451887ee7fe1e813e4#/overview?automateSecurity=true&connectCluster=iad72njd