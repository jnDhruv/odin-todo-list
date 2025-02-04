import Task from "../models/Task.js";

export default {
    createTask(title, desc, priority, dueDate) {
        return new Task(title, desc, priority, dueDate);
    },

    updateTask(task, property) {
        Object.assign(task, property);
    },

    toggleCompletd(task) {
        task.completed = !task.completed;
    },
}