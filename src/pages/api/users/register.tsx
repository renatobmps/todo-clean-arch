import errors from "@/core/shared/errors";
import RegisterUser from "@/core/user/services/RegisterUser";
import BcryptCryptography from "@/external/auth/BcryptCryptography";
import UserRepository from "@/external/database/UserRepository";
import { NextApiRequest, NextApiResponse } from "next";

export default async function route(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(403);

    const userRepository = new UserRepository()
    const cryptographyService = new BcryptCryptography()

    const registerUserUseCase = new RegisterUser(userRepository, cryptographyService)

    try {
        await registerUserUseCase.execute({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })

        res.status(201);

    } catch (error: any) {
        if (
            error.message === errors.USER_EXISTS ||
            error.message === errors.INVALID_USER_NAME ||
            error.message === errors.INVALID_USER_EMAIL ||
            error.message === errors.INVALID_USER_PASSWORD
        ) {
            res.status(400).send(error.message)
        } else {
            res.status(500).send(errors.UNEXPECTED_ERROR)
        }
    }
}