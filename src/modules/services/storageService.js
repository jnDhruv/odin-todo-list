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
        // Due time of default task is 1 hour ahead of when it's created
        const dueDate = new Date(new Date().getTime() + 60 * 60000);
        
        const defaultTask = taskService.createTask("Study", "Twice a day", 1, dueDate.getTime());

        projectService.addTaskToProject(defaultProject, defaultTask);
        return [defaultProject];
    }
}