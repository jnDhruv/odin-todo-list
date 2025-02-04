class Project {
    constructor(title) {
        this.id = Date.now();
        this.title = title;
        this.tasksArr = [];
    }

    addTask(task) {
        this.tasksArr.push(task);
    }

    removeTask(taskID) {
        this.tasksArr = this.tasksArr.filter((task) => task.id !== taskID);
    }
}