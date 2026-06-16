import { useEffect, useState } from "react";
import axios from "axios";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import SearchBar from "./components/SearchBar";
import TaskStats from "./components/TaskStats";
import "./App.css";

const API_URL = "http://localhost:5000/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("Personal");
  const [dateInput, setDateInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Newest");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(API_URL);
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching task: ", error);
      }
    };
    fetchTasks();
  }, []);

  const handleTaskInput = async (e) => {
    e.preventDefault();

    if (taskInput.trim() === "") return;

    const now = new Date();
    const formattedCreatedDate = now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const newTaskData = {
      id: Date.now(),
      text: taskInput,
      category: categoryInput,
      dueDate: dateInput,
      createdAt: formattedCreatedDate,
      completed: false,
    };

    try {
      const response = await axios.post(API_URL, newTaskData);
      setTasks([...tasks, response.data]);
      setTaskInput("");
      setCategoryInput("Personal");
      setDateInput("");
    } catch (error) {
      console.error("Error creating task: ", error);
    }
  };

  const handleTaskComplete = async (idToToggle) => {
    const targetTask = tasks.find((task) => task.id === idToToggle);
    if (!targetTask) return;

    try {
      await axios.put(`${API_URL}/${idToToggle}`, {
        completed: !targetTask.completed,
      });

      const updatedTasks = tasks.map((task) =>
        task.id === idToToggle ? { ...task, completed: !task.completed } : task,
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error updating task status: ", error);
    }
  };

  const handleDeleteTask = async (idToDelete) => {
    try {
      await axios.delete(`${API_URL}/${idToDelete}`);
      const updatedTasks = tasks.filter((task) => task.id !== idToDelete);
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  };

  const handleUpdateTask = async (idToUpdate, newText) => {
    try {
      const response = await axios.put(`${API_URL}/${idToUpdate}`, {
        text: newText,
      });
      const updatedTasks = tasks.map((task) =>
        task.id === idToUpdate ? response.data : task,
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
