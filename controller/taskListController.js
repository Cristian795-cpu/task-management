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
    // Obtener el objeto actual del usuario en sesión
    const userJson = getUserLocalStorage("login-User") || {};
    // Asegurar que listFile existe y es un array
    if (!Array.isArray(userJson.listFile)) userJson.listFile = [];

    // Añadir nuevo cuaderno como objeto plano (preserva estructura serializable)
    userJson.listFile.push({
        nameFile: inputNotebook,
        tasks: [],
        _isActive: false
    });

    // Guardar directamente el objeto actualizado (no recrear instancias que pierdan tareas)
    saveLocalStoreOfRegisteredUser(userJson, "login-User");

    console.log("Añadido notebook:", inputNotebook, "->", userJson.listFile);
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

            // Vaciar el contenedor de tarjetas si el cuaderno eliminado estaba abierto
            const cardsContainer = document.querySelector('.content-cards-notes');
            if (cardsContainer) {
                while (cardsContainer.firstChild) {
                    cardsContainer.removeChild(cardsContainer.firstChild);
                }
            }
            // Reset de estado local
            contador = 1;
            currentFile = null;
        }

        //lista auxiliar de file
        const listFileAux = fi.getListFile.map(item => {
                                return new File(item.nameFile);
                            });
        console.log('miralo: ', listFileAux);
    }
});

// Variables GLOBALES (declaradas fuera de todos los eventos)
let currentFile = null; // Archivo actualmente seleccionado
let currentUserData = null; // Datos del usuario actual
let contador = 1;

// Contenedores
const contenido = document.querySelector(".content-cards-notes");
const contenedorFiles = document.querySelector('.container-files');

// Delegación de eventos para seleccionar un Archivo (funciona para elementos dinámicos)
contenedorFiles.addEventListener('click', (e) => {
    // Evitar interferir con el manejador de eliminar (icono basura)
    if (e.target.classList.contains('bi-trash-fill')) return;

    const fileDiv = e.target.closest('.file');
    if (!fileDiv) return; // No se hizo click en un .file

    // Obtener el texto del título del cuaderno seleccionado
    const text = fileDiv.querySelector('.notebook-title').textContent.trim();
    const jsonParse = getUserLocalStorage('login-User');

    // Guardar en variable global
    currentUserData = jsonParse;

    const listFile = createLocalStorageFile(jsonParse);
    const archivoSeleccionado = listFile.find(archivo => text === archivo.nameFile);

    // Guardar archivo actual en variable global
    currentFile = archivoSeleccionado;

    // Marcar en el JSON cuál es el archivo activo
    if (jsonParse && Array.isArray(jsonParse.listFile)) {
        jsonParse.listFile.forEach(f => {
            f._isActive = (f.nameFile === text);
        });
        saveLocalStoreOfRegisteredUser(jsonParse);
    }

    // Limpiar contenedor
    while (contenido.firstChild) {
        contenido.removeChild(contenido.firstChild);
    }
    contador = 1;

    // Cargar tareas del archivo activo
    if (archivoSeleccionado) {
        const tareas = archivoSeleccionado.getTasks() || [];

        tareas.forEach(tarea => {
            const nuevoDiv = document.createElement('div');
            nuevoDiv.id = "card-" + contador;
            nuevoDiv.className = "card card-note";
            nuevoDiv.style.width = "18rem";

            // Obtener título y descripción correctamente
            const titulo = typeof tarea.getTitleNote === 'function' ? 
                tarea.getTitleNote() : tarea.titleNote;
            const descripcion = typeof tarea.getTextNote === 'function' ? 
                tarea.getTextNote() : tarea.textNote;
            const isBookmarked = tarea.bookmarked === true;
            const bookmarkClass = isBookmarked ? 'bi-bookmark-fill' : 'bi-bookmark';

            nuevoDiv.innerHTML = ` 
                <i class="bi ${bookmarkClass}" data-title="${titulo}" data-desc="${descripcion}"></i>
                <div class="card-body">
                    <h5 class="card-title">${titulo}</h5>
                    <p class="card-text">${descripcion}</p>
                </div>
            `;
            
            // Agregar evento al bookmark y actualizar el estado en localStorage
            const bookmark = nuevoDiv.querySelector('.bi');
            if (bookmark) {
                bookmark.addEventListener('click', () => {
                    const currentlyBookmarked = bookmark.classList.contains('bi-bookmark-fill');
                    if (currentlyBookmarked) {
                        bookmark.classList.remove('bi-bookmark-fill');
                        bookmark.classList.add('bi-bookmark');
                    } else {
                        bookmark.classList.remove('bi-bookmark');
                        bookmark.classList.add('bi-bookmark-fill');
                    }

                    // Actualizar en currentUserData y guardar
                    const fileName = text; // nombre del cuaderno seleccionado
                    if (currentUserData && Array.isArray(currentUserData.listFile)) {
                        const fileJson = currentUserData.listFile.find(f => f.nameFile === fileName);
                        if (fileJson && Array.isArray(fileJson.tasks)) {
                            const taskObj = fileJson.tasks.find(t => t.titleNote === titulo && t.textNote === descripcion);
                            if (taskObj) {
                                taskObj.bookmarked = !currentlyBookmarked;
                                saveLocalStoreOfRegisteredUser(currentUserData);
                            }
                        }
                    }
                });
            }

            contenido.appendChild(nuevoDiv);
            contador++;
        });
    }

    // Cambiar color del notebook seleccionado (compatible con elementos creados dinámicamente)
    document.querySelectorAll('.file').forEach(v => v.style.backgroundColor = "");
    fileDiv.style.backgroundColor = "#ffffff";
});

// Evento para crear una Tarea
const btnTask = document.querySelector(".create-task");
btnTask.addEventListener("click", () => {
    // Validar que hay un notebook seleccionado
    if (!currentFile) {
        alert("Por favor, selecciona un cuaderno primero");
        return;
    }

    // Obtener valores de los inputs
    const inputName = document.getElementById("exampleFormControlInput1").value;
    const inputDescription = document.getElementById("exampleFormControlTextarea1").value;

    // Validar campos vacíos
    if (inputName === "" || inputDescription === "") {
        alert("¡Por favor, completa ambos campos para crear una tarea!");
        return;
    }

    // Validar límite de tareas (8 por cuaderno)
    if (contenido.children.length >= 8) {
        alert("¡Has alcanzado el límite de tareas para este cuaderno!");
        return;
    }

    // Crear nueva tarea
    const nuevaTarea = new Task(inputName, inputDescription);
    
    // Agregar tarea al archivo actual
    currentFile.addTask(nuevaTarea);

    // Actualizar localStorage
    if (currentUserData && Array.isArray(currentUserData.listFile)) {
        // Buscar el archivo en los datos JSON
        const fileJson = currentUserData.listFile.find(f => f.nameFile === currentFile.nameFile);
        if (fileJson) {
            // Inicializar array de tareas si no existe
            if (!fileJson.tasks) fileJson.tasks = [];

            // Agregar la nueva tarea (incluye bookmarked:false por defecto)
            fileJson.tasks.push({
                titleNote: inputName,
                textNote: inputDescription,
                bookmarked: false
            });

            // Guardar en localStorage
            saveLocalStoreOfRegisteredUser(currentUserData);
        }
    }

    // Crear card en la interfaz
    const nuevoDiv = document.createElement('div');
    nuevoDiv.id = "card-" + contador;
    nuevoDiv.className = "card card-note";
    nuevoDiv.style.width = "18rem";
    nuevoDiv.style.boxShadow = "0 4px 20px rgb(0, 0, 0)";

    nuevoDiv.innerHTML = ` 
        <i class="bi bi-bookmark"></i>
        <div class="card-body">
            <h5 class="card-title">${inputName}</h5>
            <p class="card-text">${inputDescription}</p>
            <a href="#" class="btn btn-primary">Go somewhere</a>
        </div>
    `;
    // Agregar event listener al bookmark de la nueva tarjeta
    const newBookmark = nuevoDiv.querySelector('.bi-bookmark');
    if (newBookmark) {
        newBookmark.addEventListener('click', () => {
            const currentlyBookmarked = newBookmark.classList.contains('bi-bookmark-fill');
            if(currentlyBookmarked) {
                newBookmark.classList.remove('bi-bookmark-fill');
                newBookmark.classList.add('bi-bookmark'); 
            } else{
                newBookmark.classList.remove('bi-bookmark');
                newBookmark.classList.add('bi-bookmark-fill')
            }

            // Actualizar en localStorage la tarea recién creada
            if (currentUserData && Array.isArray(currentUserData.listFile)) {
                const fileJson = currentUserData.listFile.find(f => f.nameFile === currentFile.nameFile);
                if (fileJson && Array.isArray(fileJson.tasks)) {
                    const t = fileJson.tasks.find(task => task.titleNote === inputName && task.textNote === inputDescription);
                    if (t) {
                        t.bookmarked = !currentlyBookmarked;
                        saveLocalStoreOfRegisteredUser(currentUserData);
                    }
                }
            }
        });
    }

    contenido.appendChild(nuevoDiv);
    contador++;

    // Cerrar el modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
    if (modal) modal.hide();

    // Limpiar inputs
    document.getElementById("exampleFormControlInput1").value = "";
    document.getElementById("exampleFormControlTextarea1").value = "";
    
    console.log("Tarea creada:", nuevaTarea);
    console.log("Archivo actual:", currentFile);
});

// Listener para el botón de logout: elimina la sesión y redirige al login
const btnLogout = document.getElementById('btn-log-out');
if (btnLogout) {
    btnLogout.addEventListener('click', (e) => {
        // Previene comportamiento por defecto de cualquier data-bs
        e.preventDefault();
        // Eliminar usuario en sesión
        localStorage.removeItem('login-User');
        // Redirigir a la página de login
        window.location.href = 'login.html';
    });
}