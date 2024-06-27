import dotenv from "dotenv"
import express, { Request, Response } from "express"

dotenv.config({ path: ".env.development" })

const app = express()
const PORT = process.env.API_PORT ?? 4000

app.get("/", (req: Request, res: Response) => {
  res.send("<h1>Hello World!!!</h1>")
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
