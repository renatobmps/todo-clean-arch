import ITodo from "@/core/todo/models/ITodo";
import ITodoRepository from "@/core/todo/services/ITodoRepository";
import db from "./db"

export default class TodoRepository implements ITodoRepository {
  async create(todo: ITodo): Promise<void> {
    await db.query(
      "INSERT INTO todos (user_id, title, description) VALUES ($1, $2, $3)",
      [todo.userId!, todo.title, todo.description]
    )
  }

  async readTodosByUserId(userId: string): Promise<ITodo[]> {
    const response = await db.query(
      "SELECT * FROM todos WHERE user_id = $1",
      [userId]
    )

    if (!response || !response.rows) return []

    return response.rows as ITodo[]
  }

  async edit(todo: Partial<ITodo>): Promise<void> {
    if (todo.title !== undefined && todo.description === undefined && todo.completed === undefined) {
      await db.query(
        "UPDATE todos SET title = $1 WHERE id = $2 AND user_id = $3",
        [todo.title, todo.id!, todo.userId!]
      )

    } else if (todo.description !== undefined && todo.title === undefined && todo.completed === undefined) {
      await db.query(
        "UPDATE todos SET description = $1 WHERE id = $2 AND user_id = $3",
        [todo.description, todo.id!, todo.userId!]
      )

    } else if (todo.completed !== undefined && todo.title === undefined && todo.description === undefined) {
      await db.query(
        "UPDATE todos SET completed = $1 WHERE id = $2 AND user_id = $3",
        [todo.completed, todo.id!, todo.userId!]
      )
    }
  }
}
