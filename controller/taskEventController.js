import { User } from "../model/User.js";
import { File } from "../model/File.js";
import { Task } from "../model/Task.js";
import { getUserLocalStorage, createUserObject, createLocalStorageFile, saveLocalStoreOfRegisteredUser, buildTaskList, createLocalStorageTask } from "../model/localStorageLogin-user.js";


const icons = document.querySelectorAll(".bi-plus-square-dotted");

const conten = document.querySelector(".create-task");

conten.addEventListener("click", ()=> {
    const inputnName = document.getElementById("exampleFormControlInput1").value;
    const inputDescription = document.getElementById("exampleFormControlTextarea1").value;

    const valor = getUserLocalStorage("login-User");
    const user = createUserObject(valor); //devuelve un Usuario
   // const objetFile = createLocalStorageFile(user); //devuelve una lista de archivos archivo
    //const objetTask = createLocalStorageTask(objetFile);//devuelve un array de Tareas
    let tarea = new Task(inputnName, inputDescription);
    const archivos = user.getListFile.map(item => {
        return new File(item.getName())
    });
    
    console.log(archivos);
});

icons.forEach((icon) => {
    icon.addEventListener("click", () => {

        





        /*
        

        console.log(objetFile);
        */
    });
});