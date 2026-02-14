import { User } from "./User.js";

const buttonRegister = document.querySelector(".btn");
const isCheck = document.getElementById("checkDefault");

buttonRegister.addEventListener("click", () => {
    const inputName = document.getElementById("floatingName").value;
    const inputgmail = document.getElementById("floatingInput").value;
    const inputPassword = document.getElementById("floatingPassword").value;

    const newUser = new User();

    if(inputName == "" && inputgmail == "" && inputPassword == ""){
        alert("Tiene que llenar los 3 campos");
    }
    
    else if (inputName == "" || inputgmail == "" || inputPassword == "") {
        alert("Falta llenar campo(s)");
    }

    else{
        newUser.setName = inputName;
        newUser.setEmail = inputgmail;
        newUser.setPassword = inputPassword;

        const userList = JSON.parse(localStorage.getItem("users")) || [];
        userList.push(newUser);
        const arrayToString = JSON.stringify(userList);
        localStorage.setItem("users", arrayToString);
    }
});


isCheck.addEventListener("click", ()=> {
    const inputName = document.getElementById("floatingName").value;
    const inputgmail = document.getElementById("floatingInput").value;
    const inputPassword = document.getElementById("floatingPassword").value;
    
    if(isCheck.checked) {
        localStorage.setItem("rememberUser", JSON.stringify({
            name: inputName,
            email: inputgmail,
            password: inputPassword
        }));
    }else {
        if(localStorage.getItem != null) {
            localStorage.removeItem("rememberUser");
        }
    }
});

window.addEventListener("load", ()=> {

    const userLoad = JSON.parse(localStorage.getItem("rememberUser"));

    document.getElementById("floatingName").value = userLoad.name || "";
    document.getElementById("floatingInput").value = userLoad.email || "";
    document.getElementById("floatingPassword").value = userLoad.password || "";
});