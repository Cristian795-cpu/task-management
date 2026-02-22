import { Task } from "./Task.js";

export class File {
    constructor(nameFile) {
        this.nameFile = nameFile;
        this.tasks = [];
        this._isActive = false;
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
    setIsActive(value) {
        this._isActive = value;
    }

    getIsActive() {
        return this._isActive;
    }
}