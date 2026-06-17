import express, { json, text } from "express";
import cors from "cors";
import connetDB from "./config/db.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

connetDB();

app.use(cors());
app.use(express.json());

app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("Task Manager MongoDB Backend server is running sucessfully!");
});

app.listen(PORT, () => {
  console.log(`The server successfully running on: http://localhost:${PORT}`);
});
