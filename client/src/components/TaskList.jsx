import React from "react";
import TaskItem from "./TaskItem";

function TaskList({ tasks, onToggleComplete, onDeleteTask, onUpdateTask }) {
  if (tasks.length === 0) {
    return <p className="emptyText">No tasks remaining</p>;
  }
  return (
    <ul className="list">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onToggleComplete={onToggleComplete}
          onDeleteTask={onDeleteTask}
          onUpdateTask={onUpdateTask}
        />
      ))}
    </ul>
  );
}

export default TaskList;
