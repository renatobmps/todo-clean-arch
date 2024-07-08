import { Express, Request, Response } from "express"
import RegisterUser from "@/core/user/services/RegisterUser";
import errors from "../../../core/shared/errors";

export default class RegisterUserController {
  constructor(
    webServer: Express,
    useCase: RegisterUser
  ) {

    webServer.post("/api/users/register", async (req: Request, res: Response) => {
      try {
        await useCase.execute({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        })

        res.status(201).send()

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
    })
  }
}
