class Task {
    constructor(title, desc, priority, dueDate) {
        this.id = Date.now();
        this.title = title;
        this.desc = desc;
        this.priority = priority;
        this.dueDate = dueDate;
        this.completed = false;
    }
}

export default Task;