import projectController from "../controllers/projectController";
import taskService from "../services/taskService";
import { formatDistance } from 'date-fns';

import "../../styles/projectContent.css";
import "../../styles/dialogs.css"

import editIcon from "../../icons/edit.svg";

function createHeading(text) {
    const heading = document.createElement('h1');
    heading.innerHTML = text;
    return heading;
}

export default {

    createTaskRow(task, project) {
        const checkDiv = document.createElement('div');
        const checkBox = document.createElement('input');
        checkBox.type = 'checkbox';
        checkBox.id = task.id;
        checkDiv.appendChild(checkBox);

        const taskTitleDiv = document.createElement('div');
        const taskTitleP = document.createElement('p');
        taskTitleP.textContent = task.title;
        taskTitleDiv.appendChild(taskTitleP);

        const taskPriorDiv = document.createElement('div');
        const taskPriorP = document.createElement('p');
        taskPriorP.textContent = taskService.getPriority(task);

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

        const taskDueInDiv = document.createElement('div');
        const taskDueInP = document.createElement('p');
        if ((new Date()).getTime() > task.dueDate) {
            taskDueInP.textContent = taskService.getDueDate(task).toDateString();
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

        const tasksList = document.createElement('div');
        tasksList.classList.add("tasks-grid-container");

        const checkCol = document.createElement('div');
        checkCol.textContent = "Status";
        checkCol.classList.add("task-list-heading");

        const titleCol = document.createElement('div');
        titleCol.textContent = "Task";
        titleCol.classList.add("task-list-heading");

        const priorCol = document.createElement('div');
        priorCol.textContent = "Priority";
        priorCol.classList.add("task-list-heading");

        const dueInCol = document.createElement('div');
        dueInCol.textContent = "Due In";
        dueInCol.classList.add("task-list-heading");

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

        const createTaskBtnDiv = document.createElement('div');
        createTaskBtnDiv.classList.add('task-list-row');
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

        const createTaskDiv = document.createElement('div');
        createTaskDiv.classList.add('task-list-row');
        const createTaskP = document.createElement('p');
        createTaskP.textContent = 'Add task';
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