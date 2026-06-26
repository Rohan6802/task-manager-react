import Task from "../models/Task.js";

//@desc Get all task
//@route Get /api/tasks
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    res.json(tasks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server Error fetching tasks.", error: error.message });
  }
};

//@desc create a task
//@route post /api/tasks
export const createTask = async (req, res) => {
  try {
    const { text, category, dueDate, createdAt } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Task text required." });
    }

    const newTask = await Task.create({
      user: req.user._id,
      text,
      category: category || "Personal",
      dueDate: dueDate || "",
      createAt: createdAt || "Just Now",
      completed: false,
    });
    res.status(200).json(newTask);
  } catch (error) {
    console.error("!!! CRITICAL BACKEND ERROR !!! ->", error);
    res
      .status(500)
      .json({ message: "Server Error Creating Task.", error: error.message });
  }
};

//@desc update task
//@route PUT /api/tasks/:id
export const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;

    const updatedTask = await Task.findByIdAndUpdate(taskId, req.body, {
      returnDocument: "after",
      runValidator: true,
    });
    if (!updatedTask) {
      return res.status(400).json({ message: "Taskl not found" });
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("!!! CRITICAL BACKEND ERROR !!! ->", error);
    res
      .status(500)
      .json({ message: "Server Error updating Task", error: error.message });
  }
};

//@desc Delete a task
//@route DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task Not Found" });
    }

    res.json({ message: "Task Successfully removed from cloud storage." });
  } catch (error) {
    (res.status(500),
      json({ message: "Server Error Deleting Task", error: error.message }));
  }
};
