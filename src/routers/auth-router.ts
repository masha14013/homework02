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
}).withMessage('Login length should be from 3 to 30 symbols')
const passwordValidation = body('password').isString().trim().isLength({
    min: 3,
    max: 100
}).withMessage('Password length should be from 3 to 100 symbols')

authRouter.post('/registration',
    async (req: Request, res: Response) => {
        const user = await usersService.createUser(req.body.login, req.body.password, req.body.email)
        if (user) {
            res.sendStatus(204)
        } else {
            res.sendStatus(400)
        }
    })

authRouter.post('/registration-confirmation',
    async (req: Request, res: Response) => {
    const result = await usersService.confirmEmail(req.body.code)
        if (result) {
            res.sendStatus(204)
        } else {
            res.sendStatus(400)
        }
    })

authRouter.post('/resend-registration-code',
    async (req: Request, res: Response) => {
        const result = await usersService.confirmEmail(req.body.loginOrEmail)
        if (result) {
            res.status(201).send()
        } else {
            res.sendStatus(400)
        }
    })

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
            res.status(200).send({accessToken: token})
        }
    })

authRouter.get('/me',
    authMiddleware,
    async (req: Request, res: Response) => {

        return await usersGetRepository.findCurrentUser()
    })
