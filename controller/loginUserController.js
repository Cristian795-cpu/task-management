const buttonLogin = document.querySelector(".btn");

buttonLogin.addEventListener("click", (e)=> {
    e.preventDefault();

    const inputGmail = document.getElementById("floatingInput").value;
    const inputpassword = document.getElementById("floatingPassword").value;

    try{
        const usersArray = JSON.parse(localStorage.getItem("users")) || [];

        // Buscar el objeto de usuario tal como está guardado (incluye listFile)
        const userData = usersArray.find(u => u.email === inputGmail && u.password === inputpassword);

        if (userData) {
            // Guardar el usuario completo en login-User antes de redirigir
            localStorage.setItem("login-User", JSON.stringify(userData));
            window.location.replace("taskList.html");
        } else {
            alert("Usuario o contraseña incorrectos");
        }

    } catch(error) {
        console.error('Error al procesar los datos de usuarios', error);
        alert("Error al procesar los datos de usuarios");
    }
});