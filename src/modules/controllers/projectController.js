import projectService from "../services/projectService";
import taskService from "../services/taskService";
import storageService from "../services/storageService";

export default {
    projects : storageService.loadProjects(),

    save() {
        storageService.saveProjects(this.projects);
    },

    addProject(title) {
        this.projects.push(projectService.createProject(title));
        this.save();
    },

    updateProject(projectID, property) {
        const project = this.findProject(projectID);
        if (project) {
            Object.assign(project, property);
        }
    },

    deleteProject(projectID) {
        this.projects = this.projects.filter(project => project.id !== projectID);
        this.save();
    },

    findProject(projectID) {
        return this.projects.find(project => project.id === projectID);
    },

    addTaskToProject(projectID, task) {
        const project = this.findProject(projectID);
        if (!project) throw new Error("No such project found");

        projectService.addTaskToProject(project, task);
        this.save();
    },

    deleteTaskToProject(projectID, task) {
        const project = this.findProject(projectID);
        if (!project) throw new Error("No such project found");

        projectService.removeTaskFromProject(project, task);
        this.save();
    },
}