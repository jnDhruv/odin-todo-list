import projectService from "./projectService";
import taskService from "./taskService";

export default {
    STORAGE_KEY: "todoProjects",

    saveProjects(projects) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
    },

    loadProjects() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        if (!data) {
            const defaultProjects = this.initializeDefaultData();
            this.saveProjects(defaultProjects);
            return defaultProjects;
        }
        return JSON.parse(data);
    },

    initializeDefaultData() {
        const defaultProject = projectService.createProject("Default Tasks");
        const defaultTasks = [
            taskService.createTask("Brush your teeth", "", 1, (new Date()).setHours(0, 0, 0, 0)),
            taskService.createTask("Take a bath", "", 1, (new Date()).setHours(0, 0, 0, 0)),
        ];

        defaultTasks.forEach(task => projectService.addTaskToProject(defaultProject, task));
        return [defaultProject];
    }

}