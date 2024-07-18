const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const isDocker = require("is-docker");
const axios = require("axios");
const {
    MongoClient,
    ServerApiVersion,
} = require("mongodb");
const PORT = process.env.PORT || 3000;
const mongoUri = process.env.MONGOURI;
console.log(`PORT: ${PORT}`);
console.log(`MONGOURI: ${mongoUri}`);

axios
    .get("https://api.ipify.org?format=json")
    .then((result) => {
        console.log(
            `result ip: ${JSON.stringify(result.data)}`
        );
    });

let client;
const defineMongoClient = () => {
    const options = {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
    };
    if (!client) {
        client = new MongoClient(mongoUri, options);
    }
    return client;
};

async function main() {
    // create express app
    const app = express();

    // parse requests of content-type - application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: true }));

    // parse requests of content-type - application/json
    app.use(bodyParser.json());

    if (!!mongoUri) {
    } else {
        console.error(
            "no DB (MongoDB uri) specified. exiting..."
        );
        return;
    }

    // define a simple route
    app.get("/", (req, res) => {
        console.log("received: '/'");
        res.json({
            message:
                "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes.",
        });
    });

    app.get("/hello", (req, res) => {
        console.log("received request: '/hello'");
        res.json({
            message: "Hello World",
        });
    });

    app.get("/crash", async (req, res) => {
        throw Error("Test crash");
    });

    app.get("/comments", async (req, res) => {
        console.log("received request: '/comments'");
        if (!!mongoUri) {
            const result = await axios.get(
                "https://api.ipify.org?format=json"
            );

            console.log(
                `result ip: ${JSON.stringify(result.data)}`
            );

            const client = defineMongoClient();
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

                comments = comments.map((comment) => {
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
        } else {
            res.emit("error", "Not Found");
        }
    });

    // require("./app/routes/routes.js")(app);

    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });
}

main();
