import projectController from "../controllers/projectController";
import taskService from "../services/taskService";
import { formatDistanceToNow, format } from 'date-fns';

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

function createPara(text, ...classes) {
    const para = document.createElement('p');
    para.innerHTML = text;
    if (classes.length !== 0) {
        classes.forEach(classIn => para.classList.add(classIn));
    }
    return para;
}

function createDiv(content, ...classes) {
    const newDiv = document.createElement('div');
    newDiv.innerHTML = content;
    if (classes.length !== 0) {
        classes.forEach(classIn => newDiv.classList.add(classIn));
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
        const checkDiv = createDiv('', "task-list-row");
        const checkBox = document.createElement('input');
        checkBox.type = 'checkbox';
        checkBox.id = task.id;
        checkDiv.appendChild(checkBox);

        const taskTitleDiv = createDiv('', 'task-title-div', 'task-list-row');
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

        const taskDescDiv = createDiv('', 'task-desc-div', 'closed');
        taskDescDiv.appendChild(createPara(`Description: ${task.desc}`));
        taskDescDiv.appendChild(createPara(`Created on: ${format(new Date(task.id), 'HH:mm dd MMM yyyy')}`));
        taskDescDiv.appendChild(createPara(`Due on: ${format(taskService.getDueDate(task), 'HH:mm dd MMM yyyy')}`));
        taskDescDiv.appendChild(createPara(`Status: ${task.completed? 'Completed':'Pending'}`))

        taskInfoButton.addEventListener('click', () => {
            taskDescDiv.classList.toggle('active');
            if (taskDescDiv.style.maxHeight) {
                taskDescDiv.style.maxHeight = null;
            } else {
                taskDescDiv.style.maxHeight = taskDescDiv.scrollHeight + 'px';
            }
        });

        taskEditButton.addEventListener('click', () => {
            const editTaskDiag = document.querySelector('dialog#edit-task');
            
            const editTaskForm = editTaskDiag.querySelector('form');
            editTaskForm.dataset.forTaskID = task.id;
            editTaskForm.dataset.forProjectID = project.id;

            const title = editTaskForm.querySelector('#edit-title');
            title.value = task.title;

            const desc = editTaskForm.querySelector('#edit-desc');
            desc.value = task.desc;

            const priority = editTaskForm.querySelector('#edit-priority');
            priority.value = task.priority;

            const dueDate = editTaskForm.querySelector('#edit-due-date');
            const prevDueDate = taskService.getDueDate(task);
            dueDate.min = prevDueDate.toISOString().slice(0, 16);
            prevDueDate.setHours(prevDueDate.getHours());
            prevDueDate.setMinutes(prevDueDate.getMinutes() - prevDueDate.getTimezoneOffset());
            dueDate.value = prevDueDate.toISOString().slice(0, 16);

            editTaskDiag.showModal();

            editTaskForm.addEventListener('submit', (e) => {
                if (editTaskForm.checkValidity()) {
                    const taskID = e.target.dataset.forTaskID;
                    const projectID = e.target.dataset.forProjectID;
                    projectController.updateTaskInProject(projectID, taskID, {
                        title: title.value,
                        desc: desc.value,
                        priority: priority.value,
                        dueDate: (new Date(dueDate.value)).getTime(),
                    });
                    editTaskForm.reset();
                    this.render(projectID);
                }
            });

        });

        taskDeleteButton.addEventListener('click', () => {
            projectController.deleteTaskFromProject(project.id, task);
            this.render(project.id);
        });

        taskTitleDiv.appendChild(taskTitleP);
        taskTitleDiv.appendChild(taskButtonsDiv);
        taskTitleDiv.appendChild(taskDescDiv);

        const taskPriorDiv = createDiv('', "task-list-row");
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

        const taskDueInDiv = createDiv('', "task-list-row");
        const taskDueInP = document.createElement('p');
        if ((new Date()).getTime() > task.dueDate) {
            taskDueInP.textContent = format(taskService.getDueDate(task), 'dd MMM yyyy');
            taskDueInP.style.color = "#E63946";
        } else {
            taskDueInP.textContent = formatDistanceToNow(taskService.getDueDate(task), { addSuffix: true });
        }

        taskDueInDiv.appendChild(taskDueInP);

        checkBox.addEventListener('click', () => {
            taskService.toggleCompletd(task);
            this.render(project.id);
        });

        if (task.completed) {
            checkBox.checked = true;
            taskTitleDiv.classList.add("task-completed");
            taskPriorDiv.classList.add("task-completed");
            taskDueInDiv.classList.add("task-completed");
        }

        const taskRowContainer = createDiv('', 'task-list-row-container');

        taskRowContainer.appendChild(checkDiv);
        taskRowContainer.appendChild(taskTitleDiv);
        taskRowContainer.appendChild(taskPriorDiv);
        taskRowContainer.appendChild(taskDueInDiv);

        return taskRowContainer;
    },

    render(projectID) {
        const project = projectController.findProject(projectID);

        const projectContent = document.querySelector('.project-content');
        projectContent.textContent = '';

        const heading = createHeading(project.title);

        const tasksList = createDiv('', "tasks-grid-container");
        const tasksHeadingContainer = createDiv('', 'task-list-heading-container');

        const checkCol = createDiv('Status', 'task-list-heading');
        const titleCol = createDiv('Task', 'task-list-heading');
        const priorCol = createDiv('Priority', 'task-list-heading');
        const dueInCol = createDiv('Due', 'task-list-heading');

        tasksHeadingContainer.appendChild(checkCol);
        tasksHeadingContainer.appendChild(titleCol);
        tasksHeadingContainer.appendChild(priorCol);
        tasksHeadingContainer.appendChild(dueInCol);

        tasksList.appendChild(tasksHeadingContainer);

        project.tasksArr.forEach(task => {
            const taskRowContainer = this.createTaskRow(task, project);
            tasksList.appendChild(taskRowContainer);
        });

        const createTaskContainer = createDiv('', 'create-task-row');

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
            const now = new Date();
            dueDate.min = now.toISOString().slice(0, 16);
            now.setHours(now.getHours() + 1);
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            dueDate.value = now.toISOString().slice(0, 16);

            newTaskDiag.showModal();

            newTaskForm.addEventListener('submit', () => {
                if (newTaskForm.checkValidity()) {
                    const newTask = taskService.createTask(title.value, desc.value, priority.value, (new Date(dueDate.value)).getTime());
                    projectController.addTaskToProject(projectID, newTask);
                    newTaskForm.reset();
                    this.render(projectID);
                }
            });
        });
        createTaskBtnDiv.appendChild(createTaskBtn);

        const createTaskDiv = createDiv('', 'task-list-row');

        const createTaskP = createPara('Add task');
        createTaskDiv.appendChild(createTaskP);

        createTaskContainer.appendChild(createTaskBtnDiv);
        createTaskContainer.appendChild(createTaskDiv);

        tasksList.appendChild(createTaskContainer);

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