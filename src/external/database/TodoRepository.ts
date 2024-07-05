import ITodo from "@/core/todo/models/ITodo";
import ITodoRepository from "@/core/todo/services/ITodoRepository";
import db from "./db"

export default class TodoRepository implements ITodoRepository {
  async create(data: ITodo): Promise<void> {
    await db.query(
      "INSERT INTO todos (user_id, title, description) VALUES ($1, $2, $3)",
      [data.userId!, data.title, data.description]
    )
  }

  async readAllByUserId(userId: string): Promise<ITodo[]> {
    const response = await db.query(
      "SELECT * FROM todos WHERE user_id = $1",
      [userId]
    )

    if (!response || !response.rows) return []

    return response.rows as ITodo[]
  }
}
