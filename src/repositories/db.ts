import {MongoClient} from "mongodb";
import {BlogsType} from "./blogs-db-repository";
import {PostsType} from "./posts-repository";

const mongoUri = process.env.MONGO_URI || "mongodb://0.0.0.0:27017";

export const client = new MongoClient(mongoUri);

const db = client.db("blogs")
export const blogsCollection = db.collection<BlogsType>("blogs")
export const postsCollection = db.collection<PostsType>("posts")

export async function runDb () {
    try {
        // Connect the client to the server
        await client.connect();
        // Establish and verify connection
        await client.db("blogs").command({ping: 1});
        await client.db("posts").command({ping: 1});
        console.log("Connected successfully to mongo server");
    } catch {
        console.log("Connection failed")
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}