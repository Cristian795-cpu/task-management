import { User } from "../model/User.js";
import { File } from "../model/File.js";
import { Task } from "../model/Task.js";
import { getUserLocalStorage, createUserObject, createLocalStorageFile, saveLocalStoreOfRegisteredUser, buildTaskList, createLocalStorageTask} from "../model/localStorageLogin-user.js";


function buildFileMap(userJson) {
    return userJson.listFile.map(searchNewBook => {
        let fileBook = new File(searchNewBook.nameFile);
        return fileBook;
    });
}

function createFileList(userJson, inputNotebook) {
    //Objeto para manejar para instanciar las propiedades del Json 
    let userLogin = new User(userJson.name, userJson.email, userJson.password);
    
    //Crea un nuevo array de Files para tener acceso a los metodos de la clase
    const noteBookMap = buildFileMap(userJson);

    let addBook = new File(inputNotebook);
    noteBookMap.push(addBook);

    userLogin.setListFile = noteBookMap;

    return userLogin;
}

function createListOfFilesToFillIn(userJson) {
    //Objeto para manejar para instanciar las propiedades del Json 
    let userLogin = new User(userJson.name, userJson.email, userJson.password);
    
    //Crea un nuevo array de Files para tener acceso a los metodos de la clase
    const noteBookMap = buildFileMap(userJson);

    const file = document.querySelector(".container-files");

    for(let i = 0; i < noteBookMap.length; i++) {
        let fileAux = noteBookMap[i];
        
        file.innerHTML += `
                            <div class="file">
                                <i class="bi bi-journals"></i>
                                <p class="notebook-title">
                                    ${noteBookMap[i].nameFile}
                                </p>
                                <div class="container-delete">
                                    <i class="bi bi-trash-fill"></i>
                                </div>
                                    
                            </div>
                            `
    }
}

//Funcion para la presentacion del Usuario
function main (){
    const textWelcome = document.getElementById("welcome-user");
    textWelcome.textContent = `¡Hi, ${getUserLocalStorage("login-User").name}!`;

    createListOfFilesToFillIn(getUserLocalStorage("login-User"));
}

main()

function saveUserFiles(inputNotebook) {
    //Transforma el string a objeto Json para acceder a las propiedades
    const userJson = getUserLocalStorage("login-User");
    let userLogin = createFileList(userJson, inputNotebook);
    saveLocalStoreOfRegisteredUser(userLogin, "login-User");

    console.log("{nombre: " + userLogin.getName + 
                ", email: " + userLogin.getEmail + 
                ", password: " + userLogin.getPassword + 
                ", notebook: ", userLogin.getListFile);
}


//Evento para crear archivos
const btnNewNotebook = document.getElementById("button-addon2");
btnNewNotebook.addEventListener("click", ()=> {
    const inputNotebook = document.querySelector(".form-control").value;

    if(inputNotebook !== "") {
        const file = document.querySelector(".container-files");
        file.innerHTML += `
                        <div class="file">
                            <i class="bi bi-journals"></i>
                            <p class="notebook-title">${inputNotebook}</p>
                            <div class="container-delete">
                                <i class="bi bi-trash-fill"></i>
                            </div>
                            
                        </div>
                        `
    }
    saveUserFiles(inputNotebook); 
});

//Evento para eliminar archivos
const contenedor = document.querySelector(".container-files");
contenedor.addEventListener("click", (e) => {
    if (e.target.classList.contains('bi-trash-fill')) {
        // 1. Eliminar del DOM
        const fileDiv = e.target.closest('.file');
        const tituloEliminar = fileDiv.querySelector('.notebook-title').textContent.trim();
        fileDiv.remove();
    
        // 2. Obtener datos del localStorage
        const userJson = getUserLocalStorage("login-User");
        const fi = createUserObject(userJson);

        console.log("Titulo a Eliminar" + tituloEliminar + "");
        console.log("xd:"+ fi.getListFile[0].getName());

        if (userJson?.listFile) {
            // 3. Filtrar el elemento a eliminar (comparar con nameFile)
            userJson.listFile = userJson.listFile.filter(item => 
                item.nameFile !== tituloEliminar
            );

            // 4. Guardar en localStorage
            saveLocalStoreOfRegisteredUser(userJson,);
            
            console.log("✅ Eliminado:", tituloEliminar);
            console.log("📚 Lista actualizada:", userJson.listFile);
        }

        //lista auxiliar de file
        const listFileAux = fi.getListFile.map(item => {
                                return new File(item.nameFile);
                            });
        console.log('miralo: ', listFileAux);
    }
});

//Evento para seleccionar un Archivo y cambiar de color
const fileBox = document.querySelectorAll('.file');
fileBox.forEach(color => {
    color.addEventListener('click', () => {
        const text = color.querySelector('.notebook-title').textContent.trim();
        const jsonParse = getUserLocalStorage('login-User');
        const listFile = createLocalStorageFile(jsonParse); //aquí ya es una lista de archivos
        const texto = listFile.find(archivo=> text === archivo.nameFile);

        fileBox.forEach(variable => {
            variable.style.backgroundColor = "";
        });
         
        if(texto){
            console.log("encontrado: ", texto);
            texto.setIsActive(true);
            color.style.backgroundColor = "#ffffff";
        }
        
        const usuario = createUserObject(jsonParse);

        //Evento para crear una Tarea
        const conten = document.querySelector(".create-task");
        conten.addEventListener("click", ()=> {
            const inputnName = document.getElementById("exampleFormControlInput1").value;
            const inputDescription = document.getElementById("exampleFormControlTextarea1").value;

            const tarea = new Task(inputnName, inputDescription);

            listFile.forEach(buscar => {
                if(buscar.getIsActive() === true){
                    buscar.addTask(tarea); 
                }
            });
            
            console.log(listFile)
            const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
            if (modal) modal.hide();

            const contenido = document.querySelector(".content-cards-notes");
            const carta = document.querySelector(".card-note");
            const icono = document.querySelector(".bi-plus-square-dotted");
            document.querySelector(".card-title").textContent = inputnName;
            document.querySelector(".card-text").textContent = inputDescription;
            carta.style.visibility = "visible";
            icono.style.visibility = "hidden";

            
            contenido.innerHTML += `<div class="card card-note" style="width: 18rem;">
                                        <i class="bi bi-bookmark"></i>
                                        <div class="card-body">
                                            <h5 class="card-title">${inputnName}</h5>
                                            <p class="card-text">${inputDescription}</p>
                                            <a href="#" class="btn btn-primary">Go somewhere</a>
                                        </div>
                                        <i class="bi bi-plus-square-dotted" data-bs-toggle="modal" data-bs-target="#exampleModal"></i>
                                    </div>`
            
        });

        usuario.setListFile = listFile;
        localStorage.setItem("login-User", JSON.stringify(usuario)); //Colocar esto al final de todo el codigo...
        console.log("encontrado: ", usuario);//Y esto tambien

    });
});

/*
//Evento para crear una Tarea
const conten = document.querySelector(".create-task");
conten.addEventListener("click", ()=> {
    const inputnName = document.getElementById("exampleFormControlInput1").value;
    const inputDescription = document.getElementById("exampleFormControlTextarea1").value;

    const valor = getUserLocalStorage("login-User");
    const user = createUserObject(valor); //devuelve un Usuario
    const objetFile =   user.getListFile.map(item => {
                            const isFile = new File(item.nameFile);
                            isFile.setIsActive = item._isActive;

                                isFile.tasks.map(p => {
                                    const tarea = new Task(p.titleNote, p.textNote);  
                                    isFile.addTask(tarea);
                                });
                                return isFile;
                            }
                        );
    //const objetTask = createLocalStorageTask(objetFile);//devuelve un array de Tareas
    let tarea = new Task(inputnName, inputDescription);
    const archivos = user.getListFile.map(item => {
        return new File(item.getName())
    });

    console.log(archivos);
});
*/