import Project from "../models/project";
import {  } from "date-fns";

export default {
    createProject(title) {
        return new Project(title);
    },

    addTaskToProject(project, task) {
        project.tasksArr.push(task);
    },

    removeTaskFromProject(project, taskID) {
        project.tasksArr = project.tasksArr.filter((task) => task.id !== taskID);
    },

    sortTasksByID(project) {
        project.tasksArr.sort((task1, task2) => task1.id - task2.id);
    },

    sortTasksByPriority(project) {
        project.tasksArr.sort((task1, task2) => task1.priority - task2.priority);
    },

    sortTasksByDueDate(project) {
        project.tasksArr.sort((task1, task2) => task1.dueDate - task2.dueDate);
    },
}