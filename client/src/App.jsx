import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [taskInput, setTaskInput] = useState("");

  const [categoryInput, setCategoryInput] = useState("Personal");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleTaskInput = (e) => {
    e.preventDefault();

    if (taskInput.trim() === "") return;

    const newTask = {
      id: Date.now(),
      text: taskInput,
      category: categoryInput,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setTaskInput("");
    setCategoryInput("Personal");
  };

  const handleTaskComplete = (idToToggle) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === idToToggle) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const handleDeleteTask = (idToDelete) => {
    const updatedTasks = tasks.filter((task) => task.id !== idToDelete);
    setTasks(updatedTasks);
  };

  const handleUpdateTask = (idToUpdate, newText) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === idToUpdate) {
        return { ...task, text: newText };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  return (
    <div className="container">
      <h1 className="heading">Task Manager</h1>
      {/* input form */}
      <TaskForm
        taskInput={taskInput}
        setTaskInput={setTaskInput}
        onAddTask={handleTaskInput}
        categoryInput={categoryInput}
        setCategoryInput={setCategoryInput}
      />
      {/* Filter buttons Control Panel*/}
      <div className="filter-container">
        <button
          className={`filter-btn ${filter === "all" ? "active-filter" : ""}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`filter-btn ${filter === "active" ? "active-filter" : ""}`}
          onClick={() => setFilter("active")}
        >
          Active
        </button>
        <button
          className={`filter-btn ${filter === "completed" ? "active-filter" : ""}`}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>
      {/* Task list */}
      <TaskList
        tasks={filteredTasks}
        onToggleComplete={handleTaskComplete}
        onDeleteTask={handleDeleteTask}
        onUpdateTask={handleUpdateTask}
      />
    </div>
  );
}

export default App;
