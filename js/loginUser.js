import { User } from "./User.js";

const buttonLogin = document.querySelector(".btn");

buttonLogin.addEventListener("click", (e)=> {
    e.preventDefault();
    
    const inputGmail = document.getElementById("floatingInput").value;
    const inputpassword = document.getElementById("floatingPassword").value;

    

    
    try{
       const array = JSON.parse(localStorage.getItem("users"));

        const users = array.map(data=> {
            const user = new User(data.name, data.email, data.password);

            return user;
        });  

        let userFound = users.find(user => user.getEmail === inputGmail && user.getPassword === inputpassword);

        if(userFound) {
            window.location.replace("../html/taskList.html")
        }else {
            alert("Usuario o contraseña incorrectos");
        }

    }catch(error) {
        alert("Error al procesar los datos de usuarios", error);
    }
    
});