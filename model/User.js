import { File } from "./File.js";

export class User {
    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.listFile = [];
    }

    set setName(name) {
        this.name = name;
    }

    get getName() {
        return this.name;
    }

    set setEmail(email) {
        this.email = email;
    }

    get getEmail() {
        return this.email;
    }

    set setPassword(password) {
        this.password = password;
    }

    get getPassword() {
        return this.password;
    }

    set setListFile(listFile) {
        this.listFile = listFile;
    }

    get getListFile() {
        return this.listFile;
    }
}