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
                const tarea = new Task(p.titleNote, p.textNote, p.bookmarked === true);
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
    return (tasks || []).map(item => new Task(item.titleNote, item.textNote, item.bookmarked === true));
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
    // Antes de guardar, serializamos el usuario para evitar perder datos cuando se pasen
    // instancias de `File` o `Task`. Esto garantiza que la estructura en `users`
    // sea siempre un objeto JSON serializable.
    function serializeUser(u) {
        if (!u) return u;
        const out = {
            name: u.name || u.getName || undefined,
            email: u.email || u.getEmail || undefined,
            password: u.password || u.getPassword || undefined,
            listFile: []
        };

        const files = u.listFile || (u.getListFile ? u.getListFile() : []);
        out.listFile = (files || []).map(f => {
            // f may be a plain object or a File instance
            const nameFile = f.nameFile || (f.getName ? f.getName() : undefined);
            const isActive = typeof f._isActive !== 'undefined' ? f._isActive : (f.getIsActive ? f.getIsActive() : false);
            const tasksRaw = f.tasks || (f.getTasks ? f.getTasks() : []);
            const tasks = (tasksRaw || []).map(t => {
                return {
                    titleNote: t.titleNote || (t.getTitleNote ? t.getTitleNote() : undefined),
                    textNote: t.textNote || (t.getTextNote ? t.getTextNote() : undefined),
                    bookmarked: !!(t.bookmarked || (t.isBookmarked ? t.isBookmarked() : false))
                };
            });

            return {
                nameFile: nameFile,
                tasks: tasks,
                _isActive: !!isActive
            };
        });

        return out;
    }

    const serializable = serializeUser(localStorageValue);
    try {
        localStorage.setItem(key, JSON.stringify(serializable));
    } catch (err) {
        console.error('Error guardando en localStorage:', err);
        return;
    }

    // Si actualizamos el usuario en sesión, sincronizamos también la lista de usuarios registrados
    if (key === "login-User") {
        try {
            const users = JSON.parse(localStorage.getItem("users")) || [];
            const userEmail = serializable && serializable.email;
            if (userEmail) {
                const idx = users.findIndex(u => u.email === userEmail);
                if (idx !== -1) {
                    users[idx] = serializable;
                } else {
                    users.push(serializable);
                }
                localStorage.setItem("users", JSON.stringify(users));
            }
        } catch (err) {
            console.error('Error sincronizando users en localStorage:', err);
        }
    }
}

//Construye la lista de tareas a partir del getUserLocalStorage()
export function buildTaskList(value) {
    if (!value || !value.getTasks) return [];
    return value.getTasks().map(item => new Task(item.titleNote, item.textNote, item.bookmarked === true));
}