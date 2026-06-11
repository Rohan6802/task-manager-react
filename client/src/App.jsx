import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import SearchBar from "./components/SearchBar";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [taskInput, setTaskInput] = useState("");

  const [categoryInput, setCategoryInput] = useState("Personal");
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

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
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && !task.completed) ||
      (filter === "completed" && task.completed);
    const cleanSearch = searchQuery.toLowerCase();
    const matchesSearch =
      task.text.toLowerCase().includes(cleanSearch) ||
      task.category.toLowerCase().includes(cleanSearch);

    return matchesFilter && matchesSearch;
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
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

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
