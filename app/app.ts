// import { MongoClient } from "./node_modules/mongodb/mongodb";

import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import path from "path";
import mongoose from "mongoose";
import isDocker from "is-docker";
import axios, { AxiosResponse } from "axios";
import { MongoClient, ServerApiVersion, Db } from "mongodb";
import { getComments } from "./controllers/getComments";
const PORT: string = process.env.PORT || "3000";
const mongoUri: string | undefined = process.env.MONGOURI;
console.log(`PORT: ${PORT}`);
console.log(`MONGOURI: ${mongoUri}`);

axios
    .get("https://api.ipify.org?format=json")
    .then((result: AxiosResponse) => {
        console.log(
            `result ip: ${JSON.stringify(result.data)}`
        );
    });

export let client: MongoClient;
export const defaultMongoClient = (): MongoClient => {
    const options = {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
    };
    if (!client) {
        client = new MongoClient(mongoUri!, options);
    }
    return client;
};

const app: express.Express = express();

async function main() {
    // create express app

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

    // Serve static files from the 'public' directory
    app.use(express.static(path.join(__dirname, "public")));

    // define a simple route
    app.get("/", (req: Request, res: Response) => {
        console.log("received: '/'");
        res.json({
            message:
                "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes.",
        });
    });

    app.get("/hello", (req: Request, res: Response) => {
        console.log("received request: '/hello'");
        res.json({
            message: "Hello World",
        });
    });

    app.use((req: Request, res: Response) => {
        res.status(404).json({
            // error: req.baseUrl + "not found",
            error: "not found",
        });
    });

    app.get("/comments", getComments);

    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });
}

main().catch((_) => {
    console.log(_);
});
