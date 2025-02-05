import Task from "../models/Task.js";

export default {
    createTask(title, desc, priority, dueDate) {
        return new Task(title, desc, priority, dueDate);
    },

    getPriority(task) {
        if (task.priority == 1) {
            return "High";
        }
        else if (task.priority == 2) {
            return "Medium";
        }
        return "Low";
    },

    getDueDate(task) {
        return new Date(task.dueDate);
    },

    updateTask(task, property) {
        Object.assign(task, property);
    },

    toggleCompletd(task) {
        task.completed = !task.completed;
    },
}