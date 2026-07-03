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

const cors = require("cors");

const allowedOrigins = [
  "http://localhost:3000",
  "https://task-manager-react-three-kappa.vercel.app/",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Allow requests with no origin (like mobile apps or curl requests)
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.options("*", cors()); // Enable pre-flight for all routes

app.use(express.json());

app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Task Manager MongoDB Backend server is running sucessfully!");
});

app.listen(PORT, () => {
  console.log(`The server successfully running on: http://localhost:${PORT}`);
});
