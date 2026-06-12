import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import SearchBar from "./components/SearchBar";
import TaskStats from "./components/TaskStats";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [taskInput, setTaskInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("Personal");
  const [dateInput, setDateInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Newest");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleTaskInput = (e) => {
    e.preventDefault();

    if (taskInput.trim() === "") return;

    const now = new Date();
    const formattedCreatedDate = now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const newTask = {
      id: Date.now(),
      text: taskInput,
      category: categoryInput,
      dueDate: dateInput,
      createdAt: formattedCreatedDate,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setTaskInput("");
    setCategoryInput("Personal");
    setDateInput("");
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

  const processedTasks = tasks
    .filter((task) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "active" && !task.completed) ||
        (filter === "completed" && task.completed);
      const cleanSearch = searchQuery.toLowerCase();
      const matchesSearch =
        task.text.toLowerCase().includes(cleanSearch) ||
        task.category.toLowerCase().includes(cleanSearch);

      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "Newest") {
        return b.id - a.id;
      } else {
        return a.id - b.id;
      }
    });

  return (
    <div className="container">
      <h1 className="heading">Task Manager</h1>

      <TaskStats tasks={tasks} />
      {/* input form */}
      <TaskForm
        taskInput={taskInput}
        setTaskInput={setTaskInput}
        onAddTask={handleTaskInput}
        categoryInput={categoryInput}
        setCategoryInput={setCategoryInput}
        dateInput={dateInput}
        setDateInput={setDateInput}
      />
      {/* Filter buttons Control Panel*/}
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="controls-row">
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
        <div className="sort-container">
          <label htmlFor="sort-select" className="sort-label-text">
            Sort By:{" "}
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>
      {/* Task list */}
      <TaskList
        tasks={processedTasks}
        onToggleComplete={handleTaskComplete}
        onDeleteTask={handleDeleteTask}
        onUpdateTask={handleUpdateTask}
      />
    </div>
  );
}

export default App;
