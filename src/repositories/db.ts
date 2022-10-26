import {MongoClient} from "mongodb";

const mongoUri = process.env.mongoURI || "mongodb://0.0.0.0:27017";

const client = new MongoClient(mongoUri);

const db = client.db("blogs")

export const blogsCollection = db.collection("blogs")

export async function runDb () {
    try {
        // Connect the client to the server
        await client.connect();
        // Establish and verify connection
        await client.db("blogs").command({ping: 1});
        await client.db("posts").command({ping: 1});
        console.log("Connected successfully to mongo server");
    } catch {
        console.log("Can't connect to db")
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}