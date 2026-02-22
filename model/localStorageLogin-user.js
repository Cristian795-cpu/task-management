import { User } from "./User.js";
import { File } from "./File.js";
import { Task } from "./Task.js";

//Obtiene el Objeto y lo devuelve en formato JSON
export function getUserLocalStorage(localAddress) {
    return JSON.parse(localStorage.getItem(localAddress));
}

//Crea un objeto File del getUserLocalStorage()
export function createLocalStorageFile(localStorageValue) {
    return localStorageValue.listFile.map(item => {
        const isFile = new File(item.nameFile);
            isFile.tasks.map(p => {
            const tarea = new Task(p.titleNote, p.textNote);
            isFile.addTask(tarea);
            });
            return isFile;
        }
        
        
    );
}

//Crea un objeto Task del getUserLocalStorage()
export function createLocalStorageTask(objetFile) {
    return objetFile[0].getTasks().map(item =>
        new Task(item.titleNote, item.textNote)
    );
}

//Crea un objeto User del getUserLocalStorage()
export function createUserObject(localStorageValue) {
    const user = new User(localStorageValue.name, localStorageValue.email, localStorageValue.password);
    const file = createLocalStorageFile(localStorageValue);
    user.setListFile = file;
    return user;
}

//Guarda el objeto User en el LocalStorage
export function saveLocalStoreOfRegisteredUser(localStorageValue) {
    localStorage.setItem("login-User", JSON.stringify(localStorageValue));
}

//Construye la lista de tareas a partir del getUserLocalStorage()
export function buildTaskList(value) {
    return value.getTasks().map(item =>
        new Task(item.getTextNote, item.getTitleNote)
    );
}