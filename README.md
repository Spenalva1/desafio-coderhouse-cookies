# desafio-coderhouse-cookies

## Aclaraciones primer entregable de cookies

- Las rutas '/' y  '/productos/vista' están "protegidas" y solo se podrán acceder si hay un usuario logueado. 
- En la ruta '/login' se podrá loguear un usuario para poder ingresar a las rutas mencionadas. Una vez logueado se guardarán dos cookies para mantener al usuario logeado.
- la cookie tendrá una vida de 1 minuto y se reinicializará el minuto cada vez que se ingrese a alguna de las rutas.
- Si se intenta ingresar a una ruta con la cookie ya expirada, se redirigirá al usuario a la página de login.
- El usuario podrá desloguearse con el botón que aparece al principio de laa vistas.
- En el caso de '/productos/vista' habrá un middleware encargado de verificar si el usuario está logueado y redirigirlo al login en caso de que no.
- En el caso de '/' se verificará al usuario logueado mediante js debido a que el html al que se accede se encuentra en la carpeta public.
