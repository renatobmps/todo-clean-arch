describe("src/index.ts", () => {
  it("Should return 200 HTTP status code when get to /", async () => {
    const response = await fetch("http://localhost:4000")
    expect(response.status).toBe(200)
  })
})