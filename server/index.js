import express, { json, text } from "express";
import cors from "cors";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("Task Manager Backend server is running sucessfully!");
});

app.listen(PORT, () => {
  console.log(`The server successfully running on: http://localhost:${PORT}`);
});
