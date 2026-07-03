import { useEffect, useState } from "react";
// import axios from "axios";
import TaskForm from "./components/tasks/TaskForm";
import TaskList from "./components/tasks/TaskList";
import SearchBar from "./components/tasks/SearchBar";
import TaskStats from "./components/tasks/TaskStats";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import "./App.css";
import API from "./api";

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("Personal");
  const [dateInput, setDateInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Newest");
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("token");
  });
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const fetchUserTasks = async () => {
      if (!isAuthenticated) return;
      try {
        const response = await API.get("/tasks");

        setTasks(response.data);
      } catch (error) {
        console.error(
          "Error fetching tasks: ",
          error.response?.data?.message || error.message,
        );
      }
    };
    fetchUserTasks();
  }, [isAuthenticated]);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  const handleTaskInput = async (e) => {
    e.preventDefault();

    if (taskInput.trim() === "") return;

    try {
      const response = await API.post("/tasks", {
        text: taskInput,
        category: categoryInput || "Personal",
        dueDate: dateInput || null,
      });

      setTasks([...tasks, response.data]);

      setTaskInput("");
      setCategoryInput("Personal");
      setDateInput("");
    } catch (error) {
      console.error(
        "Error creating task: ",
        error.response?.data?.message || error.message,
      );
    }
  };

  const handleTaskComplete = async (idToToggle) => {
    const targetTask = tasks.find((task) => task._id === idToToggle);
    if (!targetTask) return;

    try {
      const response = await API.put(`/tasks/${idToToggle}`, {
        completed: !targetTask.completed,
      });

      setTasks(
        tasks.map((task) => (task._id === idToToggle ? response.data : task)),
      );
    } catch (error) {
      console.error(
        "Error updating task status: ",
        error.response?.data?.message || error.message,
      );
    }
  };

  const handleDeleteTask = async (idToDelete) => {
    try {
      await API.delete(`/tasks/${idToDelete}`);

      setTasks(tasks.filter((task) => task._id !== idToDelete));
    } catch (error) {
      console.error(
        "Error deleting task: ",
        error.response?.data?.message || error.message,
      );
    }
  };

  const handleUpdateTask = async (idToUpdate, newText) => {
    try {
      const response = await API.put(`/tasks/${idToUpdate}`, {
        text: newText,
      });
      const updatedTasks = tasks.map((task) =>
        task._id === idToUpdate ? response.data : task,
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.log("Error updating task text: ", error);
    }
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
      if (sortBy === "newest") {
        return b.id - a.id; // High ID timestamp (newer) moves to the top
      } else {
        return a.id - b.id; // Low ID timestamp (older) stays at the top
      }
    });

  return (
    <div className="container">
      <header>
        <h1 className="heading">Task Manager</h1>
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            style={{
              padding: "8px 12px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        )}
      </header>
      {isAuthenticated ? (
        <>
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
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
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
        </>
      ) : (
        <div style={{ marginBottom: "20px" }}>
          {showRegister ? (
            <Register onRegisterSuccess={handleAuthSuccess} />
          ) : (
            <Login onLoginSuccess={handleAuthSuccess} />
          )}

          <p style={{ textAlign: "center", marginTop: "15px" }}>
            {showRegister
              ? "Already have an account? "
              : "Don't have an account? "}
            <button
              onClick={() => setShowRegister(!showRegister)}
              style={{
                background: "none",
                border: "none",
                color: "#007bff",
                cursor: "pointer",
                textDecoration: "underline",
                padding: 0,
              }}
            >
              {showRegister ? "Login here" : "Register here"}
            </button>
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
