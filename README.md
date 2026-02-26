# Task Management (Aplicación de Tareas)

Aplicación web simple para gestionar usuarios y listas de tareas, construida con JavaScript y archivos estáticos.

## Descripción

Proyecto con arquitectura MVC ligera que permite registrar usuarios, iniciar sesión y administrar tareas. Ideal como proyecto de aprendizaje o plantilla para pequeñas aplicaciones front-end.

## Herramientas Usadas

- **HTML / CSS / JavaScript (ES6)**: Estructura y lógica del frontend.
- **LocalStorage API**: Persistencia local de usuarios y tareas en el navegador.

## Base de datos local (localStorage)

La aplicación usa el `localStorage` del navegador como almacenamiento local para usuarios, sesión y tareas.

- **Dónde está la lógica**: en `model/localStorageLogin-user.js` y los modelos en `model/` (`User.js`, `Task.js`).
- **Estructura típica**:
  - `users` — arreglo JSON con objetos de usuario registrados.
  - `tasks_<userId>` — arreglo JSON con las tareas de cada usuario (o una única clave `tasks` que contiene tareas por usuario), dependiendo de la implementación.
  - `currentUser` — objeto o id del usuario actualmente logueado (sesión local).

- Registro de usuarios
- Inicio de sesión
- Creación, listado y gestión de tareas (Task list)
- Persistencia local (localStorage / archivo local en `model/`)

## Estructura del proyecto

- `controller/` — controladores que gestionan la lógica de registro, login y tareas
  - `loginUserController.js`
  - `registerController.js`
  - `taskEventController.js`
  - `taskListController.js`
- `model/` — modelos y utilidades de almacenamiento
  - `File.js`
  - `localStorageLogin-user.js`
  - `Task.js`
  - `User.js`
- `view/` — archivos estáticos de la interfaz
  - `static/login.html`
  - `static/register.html`
  - `static/taskList.html`
  - `styles/` — hojas de estilo (ej. `taskList.css`, `register.css`)
  - `images/`

## Requisitos

- Navegador moderno Chrome, Edge, Firefox (Solo para ordenadores).
- No requiere servidor para uso básico; se puede abrir `view/static/*.html` directamente. Para evitar restricciones de CORS al cargar módulos locales, es recomendable servir con un servidor HTTP simple.

## Uso

1. Abrir el archivo `view/static/register.html` para crear un usuario.
2. Abrir `view/static/login.html` para iniciar sesión.
3. Tras el login, `view/static/taskList.html` muestra y permite gestionar las tareas.

### Nota sobre persistencia

Los datos creados en la app (usuarios y tareas) se almacenan en `localStorage`. Si quieres reiniciar los datos, borra las claves relacionadas desde DevTools o ejecuta `localStorage.clear()` en la consola del navegador.

## Desarrollo

- Los controladores están en `controller/` y pueden editarse para cambiar la lógica del frontend.
- Los modelos y la persistencia están en `model/`.
- Estilos y vistas en `view/`.