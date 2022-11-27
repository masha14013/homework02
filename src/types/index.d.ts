import {UsersDBType} from "../repositories/db";

declare global {
    declare namespace Express {
        export interface Request {
            user: UsersDBType | null
        }
    }
}