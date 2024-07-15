import express, { Request, Response } from "express"
import app from "@/index"
import request from "supertest"

describe("src/index.ts", () => {
  it("Should return 200 HTTP status code when get to /", async () => {
    const response = await fetch("http://localhost:4000/")

    expect(response.status).toBe(200)
  })
})