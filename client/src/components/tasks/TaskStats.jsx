import React from "react";

function TaskStats({ tasks }) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const remainingTasks = totalTasks - completedTasks;

  return (
    <div className="stats-container">
      <div className="stat-card total">
        <span className="stat-label">Total</span>
        <span className="stat-number">{totalTasks}</span>
      </div>
      <div className="stat-card completed">
        <span className="stat-label">Completed</span>
        <span className="stat-number">{completedTasks}</span>
      </div>
      <div className="stat-card remaining">
        <span className="stat-label">Remaining</span>
        <span className="stat-number">{remainingTasks}</span>
      </div>
    </div>
  );
}

export default TaskStats;
