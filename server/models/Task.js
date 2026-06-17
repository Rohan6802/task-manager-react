import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    default: "Personal",
  },
  dueDate: {
    type: String,
    default: "",
  },
  createAt: {
    type: String,
    default: "Just Now",
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
