import {MongoClient, ObjectId, WithId} from "mongodb";

const mongoUri = process.env.MONGO_URI || "mongodb://0.0.0.0:27017";

export const client = new MongoClient(mongoUri);

const db = client.db("blogs")
export const blogsCollection = db.collection<BlogsType>("blogs")
export const postsCollection = db.collection<PostsType>("posts")
export const authCollection = db.collection<AuthType>("login")
export const usersCollection = db.collection<UserAccountDBType>("users")
export const commentsCollection = db.collection<CommentsDBType>("comments")
export const tokenCollection = db.collection<TokenDBType>("token")

export type BlogsType = {
    _id?: ObjectId,
    id?: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string
}
export type PostsType = {
    _id?: ObjectId,
    id?: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
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
    accountData: UserAccountType,
    emailConfirmation: EmailConfirmationType
}
export type UserAccountDBType = {
    _id: ObjectId,
    accountData: UserAccountType,
    emailConfirmation: EmailConfirmationType
}
// export type UserAccountDBType = WithId<{
//     _id?: ObjectId,
//     id?: string,
//     accountData: UserAccountType,
//     emailConfirmation: EmailConfirmationType
// }>
export type UserAccountType = {
    login: string,
    email: string,
    passwordHash: string,
    passwordSalt: string,
    createdAt: string
}
export type EmailConfirmationType = {
    confirmationCode: string,
    expirationDate: Date,
    isConfirmed: boolean,
    //sentEmails: SentEmailType[]
}

export type RegistrationDataType = {
    ip: string
}
export type SentEmailType = {
    sentDate: Date
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
export type CommentsType = {
    id: string,
    content: string,
    userId: string,
    userLogin: string,
    createdAt: string
}
export type CommentsDBType = {
    _id: ObjectId,
    content: string,
    userId: string,
    userLogin: string,
    postId: string,
    createdAt: string
}
export type TokenDBType = {
    _id: ObjectId
    token: any,
    userId: string,
    expirationDate: Date
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
        await client.db("comments").command({ping: 1});
        console.log("Connected successfully to mongo server");
    } catch {
        console.log("Connection failed")
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}