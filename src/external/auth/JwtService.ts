import jwt from "jsonwebtoken"

export default class JwtService {
  constructor(
    private readonly secret: string
  ) { }

  sign(payload: string | object): string {
    return jwt.sign(payload, this.secret, { expiresIn: "14d" })
  }

  verify(token: string): string | object {
    return jwt.verify(token, this.secret)
  }
}
