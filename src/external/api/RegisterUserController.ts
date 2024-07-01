import { Express, Request, Response } from "express"
import RegisterUser from "@/core/user/services/RegisterUser";

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
        res.status(400).send(error.message)
      }
    })
  }
}
