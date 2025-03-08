const request = require("supertest");
const app = require("../server"); // Import your Express app
const fs = require("fs");
const path = require("path");

describe("Recipe API Endpoints", () => {
  let token;

  beforeAll(async () => {
    // Login to get a token
    const res = await request(app)
      .post("/login")
      .send({ email: "john.doe@example.com", password: "password123" });
    token = res.body.token;
  });

  it("should fetch all recipes", async () => {
    const res = await request(app)
      .get("/recipes")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it("should create a new recipe", async () => {
    const res = await request(app)
      .post("/recipes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Recipe",
        description: "Test Description",
        ingredients: "Test Ingredients",
        instructions: "Test Instructions",
        imageUrl: "http://example.com/image.jpg",
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("id");
  });

  it("should upload an image", async () => {
    const imagePath = path.join(__dirname, "test-image.jpg");
    const res = await request(app)
      .post("/upload")
      .set("Authorization", `Bearer ${token}`)
      .attach("image", imagePath);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("imageUrl");
  });
});