import express, { Request, Response } from "express"
import request from "supertest"

describe("src/index.ts", () => {
  it("Should return 200 HTTP status code when get to /", async () => {
    const app = express()

    app.get("/", (req: Request, res: Response) => res.status(200).send())

    const response = await request(app)
      .get("/")

    expect(response.status).toBe(200)
  })
})