import {Request, Response, Router} from "express";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {body} from "express-validator";
import {usersService} from "../domain/users-service";
import {jwtService} from "../application/jwt-service";
import {authMiddleware} from "../middlewares/auth-middleware";
import {usersGetRepository} from "../repositories/users-get-repository";

export const authRouter = Router({})

const loginValidation = body('loginOrEmail').isString().trim().isLength({
    min: 3,
    max: 30
}).withMessage('Title length should be from 3 to 30 symbols')
const passwordValidation = body('password').isString().trim().isLength({
    min: 3,
    max: 100
}).withMessage('Title length should be from 3 to 100 symbols')

authRouter.post('/login',
    loginValidation,
    passwordValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (!user) {
            res.sendStatus(401)
        } else {
            const token = await jwtService.createJWT(user)
            res.status(200).send(token)
        }
    })
authRouter.get('/me',
    authMiddleware,
    async (req: Request, res: Response) => {

        return await usersGetRepository.findCurrentUser()
    })