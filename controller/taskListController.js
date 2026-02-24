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
const contenido = document.querySelector(".content-cards-notes");
let contador = 1;
fileBox.forEach(color => {
    color.addEventListener('click', () => {
        //Obtener el texto del título del cuaderno seleccionado
        const text = color.querySelector('.notebook-title').textContent.trim();
        const jsonParse = getUserLocalStorage('login-User');
        const listFile = createLocalStorageFile(jsonParse); //aquí ya es una lista de archivos
        const texto = listFile.find(archivo=> text === archivo.nameFile);

        // Marcar en el JSON cuál es el archivo activo y guardarlo inmediatamente
        if (jsonParse && Array.isArray(jsonParse.listFile)) {
            const clickedName = (text || '').toString().trim().toLowerCase();
            jsonParse.listFile.forEach(f => {
                const fileName = (f.nameFile || '').toString().trim().toLowerCase();
                f._isActive = (fileName === clickedName);
            });
            saveLocalStoreOfRegisteredUser(jsonParse, 'login-User');
        }

        // Limpiar siempre el contenedor de tareas
        while (contenido.firstChild) {
            contenido.removeChild(contenido.firstChild);
        }
        contador = 1; // reiniciar contador al cargar un cuaderno

        // Obtener usuario desde localStorage y validar estructura
        const jsonUser = getUserLocalStorage("login-User");
        if (!jsonUser || !Array.isArray(jsonUser.listFile)) {
            // No hay datos que mostrar
            return;
        }

        // Reconstruir objetos File (y sus Task) desde JSON
        const files = createLocalStorageFile(jsonUser);

        // Buscar el archivo activo (_isActive === true)
        const activeFile = files.find(f => (typeof f.getIsActive === 'function' ? f.getIsActive() === true : f._isActive === true));

        // Obtener tareas del archivo activo de forma segura
        let tasksToRender = [];
        if (activeFile && typeof activeFile.getTasks === 'function') {
            const rawTasks = activeFile.getTasks() || [];
            rawTasks.forEach(t => {
                if (!t) return;
                // Si ya es instancia de Task con getters
                if (typeof t.getTitleNote === 'function' && typeof t.getTextNote === 'function') {
                    tasksToRender.push(t);
                } else {
                    // Si es un objeto plano desde JSON, crear instancia Task
                    tasksToRender.push(new Task(t.titleNote || t.getTitleNote || '', t.textNote || t.getTextNote || ''));
                }
            });
        }

        // Construir la lista de tareas en la interfaz (solo del archivo activo)
        tasksToRender.forEach(item => {
            const nuevoDiv = document.createElement('div');
            nuevoDiv.id = "card-" + (contenido.children.length + contador);
            nuevoDiv.className = "card card-note";
            nuevoDiv.style.width = "18rem";
            nuevoDiv.innerHTML += ` <i class="bi bi-bookmark"></i>
                                    <div class="card-body">
                                        <h5 class="card-title">${item.getTitleNote}</h5>
                                        <p class="card-text">${item.getTextNote}</p>
                                        <a href="#" class="btn btn-primary">Go somewhere</a>
                                    </div>`
            contenido.appendChild(nuevoDiv);
            contador++;
        });

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

            //Obtener los valores de los inputs
            const inputnName = document.getElementById("exampleFormControlInput1").value;
            const inputDescription = document.getElementById("exampleFormControlTextarea1").value;

            //Crear una nueva tarea con los valores obtenidos
            const tarea = new Task(inputnName, inputDescription);

            //Agregar la tarea al archivo activo en el localStorage (usar jsonParse para mantener sincronía)
            if (jsonParse && Array.isArray(jsonParse.listFile)) {
                const clickedName = (text || '').toString().trim().toLowerCase();
                const fileObj = jsonParse.listFile.find(f => (f.nameFile || '').toString().trim().toLowerCase() === clickedName);
                if (fileObj) {
                    fileObj.tasks = fileObj.tasks || [];
                    fileObj.tasks.push({ titleNote: inputnName, textNote: inputDescription });
                }
                // Asegurar que solo ese archivo esté marcado como activo
                jsonParse.listFile.forEach(f => {
                    f._isActive = ((f.nameFile || '').toString().trim().toLowerCase() === clickedName);
                });
                // Guardar en localStorage
                saveLocalStoreOfRegisteredUser(jsonParse, 'login-User');
                // Sincronizar el objeto `usuario` en memoria con los cambios guardados
                if (typeof usuario !== 'undefined' && usuario) {
                    usuario.setListFile = createLocalStorageFile(jsonParse);
                }
            }
            
            console.log(listFile)

            //Cerrar el modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
            if (modal) modal.hide();

            //Agregar la tarea a la interfaz
            //const contenido = document.querySelector(".content-cards-notes");
            const carta = document.getElementById("card-" + (contenido.children.length + contador));
            //document.querySelector(".card-title").textContent = inputnName;
            //document.querySelector(".card-text").textContent = inputDescription;

            //Condicional para validar los campos
            if(contenido.children.length === 0 && (inputnName === "" || inputDescription === "")) {
                alert("¡Por favor, completa ambos campos para crear una tarea!");
                return;
            }

            else if(contenido.children.length >= 8) {
                // Ocultar el ícono de la última card si existe
                if(contenido.children.length > 0) {
                    const ultimaCard = contenido.lastElementChild;
                    //const iconoUltimo = ultimaCard.querySelector('.bi-plus-square-dotted');
                    if(iconoUltimo) {
                        iconoUltimo.style.visibility = 'hidden';
                    }
                }
                alert("¡Has alcanzado el límite de tareas para este cuaderno!");
                return;
            } else {

                // Crear una nueva card para la tarea
                const nuevoDiv = document.createElement('div');
                nuevoDiv.id = "card-" + (contenido.children.length + contador);
                nuevoDiv.className = "card card-note";
                nuevoDiv.style.width = "18rem";
                
                // Agregar el contenido a la nueva card
                nuevoDiv.innerHTML += ` <i class="bi bi-bookmark"></i>
                                        <div class="card-body">
                                            <h5 class="card-title">${inputnName}</h5>
                                            <p class="card-text">${inputDescription}</p>
                                            <a href="#" class="btn btn-primary">Go somewhere</a>
                                        </div>`

                // Agregar la nueva card al contenedor
                contenido.appendChild(nuevoDiv);
                contador++; // Incrementar el contador para el próximo ID

                // Obtener el número total de cards
                const totalCards = contenido.children.length;

                // Mostrar la última card si se alcanza el límite de 8
                if(totalCards === 8) {
                    const ultimaCard = contenido.lastElementChild;
                    const iconoUltimo = ultimaCard.querySelector('.bi-plus-square-dotted');
                    if(iconoUltimo) {
                        ultimaCard.style.visibility = 'visible';
                    }
                }
                
                // Mostrar la penúltima card si se elimina una tarea y hay más de 1 card
                if(contenido.children.length > 1) {
                    const cardAnterior = contenido.children[contenido.children.length - 2];
                    if(cardAnterior) {
                        if(contenido.children.length <= 8) {
                            cardAnterior.style.visibility = 'visible';
                        }
                    }
                } 
                //Actualizar el localStorage con la nueva tarea 
                usuario.setListFile = listFile;
                localStorage.setItem("login-User", JSON.stringify(usuario));
                console.log("encontrado: ", usuario); 
            } 
        });

        

    });
});