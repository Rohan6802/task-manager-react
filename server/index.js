import express, { json, text } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connetDB from "./config/db.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connetDB();

app.use(cors());
app.use(express.json());

app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Task Manager MongoDB Backend server is running sucessfully!");
});

app.listen(PORT, () => {
  console.log(`The server successfully running on: http://localhost:${PORT}`);
});
