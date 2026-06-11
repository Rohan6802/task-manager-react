import React from "react";

function TaskForm({
  taskInput,
  setTaskInput,
  categoryInput,
  setCategoryInput,
  onAddTask,
}) {
  return (
    <form onSubmit={onAddTask} className="form">
      <input
        type="text"
        placeholder="Add Task"
        value={taskInput}
        onChange={(e) => setTaskInput(e.target.value)}
        className="input"
      />
      <select
        value={categoryInput}
        onChange={(e) => setCategoryInput(e.target.value)}
        className="category-select"
      >
        <option value="Personal">Personal</option>
        <option value="Work">Work</option>
        <option value="Shopping">Shopping</option>
      </select>
      <button type="submit" className="addButton">
        Add Task
      </button>
    </form>
  );
}
export default TaskForm;
