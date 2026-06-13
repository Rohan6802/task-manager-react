export let tasks = [
  {
    id: 1,
    text: "Learn Node and Express backend basics",
    category: "work",
    completed: false,
    createdAt: "Jun 13, 2026",
    dueDate: "",
  },
];

export const updateTasks = (newTasksArray) => {
  tasks = newTasksArray;
};
