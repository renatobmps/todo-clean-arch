import { Express, Request, Response } from "express"
import LoginUser from "@/core/user/services/LoginUser";

export default class LoginUserController {
  constructor(
    webServer: Express,
    useCase: LoginUser
  ) {

    webServer.post("/api/users/login", async (req: Request, res: Response) => {
      try {
        const user = await useCase.execute({
          email: req.body.email,
          password: req.body.password
        })

        res.status(200).send(user)

      } catch (error: any) {
        res.status(400).send(error.message)
      }
    })
  }
}
