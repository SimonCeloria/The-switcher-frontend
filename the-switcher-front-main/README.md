# Front-end repo para EL SWITCHER
Proyecto para la materia de Igeniería del Software I de la carrera Lic. en Ciencias de la Computación de FAMAF

**Integrantes:**

* Tomás Montes
* Joaquín Sosa
* Renzo Condormango
* Francisco Porcel de Peralta
* Simón Celoria
* Luciano Tula

### ¿Que se necesita para correr el proyecto?

El front de este proyecto estará hecho con React, Vite, TailwindCSS, React-Router y Axios.

Para levantar el front necesitamos NodeJS, correr el siguiente comando para instalar node (Ubuntu):

```
Primero, conéctate al servidor usando ssh, ingresando lo siguiente:

ssh nombredeusuario@server_ip_address
```
Luego ejecutamos los siguientes comandos:

```
sudo apt update

sudo apt-get install nodejs

sudo apt install npm
```

Chequeamos versiones:
```
nodejs -v

npm -v
```

Una vez instalado todo corremos el siguiente comando dentro de la carpeta "switcher-front"

```
npm install
```
Ahora para correr el front:

(si lo queremos correr en modo local)
```
npm run dev:devlocal 
```

(si lo queremos correr en modo lan)
```
npm run dev:dev 
```
En caso de error con tailwindCSS:

```
npm install -D tailwindcss postcss autoprefixer
```

