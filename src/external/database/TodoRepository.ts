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


  async update(todo: ITodo): Promise<void> {
    const valuesToUpdate = []

    let queryString = "UPDATE todos SET "

    if (todo.title !== undefined) {
      valuesToUpdate.push(todo.title)
      queryString += `title = $${valuesToUpdate.length}, `
    }

    if (todo.description !== undefined) {
      valuesToUpdate.push(todo.description)
      queryString += `description = $${valuesToUpdate.length}, `
    }

    if (todo.completed !== undefined) {
      valuesToUpdate.push(todo.completed)
      queryString += `completed = $${valuesToUpdate.length}, `
    }

    queryString = queryString.slice(0, -2)

    valuesToUpdate.push(todo.id!)
    queryString += ` WHERE id = $${valuesToUpdate.length}`

    valuesToUpdate.push(todo.userId!)
    queryString += ` AND user_id = $${valuesToUpdate.length}`

    await db.query(queryString, valuesToUpdate)
  }

  async delete(id: string): Promise<void> {
    await db.query(
      "DELETE * FROM todos WHERE id = $1",
      [id]
    )
  }
}
