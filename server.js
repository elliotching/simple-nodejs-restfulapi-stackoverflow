const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const isDocker = require("is-docker");
const { MongoClient } = require("mongodb");
const PORT = process.env.PORT || 3000;

async function main() {
    // create express app
    const app = express();

    // parse requests of content-type - application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: true }));

    // parse requests of content-type - application/json
    app.use(bodyParser.json());

    const uri =
        "mongodb+srv://elliotching:BrZGKaBdWvtc2KEY@iad72njd.cr5gg5j.mongodb.net/";
    const client = new MongoClient(uri);
    // const client = new MongoClient(uri, {
    //     auth: {
    //         username: "elliotching",
    //         password: "BrZGKaBdWvtc2KEY",
    //     },
    // });

    try {
        await client.connect();
    } finally {
        await client.close();
    }
    // Connecting to the database
    // mongoose
    //     .connect(mongoUrl(), {
    //         auth: {
    //             user: "elliotching",
    //             password: "BrZGKaBdWvtc2KEY",
    //         },
    //         useNewUrlParser: true,
    //     })
    //     .then(() => {
    //         console.log(
    //             "Successfully connected to the database\n" +
    //                 mongoUrl()
    //         );
    //     })
    //     .catch((err) => {
    //         console.log(
    //             "Could not connect to the database. Exiting now...\n",
    //             err
    //         );
    //         process.exit();
    //     });
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
    app.get("/comment", async (req, res) => {
        try {
            await client.connect();
            const database = client.db("sample_mflix");
            const collection =
                database.collection("comments");
            let comments = await collection
                .find({})
                .limit(10)
                .toArray();
            // console.log(JSON.stringify(comment));

            comments.map((comment) => {
                return {
                    name: comment.name,
                    email: comment.email,
                    movie_id: comment.movie_id,
                    text: comment.text,
                    date: comment.date,
                };
            });
            // res.json(comment);

            res.json({
                data: comments,
            });
            // res.json(JSON.stringify(comments));
        } finally {
            await client.close();
        }
    });

    require("./app/routes/routes.js")(app);

    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });
}

main();
// my atlas online mongodb::
// mongosh "mongodb+srv://iad72njd.cr5gg5j.mongodb.net/" --apiVersion 1 --username elliotching --password BrZGKaBdWvtc2KEY
// UI web access:
// https://cloud.mongodb.com/v2/669785451887ee7fe1e813e4#/overview?automateSecurity=true&connectCluster=iad72njd
