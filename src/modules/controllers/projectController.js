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
        this.save();
    },

    deleteProject(projectID) {
        this.projects = this.projects.filter(project => project.id != projectID);
        this.save();
    },

    findProject(projectID) {
        const project = this.projects.find(project => project.id == projectID);
        if (!project) throw new Error("No such project found");

        return project;
    },

    findTaskInProject(taskID, projectID) {
        const project = this.findProject(projectID);
        if (!project) throw new Error("No such project found");

        return project.tasksArr.find(task => task.id == taskID);
    },

    addTaskToProject(projectID, task) {
        const project = this.findProject(projectID);
        if (!project) throw new Error("No such project found");

        projectService.addTaskToProject(project, task);
        this.save();
    },

    updateTaskInProject(projectID, taskID, properties) {
        const taskToBeUpdated = this.findTaskInProject(taskID, projectID);
        if (!taskToBeUpdated) throw new Error("No such task found");

        taskService.updateTask(taskToBeUpdated, properties);
        this.save();
    },

    deleteTaskFromProject(projectID, task) {
        const project = this.findProject(projectID);
        if (!project) throw new Error("No such project found");

        projectService.removeTaskFromProject(project, task.id);
        this.save();
    },

    sortTasksByStatus(projectID) {
        const project = this.findProject(projectID);
        projectService.sortTasksByStatus(project);
    },

    sortTasksByPriority(projectID) {
        const project = this.findProject(projectID);
        projectService.sortTasksByPriority(project);
    },

    sortTasksByDueDate(projectID) {
        const project = this.findProject(projectID);
        projectService.sortTasksByDueDate(project);
    }
}