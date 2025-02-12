import projectController from "../controllers/projectController";
import taskService from "../services/taskService";
import { formatDistance, format } from 'date-fns';

import "../../styles/projectContent.css";
import "../../styles/dialogs.css"

import infoIcon from "../../icons/info.svg";
import editIcon from "../../icons/edit.svg";
import deleteIcon from "../../icons/deleteTask.svg";

function createHeading(text) {
    const heading = document.createElement('h1');
    heading.innerHTML = text;
    return heading;
}

function createPara(text) {
    const para = document.createElement('p');
    para.innerHTML = text;
    return para;
}

function createDiv(content, ...classes) {
    const newDiv = document.createElement('div');
    newDiv.innerHTML = content;
    if (classes.length !== 0) {
        newDiv.classList.add(classes);
    }
    return newDiv;
}

function createImg(srcObj, alt, width, height) {
    const imgElement = document.createElement('img');
    imgElement.src = srcObj;
    imgElement.alt = alt;
    if (width) {
        imgElement.width = width;
    }
    if (height) {
        imgElement.height = height;
    }
    return imgElement;
}

export default {

    createTaskRow(task, project) {
        const checkDiv = createDiv('');
        const checkBox = document.createElement('input');
        checkBox.type = 'checkbox';
        checkBox.id = task.id;
        checkDiv.appendChild(checkBox);

        const taskTitleDiv = createDiv('', 'task-title-div');
        const taskTitleP = createPara(task.title);

        const taskButtonsDiv = createDiv('', 'task-buttons-div');

        const taskInfoButton = document.createElement("button");
        const infoImg = createImg(infoIcon, 'info', 20, 20);
        taskInfoButton.appendChild(infoImg);
        taskInfoButton.title = "Info";
        taskButtonsDiv.appendChild(taskInfoButton);

        const taskEditButton = document.createElement("button");
        const editImg = createImg(editIcon, 'Edit', 20, 20);
        taskEditButton.appendChild(editImg);
        taskEditButton.title = "Edit";
        taskButtonsDiv.appendChild(taskEditButton);

        const taskDeleteButton = document.createElement("button");
        const deleteImg = createImg(deleteIcon, 'Delete', 20, 20);
        taskDeleteButton.appendChild(deleteImg);
        taskDeleteButton.title = "Delete";
        taskButtonsDiv.appendChild(taskDeleteButton);

        taskTitleDiv.appendChild(taskTitleP);
        taskTitleDiv.appendChild(taskButtonsDiv);

        const taskPriorDiv = createDiv('');
        const taskPriorP = createPara(taskService.getPriority(task));

        switch (taskService.getPriority(task)) {
            case "High":
                taskPriorP.style.color = "#E63946";
                break;
            case "Medium":
                taskPriorP.style.color = "#E9C46A";
                break;
            case "Low":
                taskPriorP.style.color = "#2A9D8F";
                break;
        }

        taskPriorDiv.appendChild(taskPriorP);

        const taskDueInDiv = createDiv('');
        const taskDueInP = document.createElement('p');
        if ((new Date()).getTime() > task.dueDate) {
            taskDueInP.textContent = format(taskService.getDueDate(task), 'dd MMM yyyy');
            taskDueInP.style.color = "#E63946";
        } else {
            taskDueInP.textContent = formatDistance(taskService.getDueDate(task), new Date());
        }

        taskDueInDiv.appendChild(taskDueInP);

        checkBox.addEventListener('click', () => {
            taskService.toggleCompletd(task);
            this.render(project);
        });

        if (task.completed) {
            checkBox.checked = true;
            taskTitleDiv.classList.add("task-completed");
            taskPriorDiv.classList.add("task-completed");
            taskDueInDiv.classList.add("task-completed");
        }

        checkDiv.classList.add("task-list-row");
        taskTitleDiv.classList.add("task-list-row", "task-title");
        taskPriorDiv.classList.add("task-list-row");
        taskDueInDiv.classList.add("task-list-row");

        return [checkDiv, taskTitleDiv, taskPriorDiv, taskDueInDiv];
    },

    render(Project) {
        const projectContent = document.querySelector('.project-content');
        projectContent.textContent = '';

        const heading = createHeading(Project.title);

        const tasksList = createDiv('', "tasks-grid-container");

        const checkCol = createDiv('Status', 'task-list-heading');
        const titleCol = createDiv('Task', 'task-list-heading');
        const priorCol = createDiv('Priority', 'task-list-heading');
        const dueInCol = createDiv('Due In', 'task-list-heading');

        tasksList.appendChild(checkCol);
        tasksList.appendChild(titleCol);
        tasksList.appendChild(priorCol);
        tasksList.appendChild(dueInCol);

        Project.tasksArr.forEach(task => {
            const [checkDiv, taskTitleDiv, taskPriorDiv, taskDueInDiv] = this.createTaskRow(task, Project);
            tasksList.appendChild(checkDiv);
            tasksList.appendChild(taskTitleDiv);
            tasksList.appendChild(taskPriorDiv);
            tasksList.appendChild(taskDueInDiv);
        });

        const createTaskBtnDiv = createDiv('', 'task-list-row');

        const createTaskBtn = document.createElement('button');
        createTaskBtn.textContent = '+';
        createTaskBtn.addEventListener('click', () => {
            const newTaskDiag = document.querySelector('#create-new-task');
            const newTaskForm = newTaskDiag.querySelector("form");

            const title = newTaskForm.querySelector('#task-title');
            const desc = newTaskForm.querySelector('#task-desc');
            const priority = newTaskForm.querySelector('#task-priority');
            const dueDate = newTaskForm.querySelector('#task-due-date');
            newTaskDiag.showModal();

            newTaskForm.addEventListener('submit', () => {
                const newTask = taskService.createTask(title.value, desc.value, priority.value, (new Date(dueDate.value)).getTime());
                projectController.addTaskToProject(Project.id, newTask);
                newTaskForm.reset();
                this.render(Project);
            });
        });
        createTaskBtnDiv.appendChild(createTaskBtn);

        const createTaskDiv = createDiv('', 'task-list-row');

        const createTaskP = createPara('Add task');
        createTaskDiv.appendChild(createTaskP);

        tasksList.appendChild(createTaskBtnDiv);
        tasksList.appendChild(createTaskDiv);

        projectContent.appendChild(heading);
        projectContent.appendChild(tasksList);
    },

    init() {
        const projectContent = document.querySelector('.project-content');
        projectContent.textContent = '';

        const heading = createHeading("&larr; Select a Project");
        heading.style.opacity = 0.6;
        projectContent.appendChild(heading);
    }
}