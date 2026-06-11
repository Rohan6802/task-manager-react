import { useState } from "react";

function TaskItem({ task, onToggleComplete, onDeleteTask, onUpdateTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const handleSave = () => {
    if (editText.trim() === "") return;
    onUpdateTask(task.id, editText);
    setIsEditing(false);
  };

  const handleCancle = () => {
    setEditText(task.text);
    setIsEditing(false);
  };

  return (
    <li className="listItem">
      <div className="taskContent">
        <input
          type="checkbox"
          checked={task.completed || false}
          onChange={() => onToggleComplete(task.id)}
          className="checkbox"
          disabled={isEditing}
        />
        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="editInput"
            style={{ flex: 1, padding: "4px 8px", fontSize: "16px" }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flex: 1,
            }}
          >
            <span className={`taskText ${task.completed ? "completed" : ""}`}>
              {task.text}
            </span>
            {/* Category Task badge */}
            <span
              className={`category-badge ${task.category?.toLowerCase() || "personal"}`}
            >
              {task.category || "Personal"}
            </span>
          </div>
        )}
      </div>
      <div className="buttonGroup" style={{ display: "flex", gap: "5px" }}>
        {isEditing ? (
          <>
            <button
              className="saveButton"
              onClick={handleSave}
              style={{
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                padding: "6px 10px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Save
            </button>
            <button
              className="cancelButton"
              onClick={handleCancle}
              style={{
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                padding: "6px 10px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="editButton"
              disabled={task.completed}
              style={{
                backgroundColor: "#008CBA",
                color: "white",
                border: "none",
                padding: "6px 10px",
                borderRadius: "4px",
                cursor: task.completed ? 0.5 : 1,
              }}
            >
              Edit
            </button>
            <button
              onClick={() => onDeleteTask(task.id)}
              className="deleteButton"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </li>
  );
}

export default TaskItem;
