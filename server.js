const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./openapi.json");

const express = require("express");

const app = express();
app.use(express.json());
const PORT = 3000;

// In-memory task list
const tasks = [
  {
    id: 1,
    title: "Learn JavaScript",
    done: false
  },
  {
    id: 2,
    title: "Build a CRUD API",
    done: false
  },
  {
    id: 3,
    title: "Complete FlyRank assignment",
    done: false
  }
];

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    name: "Task API",
    version: "1.0",
    endpoints: ["/tasks"]
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok"
  });
});

// Get all tasks
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// Get a single task by ID
app.get("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return res.status(404).json({
      error: `Task ${id} not found`
    });
  }

  res.json(task);
});

// Create a new task
app.post("/tasks", (req, res) => {
  const { title } = req.body;

  // Validation
  if (!title || title.trim() === "") {
    return res.status(400).json({
      error: "Title is required"
    });
  }

  // Create a new task
  const newTask = {
    id: tasks.length + 1,
    title: title,
    done: false
  };

  // Add task to the array
  tasks.push(newTask);

  // Return the new task
  res.status(201).json(newTask);
});

// Update a task
app.put("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const task = tasks.find((task) => task.id === id);

  // Check if task exists
  if (!task) {
    return res.status(404).json({
      error: `Task ${id} not found`
    });
  }

  const { title, done } = req.body;

  // Check if the request body is empty
  if (title === undefined && done === undefined) {
    return res.status(400).json({
      error: "Title or done is required"
    });
  }

  // Update title if provided
  if (title !== undefined) {
    if (typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({
        error: "Title must be a non-empty string"
      });
    }

    task.title = title;
  }

  // Update done if provided
  if (done !== undefined) {
    if (typeof done !== "boolean") {
      return res.status(400).json({
        error: "Done must be true or false"
      });
    }

    task.done = done;
  }

  res.json(task);
});

// Delete a task
app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const taskIndex = tasks.findIndex((task) => task.id === id);

  // Check if task exists
  if (taskIndex === -1) {
    return res.status(404).json({
      error: `Task ${id} not found`
    });
  }

  // Remove the task
  tasks.splice(taskIndex, 1);

  // Successfully deleted
  res.status(204).send();
});

// Swagger UI documentation
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});