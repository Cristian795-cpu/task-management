import { User } from "../model/User.js";
import { File } from "../model/File.js";
import { getUserLocalStorage, createUserObject, saveLocalStoreOfRegisteredUser } from "../model/localStorageLogin-user.js";

const btnNewNotebook = document.getElementById("button-addon2");
const textWelcome = document.getElementById("welcome-user");



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

function main (){
    //Agrega el texto al h1
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
document.querySelector(".container-files").addEventListener("click", (e) => {
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
        
    }
});