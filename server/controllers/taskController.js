import { tasks, updateTasks } from "../config/db.js";

//@desc Get all task
//@route Get /api/tasks
export const getTasks = (req, res) => {
  res.json(tasks);
};

//@desc create a task
//@route post /api/tasks
export const createTask = (req, res) => {
  const { text, category, dueDate, createdAt } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Task text is required" });
  }

  const newTask = {
    id: Date.now(),
    text,
    category: category || "Personal",
    dueDate: dueDate || "",
    createdAt: createdAt || "Just Now",
    completed: false,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
};

//@desc update task
//@route PUT /api/tasks/:id
export const updateTask = (req, res) => {
  const taskId = Number(req.params.id);
  const { text, completed } = req.body;

  let task = tasks.find((t) => t.id === taskId);

  if (!tasks) {
    return res.status(404).json({ message: "Task Not Found" });
  }

  if (text !== undefined) task.text = text;
  if (completed !== undefined) task.completed = completed;
  res.json(task);
};

//@desc Delete a task
//@route DELETE /api/tasks/:id
export const deleteTask = (req, res) => {
  const taskId = Number(req.params.id);
  const taskExists = tasks.some((t) => t.id === taskId);

  if (!taskExists) {
    return res.status(404).json({ message: "Task Not Found" });
  }

  const filteredTasks = tasks.filter((t) => t.id !== taskId);
  updateTasks(filteredTasks);
  res.json({ message: "Task Successfully Deleted" });
};
