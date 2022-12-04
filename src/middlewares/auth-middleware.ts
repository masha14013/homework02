import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {usersGetRepository} from "../repositories/users-get-repository";
import {usersCollection} from "../repositories/db";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    if (!req.headers.authorization) {
        res.status(401).send("Invalid token")
        return
    }

    const token = req.headers.authorization.split(' ')[1]

    const userId = await jwtService.getUserIdByToken(token)
    console.log('userId', userId)
    if (userId) {
        req.user = await usersGetRepository.findUserById(userId)

        const users = await usersCollection.find().toArray()
        console.log('users', users)
        return next()
    }
    res.status(401).send("Invalid token")
}