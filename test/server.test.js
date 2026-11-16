
const { test } = require("node:test");
const assert = require("node:assert");
const request = require("supertest");

const app = require("../server");

// Test 1: Root endpoint
test("GET / should return API information", async () => {
  const response = await request(app).get("/");

  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body.name, "Task API");
});

// Test 2: Health endpoint
test("GET /health should return ok status", async () => {
  const response = await request(app).get("/health");

  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body.status, "ok");
});

// Test 3: Get all tasks
test("GET /tasks should return the task list", async () => {
  const response = await request(app).get("/tasks");

  assert.strictEqual(response.status, 200);
  assert.ok(Array.isArray(response.body));
  assert.ok(response.body.length >= 3);
});

// Test 4: Get a task by ID
test("GET /tasks/1 should return the first task", async () => {
  const response = await request(app).get("/tasks/1");

  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body.title, "Learn JavaScript");
});

// Test 5: Missing task
test("GET /tasks/999 should return 404", async () => {
  const response = await request(app).get("/tasks/999");

  assert.strictEqual(response.status, 404);
});


// Test 6: POST with a missing title
test("POST /tasks should reject a missing title", async () => {
  const response = await request(app)
    .post("/tasks")
    .send({});

  assert.strictEqual(response.status, 400);
  assert.strictEqual(response.body.error, "Title is required");
});

// Test 7: POST with a number as title
test("POST /tasks should reject a number as title", async () => {
  const response = await request(app)
    .post("/tasks")
    .send({ title: 123 });

  assert.strictEqual(response.status, 400);
  assert.strictEqual(response.body.error, "Title is required");
});

// Test 8: POST with an empty title
test("POST /tasks should reject an empty title", async () => {
  const response = await request(app)
    .post("/tasks")
    .send({ title: "   " });

  assert.strictEqual(response.status, 400);
  assert.strictEqual(response.body.error, "Title is required");
});
