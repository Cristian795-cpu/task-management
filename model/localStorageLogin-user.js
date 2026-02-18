import { User } from "./User.js";
import { File } from "./File.js";

//Obtiene el Objeto y lo devuelve en formato JSON
export function getUserLocalStorage(localAddress) {
    return JSON.parse(localStorage.getItem(localAddress));
}

//Crea un objeto File del getUserLocalStorage()
export function createLocalStorageFile(localStorageValue) {
    return localStorageValue.listFile.map(item =>
        new File(item.nameFile)
    );
}

//Crea un objeto User del getUserLocalStorage()
export function createUserObject(localStorageValue) {
    const user = new User(localStorageValue.name, localStorageValue.email, localStorageValue.password);
    const file = createLocalStorageFile(localStorageValue);
    user.setListFile = file;
    return user;
}

export function saveLocalStoreOfRegisteredUser(localStorageValue) {
    localStorage.setItem("login-User", JSON.stringify(localStorageValue));
}

