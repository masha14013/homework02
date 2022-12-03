import {inputValidationMiddleware} from "../../middlewares/input-validation-middleware";
import {body} from "express-validator";

const loginValidation = body('login').isString().trim().isLength({
    min: 3,
    max: 10
}).withMessage('Login length should be from 3 to 10 symbols')
const passwordValidation = body('password').isString().trim().isLength({
    min: 6,
    max: 20
}).withMessage('Password length should be from 6 to 20 symbols')
const emailValidation = body('email').isString().trim().isURL().isLength({
    min: 10,
    max: 100
}).withMessage('URL length should not exceed 100 symbols')

export const createUserValidation = [
    loginValidation,
    passwordValidation,
    emailValidation,
    inputValidationMiddleware
]