import { Comments } from "../interfaces/types";
import { defaultMongoClient, client } from "../app";
import express from "express";
import { Request, Response } from "express";
import axios, { AxiosResponse } from "axios";
import { MongoClient, ServerApiVersion, Db } from "mongodb";
const PORT: string = process.env.PORT || "3000";
const mongoUri: string | undefined = process.env.MONGOURI;

export const getComments = async (
    req: Request,
    res: Response
) => {
    console.log("received request: '/comments'");
    if (!!mongoUri) {
        const result = await axios.get(
            "https://api.ipify.org?format=json"
        );

        console.log(
            `result ip: ${JSON.stringify(result.data)}`
        );

        const client: MongoClient = defaultMongoClient();
        try {
            await client.connect();
            const database: Db = client.db("sample_mflix");
            const collection =
                database.collection("comments");

            let comments = await collection
                .find({})
                .skip(0)
                .limit(10)
                .toArray();
            // console.log(JSON.stringify(comment));

            let toResponseComments: Comments[] =
                comments.map((comment) => {
                    return {
                        name: comment.name,
                        email: comment.email,
                        movie_id: comment.movie_id,
                        text: comment.text,
                        date: comment.date,
                    };
                });

            res.json({
                data: toResponseComments,
            });
        } finally {
            await client.close();
        }
    } else {
        res.emit("error", "Not Found");
    }
};
