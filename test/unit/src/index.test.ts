describe("src/index.ts", () => {
  test("Should return 200 HTTP status code when get http://localhost:4000", async () => {
    const response = await fetch("http://localhost:4000")
    expect(response.status).toBe(200)
  })
})