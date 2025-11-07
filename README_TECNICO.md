# Documentación Técnica del Proyecto

## Descripción de Arquitectura y Dependencias

Este proyecto utiliza una arquitectura modular, separando el backend (Java) y el frontend (Python/Flask). Cada módulo funcional (buses, cooperativas, usuarios, pagos, seguridad) puede evolucionar hacia un microservicio independiente, comunicándose mediante API REST y gestionados con Docker.

- **Backend:** Java (JAX-RS), MongoDB, JWT para autenticación.
- **Frontend:** Python (Flask), HTML/CSS/JS, consume APIs REST del backend.
- **Contenedores:** Docker y Docker Compose para orquestación.
- **API Gateway:** Recomendado Kong, NGINX, Traefik o AWS API Gateway para centralizar rutas, autenticación y seguridad.

## Colección Postman


La colección Postman (`postman_collection.json`) te permite probar los endpoints principales del backend de forma sencilla:

1. **Importar la colección:**
   - Abre Postman y selecciona "Import".
   - Elige el archivo `postman_collection.json` ubicado en la raíz del proyecto.

2. **Variables de entorno:**
   - La colección incluye las variables `base_url` (por defecto `http://localhost:8080`) y `token`.
   - Modifica `base_url` si tu backend corre en otra dirección o puerto.

3. **Flujo de prueba recomendado:**
   - Ejecuta la petición **Login** con credenciales válidas (por ejemplo, correo: `admin@demo.com`, contraseña: `admin123`).
   - Copia el token JWT recibido en la respuesta.
   - Pega el token en la variable `token` de la colección.
   - Ahora puedes probar los endpoints protegidos (listar buses, cooperativas, usuarios) que requieren autenticación.

4. **Agregar nuevos endpoints:**
   - Si el backend crece, puedes duplicar y editar las peticiones existentes o crear nuevas desde Postman y exportar la colección actualizada.

**Ejemplo de uso:**
```markdown
1. Importa la colección en Postman.
2. Haz login y copia el token JWT.
3. Pega el token en la variable `token`.
4. Ejecuta las peticiones de lista para buses, cooperativas, usuarios, etc.
```

Esto facilita la validación y depuración de la API durante el desarrollo.

## Estándares de Codificación

- **Backend Java:**
  - Uso de JAX-RS para APIs REST.
  - Nombres de clases y métodos en PascalCase y camelCase.
  - Validación de datos y manejo de errores con respuestas HTTP adecuadas.
  - JWT para autenticación y autorización.
  - Separación de lógica de negocio y acceso a datos.

- **Frontend Python/Flask:**
  - Nombres de funciones y variables en snake_case.
  - Uso de Blueprints para modularidad.
  - Manejo de sesiones y tokens JWT.
  - Validación de formularios y manejo de errores en la interfaz.

- **General:**
  - Uso de Docker para desarrollo y despliegue.
  - Variables sensibles en archivos `.env`.
  - Documentación de endpoints y funciones con docstrings y comentarios.

## Guía de Instalación

1. **Clonar el repositorio:**
   ```sh # indicando que lo que sigue son comandos de shell
   git clone https://github.com/DaviYelan/Proyecto_Plataformas.git
   cd Proyecto_Plataformas
   ```
2. **Configurar variables de entorno:**
   - Copia y edita los archivos `.env` en `backend/` y `frontend/`.
3. **Construir y levantar los servicios con Docker Compose:**
   ```sh
   docker-compose -f docker-compose.prod.yml up --build -d
   ```
4. **Importar la colección Postman:**
   - Abre Postman y importa el archivo `postman_collection.json`.

---

Para dudas técnicas, revisa los comentarios en el código y la colección Postman. Para problemas de despliegue, consulta los logs de Docker y verifica las variables de entorno.
