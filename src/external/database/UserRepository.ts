import IUser from "@/core/user/models/IUser";
import IUserRepository from "@/core/user/services/IUserRepository";
import db from "./db"

export default class UserRepository implements IUserRepository {
  async create(user: IUser): Promise<void> {
    await db.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      [user.name, user.email, user.password]
    )
  }

  async readByEmail(email: string): Promise<IUser | null> {
    const result = await db.query(
      "SELECT * FRON users WHERE email = $1",
      [email]
    )

    if (result?.rows.length === 0) {
      return null
    }

    return result?.rows[0]
  }

}