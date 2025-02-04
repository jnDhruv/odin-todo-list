class Project {
    constructor(title) {
        this.id = Date.now();
        this.title = title;
        this.tasksArr = [];
    }
}

export default Project;