import pg from "pg"

const { Client } = pg

async function query(query: string, values?: string[]) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.password,
    ssl: process.env.NODE_ENV === "development" ? false : true
  })

  try {
    await client.connect()
    const result = await client.query(query, values)
    return result
  } catch (error) {
    console.error(error)
  } finally {
    await client.end()
  }
}

export default { query }
