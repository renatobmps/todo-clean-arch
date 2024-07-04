import { Express, Request, Response } from "express"
import LoginUser from "@/core/user/services/LoginUser";
import errors from "../../../core/shared/errors";
import JwtService from "../../auth/JwtService";
import IUser from "@/core/user/models/IUser";

export default class LoginUserController {
  constructor(
    webServer: Express,
    useCase: LoginUser
  ) {

    webServer.post("/api/users/login", async (req: Request, res: Response) => {
      try {
        const user: IUser = await useCase.execute({
          email: req.body.email,
          password: req.body.password
        })

        const jwtService = new JwtService(process.env.JWT_SECRET!)

        res.status(200).send({
          user: user,
          token: jwtService.sign(user)
        })

      } catch (error: any) {
        if (error.message === errors.INVALID_CREDENTIALS) {
          res.status(400).send(errors.INVALID_CREDENTIALS);

        } else if (error.message === errors.USER_DONT_EXISTS) {
          res.status(400).send(errors.USER_DONT_EXISTS);

        } else {
          res.status(500).send("Internal server error");
        }
      }
    })
  }
}
