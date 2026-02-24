import { User } from "./User.js";
import { File } from "./File.js";
import { Task } from "./Task.js";

//Obtiene el Objeto y lo devuelve en formato JSON
export function getUserLocalStorage(localAddress) {
    return JSON.parse(localStorage.getItem(localAddress));
}

//Crea un objeto File del getUserLocalStorage()
export function createLocalStorageFile(localStorageValue) {
    return (localStorageValue.listFile || []).map(item => {
        const isFile = new File(item.nameFile);
        // Si el item tiene tareas guardadas en localStorage, recrearlas
        if (Array.isArray(item.tasks)) {
            item.tasks.forEach(p => {
                const tarea = new Task(p.titleNote, p.textNote);
                isFile.addTask(tarea);
            });
        }
        // Restaurar estado activo si estaba guardado
        if (typeof item._isActive !== 'undefined') {
            isFile.setIsActive(item._isActive);
        }
        return isFile;
    });
}

//Crea un objeto Task del getUserLocalStorage()
export function createLocalStorageTask(objetFile) {
    if (!Array.isArray(objetFile) || objetFile.length === 0) return [];
    // Preferir el archivo activo si existe, sino el primero
    const activeFile = objetFile.find(f => f.getIsActive && f.getIsActive() === true) || objetFile[0];
    const tasks = activeFile.getTasks ? activeFile.getTasks() : [];
    return (tasks || []).map(item => new Task(item.titleNote, item.textNote));
}

//Crea un objeto User del getUserLocalStorage()
export function createUserObject(localStorageValue) {
    const user = new User(localStorageValue.name, localStorageValue.email, localStorageValue.password);
    const file = createLocalStorageFile(localStorageValue);
    user.setListFile = file;
    return user;
}

//Guarda el objeto User en el LocalStorage
export function saveLocalStoreOfRegisteredUser(localStorageValue, key = "login-User") {
    localStorage.setItem(key, JSON.stringify(localStorageValue));
}

//Construye la lista de tareas a partir del getUserLocalStorage()
export function buildTaskList(value) {
    if (!value || !value.getTasks) return [];
    return value.getTasks().map(item => new Task(item.titleNote, item.textNote));
}