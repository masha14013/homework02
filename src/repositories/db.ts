import {MongoClient} from "mongodb";

//const mongoUri = 'mongodb+srv://masha14013:Agrsarius2012@cluster0.dcrn9l1.mongodb.net/blogs?retryWrites=true&w=majority' || "mongodb://0.0.0.0:27017";
const mongoUri = process.env.MONGO_URI || "mongodb://0.0.0.0:27017";

export const client = new MongoClient(mongoUri);

const db = client.db("blogs")
export const blogsCollection = db.collection<BlogsType>("blogs")
export const postsCollection = db.collection<PostsType>("posts")
export const authCollection = db.collection<AuthType>("login")
export const usersCollection = db.collection<UsersType>("users")

export type BlogsType = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string
}
export type PostsType = {
    id: string | null,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string | null,
    createdAt: string
}
export type BlogsQueryType = {
    searchNameTerm: string,
    pageNumber: string,
    pageSize: string,
    sortBy: string,
    sortDirection: string
}
export type PostsQueryType = {
    pageNumber: string,
    pageSize: string,
    sortBy: string,
    sortDirection: string
}
export type UsersType = {
    id: string,
    login: string,
    email: string,
    passwordHash: string,
    passwordSalt: string,
    createdAt: string
}
export type UsersQueryType = {
    pageNumber: string,
    pageSize: string,
    sortBy: string,
    sortDirection: string,
    searchLoginTerm: string,
    searchEmailTerm: string
}
export type AuthType = {
    login: string,
    password: string
}

export async function runDb() {
    try {
        // Connect the client to the server
        await client.connect();
        // Establish and verify connection
        await client.db("blogs").command({ping: 1});
        await client.db("posts").command({ping: 1});
        await client.db("auth").command({ping: 1});
        await client.db("users").command({ping: 1});
        console.log("Connected successfully to mongo server");
    } catch {
        console.log("Connection failed")
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}