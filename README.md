# AgiliaCenter

# API de Gestión de Usuarios

Esta es una API RESTful desarrollada en Node.js utilizando Express y MongoDB. Permite a los usuarios registrarse, iniciar sesión, obtener su perfil y darse de baja de manera asíncrona.

## Características

- **Registro de usuarios**: Los usuarios pueden registrarse proporcionando un nombre, correo electrónico y contraseña.
- **Inicio de sesión**: Los usuarios pueden iniciar sesión con sus credenciales y recibir un token JWT para autenticar futuras solicitudes.
- **Obtener perfil**: Los usuarios pueden obtener información de su perfil autenticándose con su token.
- **Dar de baja**: Los usuarios pueden enviar una solicitud para darse de baja, eliminando su cuenta del sistema.

## Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución para JavaScript.
- **Express**: Framework para construir aplicaciones web.
- **MongoDB**: Base de datos NoSQL.
- **Mongoose**: Biblioteca ODM para MongoDB.
- **JWT**: JSON Web Tokens para la autenticación.
- **Bcrypt**: Para encriptar contraseñas.
- **Joi**: Para la validación de datos.

## Instalación

Para instalar y ejecutar la aplicación, sigue estos pasos:

1. Clona el repositorio:

   ```bash
   git clone <url-del-repositorio>
   cd <nombre-del-repositorio>
   Instala las dependencias:
   ```

bash
Copy code
npm install
Configura las variables de entorno en un archivo .env:

makefile
Copy code
MONGO_URI=<tu_uri_de_mongodb>
TOKEN_SECRET=<tu_secreto_para_jwt>
Inicia el servidor:

bash
Copy code
npm start
El servidor se ejecutará en http://localhost:3000.

Endpoints
Método Endpoint Descripción
POST /api/users/register Registrar un nuevo usuario
POST /api/users/signin Iniciar sesión y obtener un token JWT
GET /api/users/profile Obtener perfil del usuario autenticado
POST /api/users/unsubscribe Solicitar la baja del usuario

¿Es necesario crear un endpoint de logout?
No es estrictamente necesario crear un endpoint de logout cuando se utiliza JWT, ya que los tokens no se almacenan en el servidor. Sin embargo, se podría implementar un endpoint de logout para revocar el acceso a través de la invalidación de tokens, especialmente si se manejan sesiones críticas.

¿Cómo se puede implementar la funcionalidad "Dar de baja"?
Eliminar el Usuario: Se puede implementar un endpoint que elimine el usuario de la base de datos, haciendo que su cuenta ya no exista.

Marcar como Inactivo: Otra opción sería agregar un campo en el modelo de usuario que indique si el usuario está activo o inactivo, permitiendo así conservar los datos en la base de datos sin eliminarlo.

Confirmación por Correo Electrónico: Se podría requerir que el usuario confirme su decisión de darse de baja a través de un enlace enviado a su correo electrónico.
