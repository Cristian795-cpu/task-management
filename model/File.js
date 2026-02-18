import { Task } from "./Task.js";

export class File {
    constructor(nameFile) {
        this.nameFile = nameFile;
        this.tasks = [];
    }

    setName(name) {
        this.nameFile = name;
    }

    getName() {
        return this.nameFile;
    }

    addTask(task) {
        this.tasks.push(task);
    }

    getTasks() {
        return this.tasks;
    }
}