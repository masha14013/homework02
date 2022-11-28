import {UsersType} from "../repositories/db";

declare global {
    declare namespace Express {
        export interface Request {
            user: UsersType | null
        }
    }
}