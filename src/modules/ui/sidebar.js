import projectController from "../controllers/projectController";
import loadProjectPage from "./loadProjectPage";

import "../../styles/sidebar.css";
import deleteIcon from "../../icons/delete.svg";

export default {
    createProjectLi(project) {
        const projectLi = document.createElement('li');

        const projectButton = document.createElement('button');
        projectButton.textContent = project.title;
        projectButton.dataset.projectID = project.id;
        projectButton.addEventListener('click', () => {
            loadProjectPage.render(project);
        });

        const deleteButton = document.createElement('button');
        deleteButton.classList.add("project-delete");
        const deleteImg = document.createElement('img');
        deleteImg.src = deleteIcon;
        deleteImg.alt = "Delete";
        deleteButton.addEventListener('click', () => {
            projectController.deleteProject(project.id);
            this.render();
        });
        deleteButton.appendChild(deleteImg);

        projectLi.classList.add('project-button');
        projectLi.appendChild(projectButton);
        projectLi.appendChild(deleteButton);
    
        return projectLi;
    },

    render() {
        const navList = document.querySelector("nav ul");
        navList.innerHTML = '';

        const heading = document.createElement('h2');
        heading.textContent = "PROJECTS:";
        heading.classList.add("menu-heading");
        navList.appendChild(heading);

        const projects = projectController.projects;

        projects.forEach((project) => {
            const projectLi = this.createProjectLi(project);
            navList.appendChild(projectLi);
        });

        const addNewProjectLi = document.createElement('li');

        addNewProjectLi.classList.add('project-button', 'new-project-button');
        
        const addNewProjectBtn = document.createElement('button');
        addNewProjectBtn.textContent = `+ Create new project`;
        addNewProjectBtn.addEventListener('click', () => {
            const newProjDiag = document.querySelector('#create-new-project');
            const newProjForm = newProjDiag.querySelector('form');

            const newProjTitle = newProjForm.querySelector('#project-title');

            newProjDiag.showModal();

            newProjForm.addEventListener('submit', () => {
                projectController.addProject(newProjTitle.value);
                newProjForm.reset();
                this.render();
            });

            this.render();
        });

        addNewProjectLi.appendChild(addNewProjectBtn);
        navList.appendChild(addNewProjectLi);
    }
}