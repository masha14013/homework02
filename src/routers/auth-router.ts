import {Request, Response, Router} from "express";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {body} from "express-validator";
import {usersService} from "../domain/users-service";

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
        const result = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (!result) {
            res.sendStatus(401)
        } else {
            res.sendStatus(204)
        }
    })