import {body} from "express-validator"

export const signupValidator = [
    body("name").notEmpty().withMessage("Name required"),
    body("email").isEmail().withMessage("valid email required"),
    body("password")
    .isLength({min:6})
    .withMessage("password must be at lest 6 chars")
]