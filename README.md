# 🚌 Sistema de Venta y Reserva de Boletos de Bus

<div align="center">

![Estado del Proyecto](https://img.shields.io/badge/Estado-En%20Desarrollo-yellow)
![Versión](https://img.shields.io/badge/Versión-1.9.1-blue)
![Licencia](https://img.shields.io/badge/Licencia-MIT-green)
![Contribuidores](https://img.shields.io/badge/Contribuidores-3-orange)

**Un sistema web moderno y completo para la gestión integral de venta y reserva de boletos de transporte terrestre**

[Características](#-características-principales) •
[Demo](#-capturas-de-pantalla) •
[Instalación](#-instalación-y-configuración) •
[Documentación](#-documentación-técnica) •
[Equipo](#-equipo-de-desarrollo)

</div>

---

## 📋 Tabla de Contenidos

- [Descripción General](#-descripción-general)
- [Contexto y Problemática](#-contexto-y-problemática)
- [Objetivos del Proyecto](#-objetivos-del-proyecto)
- [Características Principales](#-características-principales)
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Requisitos del Sistema](#-requisitos-del-sistema)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Uso del Sistema](#-uso-del-sistema)
- [Capturas de Pantalla](#-capturas-de-pantalla)
- [Seguridad](#-seguridad)
- [Documentación Técnica](#-documentación-técnica)
- [Estándares de Desarrollo](#-estándares-de-desarrollo)
- [Control de Versiones](#-control-de-versiones)
- [Testing y Pruebas](#-testing-y-pruebas)
- [Roadmap](#-roadmap)
- [Equipo de Desarrollo](#-equipo-de-desarrollo)
- [Contribuciones](#-contribuciones)
- [Licencia](#-licencia)
- [Contacto y Soporte](#-contacto-y-soporte)

---

## 🎯 Descripción General

El **Sistema de Venta y Reserva de Boletos de Bus** es una solución web integral diseñada para modernizar y digitalizar el proceso de compra de pasajes de transporte terrestre. Este proyecto académico-profesional implementa las mejores prácticas de desarrollo web moderno, integrando un frontend responsivo con un backend robusto y seguro.

### 🌟 Propuesta de Valor

- **Para usuarios**: Experiencia de compra rápida, intuitiva y accesible desde cualquier dispositivo
- **Para empresas**: Reducción de costos operativos y mejor gestión de recursos
- **Para desarrolladores**: Arquitectura escalable y mantenible siguiendo estándares de la industria

---

## 🔍 Contexto y Problemática

### Situación Actual

La gestión tradicional de venta de boletos de transporte terrestre enfrenta múltiples desafíos:

| Problemática | Impacto |
|-------------|---------|
| **Procesos manuales lentos** | Largas filas y tiempos de espera en terminales |
| **Dependencia de atención presencial** | Imposibilidad de comprar fuera del horario de taquilla |
| **Falta de información en tiempo real** | Desconocimiento de disponibilidad de asientos y horarios |
| **Poca flexibilidad para reservas** | Dificultad para planificar viajes con anticipación |
| **Gestión ineficiente de datos** | Errores en el registro de ventas y falta de trazabilidad |

### Solución Propuesta

Un sistema web moderno que permite a los usuarios:

✅ Registrarse y autenticarse de forma segura  
✅ Buscar rutas y horarios disponibles en tiempo real  
✅ Visualizar la disponibilidad de asientos de forma gráfica  
✅ Realizar compras o reservas de boletos las 24/7  
✅ Gestionar sus boletos de forma autónoma  

---

## 🎯 Objetivos del Proyecto

### Objetivo General

Desarrollar un sistema web funcional, responsivo y seguro que permita la **venta y reserva de boletos de bus**, integrando frontend y backend mediante una API REST, aplicando estándares modernos de desarrollo web, principios de usabilidad, accesibilidad (WAI-ARIA) y medidas de seguridad basadas en OWASP Top 10.

### Objetivos Específicos

#### Frontend
- ✅ Implementar una interfaz web intuitiva, moderna y accesible
- ✅ Garantizar diseño responsivo para múltiples dispositivos
- ✅ Aplicar criterios de usabilidad y experiencia de usuario (UX)
- ✅ Integrar criterios de accesibilidad WAI-ARIA

#### Backend
- ✅ Desarrollar una API REST segura y eficiente
- ✅ Implementar autenticación y autorización con JWT
- ✅ Aplicar principios de seguridad OWASP Top 10
- ✅ Gestionar la lógica de negocio de forma escalable

#### Integración y Arquitectura
- ✅ Conectar frontend y backend mediante servicios REST
- ✅ Documentar la arquitectura usando el modelo C4
- ✅ Desplegar servicios en contenedores Docker
- ✅ Implementar GitFlow para control de versiones

---

## ⚡ Características Principales

### 🔐 Gestión de Usuarios

<table>
<tr>
<td width="50%">

**Registro y Autenticación**
- Sistema de registro con validación de datos
- Inicio de sesión seguro con JWT
- Cifrado de contraseñas con BCrypt
- Protección contra fuerza bruta
- Recuperación de contraseña

</td>
<td width="50%">

**Gestión de Perfil**
- Actualización de datos personales
- Historial de compras y reservas
- Preferencias de viaje
- Gestión de métodos de pago

</td>
</tr>
</table>

### 🎫 Funcionalidades de Boletos

| Código | Funcionalidad | Descripción | Prioridad |
|--------|--------------|-------------|-----------|
| **RF01** | Registro de cuenta | Creación de cuentas de usuario con validación de datos | 🔴 Alta |
| **RF02** | Inicio de sesión | Autenticación segura por correo y contraseña con JWT | 🔴 Alta |
| **RF03** | Preferencias de turnos | Visualización de turnos frecuentes del usuario | 🟡 Baja |
| **RF04** | Generación de boletos | Compra de uno o varios boletos en una transacción | 🔴 Alta |
| **RF05** | Selección de ruta | Elección de ciudad de origen y destino | 🔴 Alta |
| **RF06** | Selección de horario | Visualización de horarios disponibles para la ruta | 🔴 Alta |
| **RF07** | Previsualización | Vista previa de ruta y horario seleccionados | 🟠 Media |
| **RF08** | Elección de asientos | Selección interactiva de asientos disponibles | 🟠 Media |
| **RF09** | Compra / Reserva | Gestión completa del proceso de adquisición | 🔴 Alta |
| **RF10** | Reserva temporal | Sistema de reserva con validez de 24 horas | 🔴 Alta |
| **RF11** | Cancelación | Cancelación de boletos según políticas establecidas | 🟠 Media |
| **RF12** | Historial | Visualización de compras y reservas anteriores | 🟠 Media |

### 🔍 Búsqueda y Filtrado

- **Búsqueda por ruta**: Origen y destino
- **Filtrado por fecha**: Selección de día de viaje
- **Filtrado por horario**: Mañana, tarde, noche
- **Visualización de disponibilidad**: Asientos libres en tiempo real
- **Comparación de precios**: Diferentes categorías de servicio

### 💺 Selección de Asientos

- Mapa visual interactivo del autobús
- Código de colores para disponibilidad
- Selección múltiple de asientos
- Información de ubicación (ventana, pasillo)
- Bloqueo temporal durante el proceso de compra

### 💳 Procesamiento de Pagos

- Múltiples métodos de pago
- Validación de datos de pago
- Confirmación de transacción
- Generación de comprobante digital
- Sistema de notificaciones por correo

---

## 🏗️ Arquitectura del Sistema

### Modelo Arquitectónico

El sistema implementa una **arquitectura Cliente-Servidor** con integración de **microservicios**, optimizada para escalabilidad, mantenibilidad y despliegue en contenedores.

```
┌─────────────────────────────────────────────────────────────┐
│                     CAPA DE PRESENTACIÓN                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │          Frontend Web (React + Vite)                 │   │
│  │  • Interfaz de Usuario Responsiva                   │   │
│  │  • Componentes Reutilizables                        │   │
│  │  • Gestión de Estado                                │   │
│  │  • Routing Dinámico                                 │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/HTTPS (REST API)
                         │ JSON
┌────────────────────────▼────────────────────────────────────┐
│                     CAPA DE APLICACIÓN                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │          API REST (Java/Spring Boot)                │   │
│  │  • Controladores REST                               │   │
│  │  • Servicios de Negocio                            │   │
│  │  • Validaciones                                     │   │
│  │  • Autenticación JWT                               │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │          Microservicios (Docker)                    │   │
│  │  • Servicio de Autenticación                       │   │
│  │  • Servicio de Boletos                             │   │
│  │  • Servicio de Notificaciones                      │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │ JDBC/ORM
┌────────────────────────▼────────────────────────────────────┐
│                     CAPA DE DATOS                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │          Base de Datos Relacional                   │   │
│  │  • Usuarios y Cuentas                              │   │
│  │  • Rutas y Horarios                                │   │
│  │  • Boletos y Reservas                              │   │
│  │  • Transacciones                                   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Modelo C4 - Niveles de Abstracción

El proyecto implementa los 4 niveles del modelo C4 para documentar la arquitectura:

#### 1️⃣ Diagrama de Contexto (Context Diagram)
Muestra el sistema como una caja negra y sus interacciones con usuarios externos y sistemas.

**Actores principales:**
- **Usuario Cliente**: Busca, reserva y compra boletos
- **Administrador**: Gestiona rutas, horarios y configuración del sistema
- **Sistema de Pagos**: Procesa las transacciones (integración externa)

#### 2️⃣ Diagrama de Contenedores (Container Diagram)
Detalla las aplicaciones y almacenes de datos que componen el sistema.

**Contenedores identificados:**
- **Aplicación Web (React)**: SPA responsiva
- **API REST (Java)**: Backend de servicios
- **Base de Datos**: Almacenamiento persistente
- **Contenedores Docker**: Microservicios independientes

#### 3️⃣ Diagrama de Componentes (Component Diagram)
Descompone los contenedores en componentes lógicos.

**Componentes del Frontend:**
- Layout & Navigation
- Authentication Components
- Search & Filter Components
- Seat Selection Component
- Payment Components
- User Profile Components

**Componentes del Backend:**
- Auth Controller & Service
- User Management Service
- Route & Schedule Service
- Ticket & Booking Service
- Payment Service

#### 4️⃣ Diagrama de Código (Code Diagram)
Muestra las clases principales y sus relaciones.

**Clases principales:**
- `Usuario`, `Cuenta`, `Rol`
- `Ruta`, `Horario`, `Bus`
- `Boleto`, `Reserva`, `Asiento`
- `Pago`, `Transaccion`

📁 **Ubicación de diagramas**: `/docs/architecture/`

---

## 🛠️ Tecnologías Utilizadas

### Frontend Stack

<table>
<tr>
<td align="center" width="96">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="48" height="48" alt="React" />
<br>React 18
</td>
<td align="center" width="96">
<img src="https://vitejs.dev/logo.svg" width="48" height="48" alt="Vite" />
<br>Vite
</td>
<td align="center" width="96">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="48" height="48" alt="JavaScript" />
<br>JavaScript ES6+
</td>
<td align="center" width="96">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" width="48" height="48" alt="HTML5" />
<br>HTML5
</td>
<td align="center" width="96">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" width="48" height="48" alt="CSS3" />
<br>CSS3
</td>
</tr>
<tr>
<td align="center" width="96">
<img src="https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg" width="48" height="48" alt="Tailwind" />
<br>Tailwind CSS
</td>
<td align="center" width="96">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg" width="48" height="48" alt="npm" />
<br>npm
</td>
<td align="center" width="96">
<img src="https://axios-http.com/assets/logo.svg" width="48" height="48" alt="Axios" />
<br>Axios
</td>
<td align="center" width="96">
<img src="https://reactrouter.com/_brand/react-router-stacked-color-inverted.svg" width="48" height="48" alt="React Router" style="filter: invert(1);" />
<br>React Router
</td>
<td align="center" width="96">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/eslint/eslint-original.svg" width="48" height="48" alt="ESLint" />
<br>ESLint
</td>
</tr>
</table>

### Backend Stack

<table>
<tr>
<td align="center" width="96">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" width="48" height="48" alt="Java" />
<br>Java 17+
</td>
<td align="center" width="96">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" width="48" height="48" alt="Spring" />
<br>Spring Boot
</td>
<td align="center" width="96">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/maven/maven-original.svg" width="48" height="48" alt="Maven" />
<br>Maven
</td>
<td align="center" width="96">
<img src="https://jwt.io/img/pic_logo.svg" width="48" height="48" alt="JWT" />
<br>JWT
</td>
<td align="center" width="96">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" width="48" height="48" alt="PostgreSQL" />
<br>PostgreSQL
</td>
</tr>
</table>

### DevOps & Tools

<table>
<tr>
<td align="center" width="96">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" width="48" height="48" alt="Docker" />
<br>Docker
</td>
<td align="center" width="96">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" width="48" height="48" alt="Git" />
<br>Git
</td>
<td align="center" width="96">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" width="48" height="48" alt="GitHub" style="filter: invert(1);" />
<br>GitHub
</td>
<td align="center" width="96">
<img src="https://www.gitkraken.com/downloads/brand-assets/gitkraken-logo-light-sq.png" width="48" height="48" alt="GitKraken" />
<br>GitKraken
</td>
<td align="center" width="96">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" width="48" height="48" alt="VS Code" />
<br>VS Code
</td>
</tr>
<tr>
<td align="center" width="96">
<img src="https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg" width="48" height="48" alt="Postman" />
<br>Postman
</td>
<td align="center" width="96">
<img src="https://plantuml.com/logo3.png" width="48" height="48" alt="PlantUML" />
<br>PlantUML
</td>
<td align="center" width="96">
<img src="https://mermaid.js.org/favicon.svg" width="48" height="48" alt="Mermaid" />
<br>Mermaid
</td>
<td align="center" width="96">
<img src="https://app.diagrams.net/images/logo-app.svg" width="48" height="48" alt="Draw.io" />
<br>Draw.io
</td>
<td align="center" width="96">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swagger/swagger-original.svg" width="48" height="48" alt="Swagger" />
<br>Swagger
</td>
</tr>
</table>

### Arquitectura y Documentación

| Herramienta | Propósito |
|------------|----------|
| **Modelo C4** | Documentación arquitectónica multinivel |
| **PlantUML** | Generación de diagramas UML |
| **Mermaid** | Diagramas de flujo y secuencia |
| **Draw.io** | Diseño de arquitectura visual |
| **Swagger/OpenAPI** | Documentación de API REST |

---

## 💻 Requisitos del Sistema

### Requisitos de Hardware (Mínimos)

| Componente | Especificación |
|-----------|---------------|
| **Procesador** | Intel Core i3 o equivalente |
| **RAM** | 4 GB mínimo (8 GB recomendado) |
| **Almacenamiento** | 500 MB de espacio libre |
| **Conexión** | Acceso a Internet estable |

### Requisitos de Software

#### Para Desarrollo

| Software | Versión | Propósito |
|---------|---------|----------|
| **Node.js** | ≥ 18.x | Entorno de ejecución para frontend |
| **npm** | ≥ 9.x | Gestor de paquetes |
| **Java JDK** | ≥ 17 | Desarrollo del backend |
| **Maven** | ≥ 3.8 | Gestión de dependencias Java |
| **Docker** | ≥ 24.x | Contenedores de microservicios |
| **PostgreSQL** | ≥ 14.x | Base de datos |
| **Git** | ≥ 2.40 | Control de versiones |

#### Para Uso (Cliente)

| Requisito | Especificación |
|----------|---------------|
| **Navegador** | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ |
| **Resolución** | Mínimo 1024x768 (responsive desde 320px) |
| **JavaScript** | Habilitado |
| **Cookies** | Habilitadas para sesión |
| **Conectividad** | Conexión a Internet activa |

### Requisitos No Funcionales

| Categoría | Especificación | Métrica |
|-----------|---------------|---------|
| **Disponibilidad** | Sistema disponible 24/7 | 99.9% uptime |
| **Rendimiento** | Tiempo de respuesta óptimo | < 2 segundos |
| **Escalabilidad** | Soporte concurrente | 100+ usuarios simultáneos |
| **Seguridad** | Autenticación y cifrado | JWT + HTTPS |
| **Compatibilidad** | Multi-navegador y multi-dispositivo | Desktop, tablet, móvil |
| **Mantenibilidad** | Código documentado y modular | 80%+ cobertura de comentarios |
| **Accesibilidad** | Cumplimiento WAI-ARIA | Nivel AA WCAG 2.1 |

---

## 📦 Instalación y Configuración

### Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- ✅ Node.js (v18 o superior)
- ✅ npm (v9 o superior)
- ✅ Java JDK (v17 o superior)
- ✅ Maven (v3.8 o superior)
- ✅ Docker y Docker Compose
- ✅ Git
- ✅ PostgreSQL (v14 o superior)

### Paso 1: Clonar el Repositorio

```bash
# Clonar el proyecto
git clone https://github.com/tu-usuario/sistema-boletos-bus.git

# Navegar al directorio del proyecto
cd sistema-boletos-bus
```

### Paso 2: Configuración del Backend

#### 2.1 Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto backend:

```bash
# Configuración de Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=boletos_db
DB_USER=postgres
DB_PASSWORD=tu_contraseña

# Configuración JWT
JWT_SECRET=tu_clave_secreta_muy_segura_aqui
JWT_EXPIRATION=86400000

# Configuración de Seguridad
AUTH_MAX_ATTEMPTS=5
AUTH_LOCK_SECONDS=300

# Puerto del servidor
SERVER_PORT=8099

# Entorno
ENVIRONMENT=development
```

#### 2.2 Crear Base de Datos

```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE boletos_db;

# Salir de PostgreSQL
\q
```

#### 2.3 Instalar Dependencias y Ejecutar

```bash
# Navegar al directorio del backend
cd backend

# Compilar el proyecto
mvn clean compile

# Ejecutar la aplicación
mvn exec:java

# O usando Spring Boot
mvn spring-boot:run
```

El backend estará disponible en: `http://localhost:8099`

### Paso 3: Configuración del Frontend

#### 3.1 Configurar Variables de Entorno

Crea un archivo `.env.local` en el directorio del frontend:

```bash
# URL del backend
VITE_API_URL=http://localhost:8099/api

# Ambiente
VITE_ENVIRONMENT=development
```

#### 3.2 Instalar Dependencias y Ejecutar

```bash
# Navegar al directorio del frontend
cd frontend

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

### Paso 4: Despliegue con Docker (Opcional)

#### 4.1 Construir Contenedores

```bash
# Construir imágenes
docker-compose build

# Iniciar servicios
docker-compose up -d
```

#### 4.2 Verificar Servicios

```bash
# Ver contenedores en ejecución
docker-compose ps

# Ver logs
docker-compose logs -f
```

### Paso 5: Verificación de la Instalación

#### Backend

```bash
# Verificar salud del servicio
curl http://localhost:8099/api/health

# Respuesta esperada:
# {"status": "UP", "timestamp": "2024-01-27T10:30:00"}
```

#### Frontend

Abre tu navegador y accede a `http://localhost:5173`. Deberías ver la página de inicio del sistema.

### Solución de Problemas Comunes

<details>
<summary><b>❌ Error: Puerto ya en uso</b></summary>

Si el puerto 8099 o 5173 está ocupado:

```bash
# Cambiar puerto del backend en .env
SERVER_PORT=8100

# Cambiar puerto del frontend
npm run dev -- --port 5174
```
</details>

<details>
<summary><b>❌ Error de conexión a base de datos</b></summary>

Verifica que PostgreSQL esté ejecutándose:

```bash
# En Linux/Mac
sudo service postgresql status

# En Windows
# Verificar en Servicios o usar pgAdmin
```
</details>

<details>
<summary><b>❌ Error de CORS</b></summary>

Asegúrate de que el backend tenga configurado correctamente el origen del frontend en la configuración de CORS.
</details>

---

## 🚀 Uso del Sistema

### 1. Registro de Usuario

1. Accede a la página principal
2. Click en "Registrarse"
3. Completa el formulario con:
   - Nombre completo
   - Correo electrónico
   - Contraseña (mínimo 8 caracteres)
   - Confirmación de contraseña
4. Acepta términos y condiciones
5. Click en "Crear cuenta"

### 2. Inicio de Sesión

1. En la página principal, click en "Iniciar sesión"
2. Ingresa tu correo electrónico
3. Ingresa tu contraseña
4. Click en "Entrar"

El sistema generará un token JWT que se almacenará de forma segura.

### 3. Búsqueda de Viajes

1. En el dashboard, selecciona:
   - Ciudad de origen
   - Ciudad de destino
   - Fecha del viaje
2. Click en "Buscar viajes"
3. Explora los resultados disponibles:
   - Horarios disponibles
   - Precios
   - Disponibilidad de asientos

### 4. Selección de Asientos

1. Elige un viaje de la lista
2. Click en "Seleccionar asientos"
3. Visualiza el mapa del autobús
4. Selecciona tus asientos preferidos
5. Confirma tu selección

### 5. Proceso de Compra

1. Revisa el resumen de tu compra
2. Completa información del pasajero
3. Selecciona método de pago
4. Ingresa datos de pago
5. Confirma la transacción
6. Descarga tu boleto digital

### 6. Gestión de Reservas

**Realizar una reserva:**
- Sigue los pasos 3-4
- Selecciona "Reservar" en lugar de "Comprar"
- La reserva será válida por 24 horas

**Ver mis reservas:**
- Accede a "Mi perfil" → "Mis reservas"
- Visualiza tus reservas activas
- Opción de confirmar compra o cancelar

**Cancelar una reserva:**
- En "Mis reservas", click en la reserva deseada
- Click en "Cancelar reserva"
- Confirma la cancelación

---

## 📸 Capturas de Pantalla

### Página de Inicio

La página principal presenta un diseño limpio e intuitivo con acceso rápido a las funcionalidades principales.

### Dashboard de Usuario

Interfaz personalizada que muestra:
- Búsqueda rápida de viajes
- Viajes recientes
- Reservas activas
- Accesos directos

### Búsqueda de Viajes

Sistema de búsqueda avanzada con:
- Selección de origen y destino
- Calendario interactivo
- Filtros de precio y horario
- Resultados en tiempo real

### Selección de Asientos

Mapa interactivo del autobús mostrando:
- Asientos disponibles (verde)
- Asientos ocupados (rojo)
- Asientos seleccionados (azul)
- Ubicación (ventana/pasillo)

### Proceso de Pago

Interfaz segura y clara para:
- Resumen de compra
- Datos del pasajero
- Métodos de pago
- Confirmación de transacción

### Panel de Administración

Herramientas de gestión para:
- Configuración de rutas
- Gestión de horarios
- Reportes de ventas
- Administración de usuarios

---

## 🔐 Seguridad

### Implementación de OWASP Top 10

El sistema implementa medidas de seguridad basadas en las recomendaciones de OWASP Top 10:

#### A01 - Broken Access Control

**Medidas implementadas:**

✅ **Autenticación con JWT**
- Generación de tokens seguros con clave secreta
- Tokens de corta duración con renovación automática
- Validación en cada petición al backend

✅ **Control de acceso basado en roles (RBAC)**
```java
// Ejemplo de validación de roles
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<List<Cuenta>> listarCuentas() {
    // Sólo accesible por administradores
}
```

✅ **Validación en frontend y backend**
- Verificación de permisos en ambas capas
- Protección de rutas sensibles
- Redirección automática en caso de acceso no autorizado

#### A02 - Cryptographic Failures

**Medidas implementadas:**

✅ **Cifrado de contraseñas con BCrypt**
```java
// Cifrado durante el registro
String hashedPassword = BCrypt.hashpw(password, BCrypt.gensalt(12));

// Verificación durante el login
if (BCrypt.checkpw(inputPassword, storedHash)) {
    // Contraseña correcta
}
```

✅ **Almacenamiento seguro de credenciales**
- Contraseñas nunca se almacenan en texto plano
- Factor de trabajo de BCrypt configurado a 12 rounds
- Claves secretas almacenadas en variables de entorno

✅ **Comunicación segura**
- Uso de HTTPS en producción
- Tokens JWT firmados criptográficamente
- Headers de seguridad configurados

#### A03 - Injection

**Medidas implementadas:**

✅ **Prevención de SQL Injection**
- Uso de consultas parametrizadas
- ORM (JPA/Hibernate) para acceso a datos
- Validación de entrada en todas las consultas

```java
// Consulta segura con parámetros
@Query("SELECT u FROM Usuario u WHERE u.email = :email")
Usuario findByEmail(@Param("email") String email);
```

✅ **Sanitización de entradas**
- Validación de todos los campos de formulario
- Escape de caracteres especiales
- Validación de tipos de datos

#### A04 - Insecure Design

**Medidas implementadas:**

✅ **Arquitectura segura por diseño**
- Separación de responsabilidades (MVC)
- Principio de menor privilegio
- Validación en múltiples capas

✅ **Límite de intentos de login**
```java
// Protección contra fuerza bruta
int MAX_ATTEMPTS = 5;
int LOCK_TIME_SECONDS = 300;

if (failedAttempts >= MAX_ATTEMPTS) {
    cuenta.setLockedUntil(LocalDateTime.now().plusSeconds(LOCK_TIME_SECONDS));
    return ResponseEntity.status(423).body("Cuenta bloqueada temporalmente");
}
```

#### A05 - Security Misconfiguration

**Medidas implementadas:**

✅ **Configuración segura por defecto**
- Variables de entorno para datos sensibles
- Headers de seguridad configurados
- Mensajes de error genéricos (sin información sensible)

✅ **Logging y monitoreo**
```java
// Registro de eventos de seguridad
logger.info("Intento de login para usuario: " + email);
logger.warning("Intento fallido de login #" + failedAttempts);
logger.severe("Cuenta bloqueada por exceso de intentos: " + email);
```

#### A07 - Identification and Authentication Failures

**Medidas implementadas:**

✅ **Autenticación robusta**
- Validación de formato de email
- Requisitos de complejidad de contraseña
- Sesiones seguras con JWT

✅ **Gestión de sesiones**
- Tokens con expiración configurada
- Logout que invalida el token
- Renovación automática de tokens

✅ **Protección contra fuerza bruta**
- Límite de intentos fallidos
- Bloqueo temporal de cuenta
- Registro de intentos sospechosos

### Configuración de Seguridad en el Backend

```java
// Configuración de CORS
@Configuration
public class SecurityConfig {
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowCredentials(true);
        return new CorsFilter(urlBasedCorsConfigurationSource);
    }
}
```

### Buenas Prácticas de Seguridad

| Práctica | Implementación | Estado |
|----------|---------------|--------|
| **Validación de entrada** | Validación en cliente y servidor | ✅ Implementado |
| **Sanitización de datos** | Escape de caracteres especiales | ✅ Implementado |
| **Principio de menor privilegio** | Roles y permisos granulares | ✅ Implementado |
| **Logging de seguridad** | Registro de eventos críticos | ✅ Implementado |
| **Actualización de dependencias** | Revisión regular de vulnerabilidades | 🔄 En proceso |
| **Pruebas de penetración** | Testing de seguridad periódico | 📋 Planificado |

---

## 📚 Documentación Técnica

### Estructura del Proyecto

```
sistema-boletos-bus/
├── frontend/                   # Aplicación React
│   ├── public/                # Archivos estáticos
│   ├── src/
│   │   ├── assets/           # Imágenes, iconos, estilos globales
│   │   ├── components/       # Componentes React reutilizables
│   │   │   ├── Auth/        # Componentes de autenticación
│   │   │   ├── Layout/      # Componentes de estructura
│   │   │   ├── Search/      # Componentes de búsqueda
│   │   │   ├── Booking/     # Componentes de reserva
│   │   │   └── Common/      # Componentes comunes
│   │   ├── pages/           # Vistas/Páginas principales
│   │   │   ├── Home/
│   │   │   ├── Login/
│   │   │   ├── Register/
│   │   │   ├── Dashboard/
│   │   │   ├── Search/
│   │   │   └── Profile/
│   │   ├── services/        # Servicios de API
│   │   │   ├── authService.js
│   │   │   ├── ticketService.js
│   │   │   └── userService.js
│   │   ├── context/         # Context API de React
│   │   ├── hooks/           # Custom Hooks
│   │   ├── utils/           # Utilidades y helpers
│   │   ├── App.jsx          # Componente raíz
│   │   └── main.jsx         # Punto de entrada
│   ├── .env.local           # Variables de entorno (no versionado)
│   ├── package.json         # Dependencias npm
│   ├── vite.config.js       # Configuración de Vite
│   └── README.md
│
├── backend/                   # API REST en Java
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com.boletos/
│   │   │   │       ├── controller/    # Controladores REST
│   │   │   │       │   ├── AuthController.java
│   │   │   │       │   ├── TicketController.java
│   │   │   │       │   └── UserController.java
│   │   │   │       ├── service/       # Lógica de negocio
│   │   │   │       │   ├── AuthService.java
│   │   │   │       │   ├── TicketService.java
│   │   │   │       │   └── UserService.java
│   │   │   │       ├── model/         # Entidades JPA
│   │   │   │       │   ├── Usuario.java
│   │   │   │       │   ├── Cuenta.java
│   │   │   │       │   ├── Boleto.java
│   │   │   │       │   └── Ruta.java
│   │   │   │       ├── repository/    # Repositorios JPA
│   │   │   │       ├── security/      # Configuración de seguridad
│   │   │   │       │   ├── JwtUtil.java
│   │   │   │       │   └── SecurityConfig.java
│   │   │   │       ├── dto/           # Data Transfer Objects
│   │   │   │       ├── exception/     # Manejo de excepciones
│   │   │   │       └── util/          # Utilidades
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── application-dev.properties
│   │   └── test/              # Pruebas unitarias e integración
│   ├── .env                   # Variables de entorno (no versionado)
│   ├── pom.xml                # Dependencias Maven
│   └── README.md
│
├── docs/                      # Documentación del proyecto
│   ├── architecture/          # Diagramas de arquitectura
│   │   ├── context-diagram.puml
│   │   ├── container-diagram.puml
│   │   ├── component-diagram.puml
│   │   └── code-diagram.puml
│   ├── api/                   # Documentación de API
│   │   ├── endpoints.md
│   │   └── swagger.yaml
│   ├── security/              # Documentación de seguridad
│   │   ├── owasp-implementation.md
│   │   └── security-policies.md
│   ├── user-manual/           # Manual de usuario
│   └── developer-guide/       # Guía para desarrolladores
│
├── docker/                    # Configuración Docker
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   └── docker-compose.yml
│
├── .gitignore                 # Archivos ignorados por Git
├── README.md                  # Este archivo
└── LICENSE                    # Licencia del proyecto
```

### Endpoints de la API

#### Autenticación

```
POST   /api/auth/register      - Registro de nuevo usuario
POST   /api/auth/login         - Inicio de sesión
POST   /api/auth/logout        - Cerrar sesión
POST   /api/auth/refresh       - Renovar token JWT
POST   /api/auth/forgot        - Recuperación de contraseña
```

#### Usuarios

```
GET    /api/users/profile      - Obtener perfil del usuario
PUT    /api/users/profile      - Actualizar perfil
GET    /api/users/history      - Historial de compras
```

#### Rutas

```
GET    /api/routes             - Listar todas las rutas
GET    /api/routes/:id         - Obtener ruta específica
POST   /api/routes/search      - Buscar rutas disponibles
```

#### Boletos

```
GET    /api/tickets            - Listar boletos disponibles
POST   /api/tickets/reserve    - Crear reserva
POST   /api/tickets/purchase   - Comprar boleto
DELETE /api/tickets/:id        - Cancelar boleto/reserva
GET    /api/tickets/:id        - Obtener detalles de boleto
```

#### Administración

```
GET    /api/admin/users        - Listar usuarios (Admin)
GET    /api/admin/stats        - Estadísticas (Admin)
POST   /api/admin/routes       - Crear ruta (Admin)
PUT    /api/admin/routes/:id   - Actualizar ruta (Admin)
```

### Modelos de Datos

#### Usuario
```javascript
{
  id: String,
  nombre: String,
  apellido: String,
  email: String (unique),
  password: String (hashed),
  telefono: String,
  rol: String, // 'CLIENTE' | 'ADMIN'
  fechaRegistro: DateTime,
  estado: Boolean
}
```

#### Boleto
```javascript
{
  id: String,
  usuarioId: String,
  rutaId: String,
  asientoNumero: Number,
  fechaViaje: Date,
  precio: Decimal,
  estado: String, // 'RESERVADO' | 'COMPRADO' | 'CANCELADO'
  codigoQR: String,
  fechaCompra: DateTime
}
```

#### Ruta
```javascript
{
  id: String,
  origen: String,
  destino: String,
  duracion: Number, // minutos
  distancia: Number, // kilómetros
  precio: Decimal,
  horarios: Array[DateTime],
  capacidad: Number
}
```

---

## 📐 Estándares de Desarrollo

### Convenciones de Código

#### JavaScript/React

```javascript
// ✅ CORRECTO - Nombres en camelCase
const userName = "Juan";
const getUserData = () => {};

// ✅ CORRECTO - Componentes en PascalCase
function UserProfile() {}
const SearchBar = () => {};

// ✅ CORRECTO - Constantes en UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = "http://localhost:8099";

// ✅ CORRECTO - Comentarios descriptivos en español
// Obtiene los datos del usuario desde la API
const fetchUserData = async (userId) => {
  // Validar que el ID sea válido
  if (!userId) return null;
  
  // Realizar petición
  const response = await api.get(`/users/${userId}`);
  return response.data;
};
```

#### Java

```java
// ✅ CORRECTO - Clases en PascalCase
public class UserController {}

// ✅ CORRECTO - Métodos y variables en camelCase
private String userName;
public void getUserData() {}

// ✅ CORRECTO - Constantes en UPPER_SNAKE_CASE
public static final int MAX_LOGIN_ATTEMPTS = 5;

// ✅ CORRECTO - Comentarios descriptivos
/**
 * Autentica un usuario en el sistema
 * @param email Correo electrónico del usuario
 * @param password Contraseña en texto plano
 * @return Token JWT si la autenticación es exitosa
 */
public String authenticate(String email, String password) {
    // Implementación...
}
```

### Organización de Componentes React

```javascript
// 📁 UserProfile.jsx

// 1. Imports externos
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Imports internos
import { getUserProfile } from '../../services/userService';
import './UserProfile.css';

// 3. Definición del componente
function UserProfile() {
  // 3.1 Hooks de estado
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 3.2 Hooks de efecto
  useEffect(() => {
    loadUserData();
  }, []);
  
  // 3.3 Funciones auxiliares
  const loadUserData = async () => {
    try {
      const data = await getUserProfile();
      setUser(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // 3.4 Renderizado condicional
  if (loading) return <div>Cargando...</div>;
  
  // 3.5 Renderizado principal
  return (
    <div className="user-profile">
      {/* Contenido */}
    </div>
  );
}

// 4. Export
export default UserProfile;
```

### Mensajes de Commit

Seguimos el estándar de **Conventional Commits**:

```bash
# Formato
<tipo>(<alcance>): <descripción>

[cuerpo opcional]

[pie opcional]

# Tipos permitidos:
feat:     Nueva funcionalidad
fix:      Corrección de bug
docs:     Cambios en documentación
style:    Cambios de formato (no afectan la lógica)
refactor: Refactorización de código
test:     Agregar o modificar tests
chore:    Tareas de mantenimiento

# Ejemplos:
feat(auth): implementar login con JWT
fix(tickets): corregir validación de asientos
docs(readme): actualizar instrucciones de instalación
style(frontend): aplicar formato con Prettier
refactor(api): reorganizar estructura de controladores
test(auth): agregar tests para registro de usuarios
chore(deps): actualizar dependencias de React
```

### Estructura de CSS

```css
/* ===================================
   Componente: SearchBar
   Descripción: Barra de búsqueda principal
   =================================== */

/* Variables locales */
.search-bar {
  --primary-color: #007bff;
  --border-radius: 8px;
  --spacing: 1rem;
}

/* Estilos base */
.search-bar {
  display: flex;
  gap: var(--spacing);
  padding: var(--spacing);
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* Elementos hijo */
.search-bar__input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.search-bar__button {
  padding: 0.5rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* Estados */
.search-bar__button:hover {
  background-color: #0056b3;
}

.search-bar__button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .search-bar {
    flex-direction: column;
  }
}
```

---

## 🌿 Control de Versiones

### Estrategia GitFlow

El proyecto implementa la metodología **GitFlow** para gestión de ramas:

```
┌─────────────────────────────────────────────────────────┐
│  main                  (Producción - Solo releases)      │
│    ↑                                                     │
│    │ merge                                               │
│    │                                                     │
│  develop              (Integración)                      │
│    ↑                                                     │
│    │ merge                                               │
│    ├──────────────────────────────────────────────┐     │
│    │                  │                  │         │     │
│  feature/login    feature/search   feature/payment│     │
│  (Desarrollo)     (Desarrollo)     (Desarrollo)   │     │
│                                                    │     │
│                                              hotfix/bug  │
│                                              (Urgente)   │
└─────────────────────────────────────────────────────────┘
```

### Ramas Principales

#### `main`
- **Propósito**: Código en producción
- **Protegida**: ✅ Sí
- **Recibe merge de**: `develop` (via release) o `hotfix`
- **Acceso**: Solo mediante pull request aprobado

#### `develop`
- **Propósito**: Rama de integración
- **Protegida**: ✅ Sí
- **Recibe merge de**: `feature/*`
- **Acceso**: Mediante pull request

### Ramas de Soporte

#### `feature/*`
- **Propósito**: Desarrollo de nuevas funcionalidades
- **Nomenclatura**: `feature/nombre-funcionalidad`
- **Se crea desde**: `develop`
- **Se fusiona en**: `develop`

**Ejemplos**:
```bash
feature/auth-jwt
feature/seat-selection
feature/payment-integration
feature/admin-dashboard
```

#### `bugfix/*`
- **Propósito**: Corrección de errores en desarrollo
- **Nomenclatura**: `bugfix/descripcion-error`
- **Se crea desde**: `develop`
- **Se fusiona en**: `develop`

#### `hotfix/*`
- **Propósito**: Correcciones urgentes en producción
- **Nomenclatura**: `hotfix/descripcion-urgente`
- **Se crea desde**: `main`
- **Se fusiona en**: `main` y `develop`

#### `release/*`
- **Propósito**: Preparación de una nueva versión
- **Nomenclatura**: `release/v1.0.0`
- **Se crea desde**: `develop`
- **Se fusiona en**: `main` y `develop`

### Flujo de Trabajo Típico

#### Crear una nueva funcionalidad

```bash
# 1. Actualizar develop
git checkout develop
git pull origin develop

# 2. Crear rama feature
git checkout -b feature/nombre-funcionalidad

# 3. Desarrollar y hacer commits
git add .
git commit -m "feat(modulo): descripción del cambio"

# 4. Mantener actualizada la rama
git fetch origin
git rebase origin/develop

# 5. Push de la rama
git push origin feature/nombre-funcionalidad

# 6. Crear Pull Request en GitHub/GitLab
# - Desde: feature/nombre-funcionalidad
# - Hacia: develop
# - Asignar revisores
# - Esperar aprobación
```

#### Corregir un bug en producción

```bash
# 1. Crear hotfix desde main
git checkout main
git pull origin main
git checkout -b hotfix/descripcion-error

# 2. Corregir el error
git add .
git commit -m "fix: descripción de la corrección"

# 3. Push
git push origin hotfix/descripcion-error

# 4. Crear Pull Request hacia main
# 5. Después del merge, también fusionar en develop
```

### Políticas de Pull Request

#### Checklist antes de crear PR

- [ ] El código compila sin errores
- [ ] Los tests pasan exitosamente
- [ ] Se agregó documentación si es necesario
- [ ] Se siguieron los estándares de código
- [ ] El commit sigue Conventional Commits
- [ ] Se probó localmente la funcionalidad

#### Proceso de Revisión

1. **Revisión de código**: Al menos 1 aprobación requerida
2. **Tests automáticos**: Deben pasar todos los tests
3. **Validación de conflictos**: Sin conflictos con la rama destino
4. **Documentación**: Actualizada si hay cambios en la API

---

## 🧪 Testing y Pruebas

### Estrategia de Testing

#### Pruebas de Integración API

**Herramienta**: Postman

Pruebas realizadas:

1. **Autenticación**
   - ✅ POST `/api/auth/register` - Código 201
   - ✅ POST `/api/auth/login` - Código 200 con token JWT
   - ✅ POST `/api/auth/login` (credenciales inválidas) - Código 401

2. **Gestión de cuentas (Admin)**
   - ✅ GET `/api/cuenta/lista` - Código 200 (con token admin)
   - ❌ GET `/api/cuenta/lista` - Código 403 (usuario sin permisos)
   - ❌ GET `/api/cuenta/lista` - Código 401 (sin token)

3. **CRUD de boletos**
   - ✅ GET `/api/tickets` - Listar boletos disponibles
   - ✅ POST `/api/tickets/reserve` - Crear reserva
   - ✅ POST `/api/tickets/purchase` - Comprar boleto
   - ✅ DELETE `/api/tickets/:id` - Cancelar reserva

### Pruebas de Seguridad

#### Protección contra Fuerza Bruta

```
Test: Intentos múltiples de login fallidos
Resultado Esperado: Bloqueo de cuenta después de 5 intentos
Resultado Obtenido: ✅ Código 423 (Locked) después de 5 intentos
Tiempo de bloqueo: 300 segundos (5 minutos)
```

#### Validación de Tokens JWT

```
Test 1: Petición sin token
Resultado: ❌ Código 401 (Unauthorized)

Test 2: Petición con token inválido
Resultado: ❌ Código 401 (Unauthorized)

Test 3: Petición con token expirado
Resultado: ❌ Código 401 (Token expired)

Test 4: Petición con token válido
Resultado: ✅ Código 200 + datos solicitados
```

### Pruebas de Integración Frontend-Backend

#### Comunicación API REST

**Endpoint probado**: `/api/tickets`

```javascript
// Test: Obtener boletos disponibles
const response = await fetch(`${VITE_API_URL}/tickets`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Resultados:
// ✅ Status 200
// ✅ Content-Type: application/json
// ✅ Estructura de datos correcta
// ✅ Tiempo de respuesta < 2 segundos
```

#### Manejo de Errores

```javascript
// Test: Conexión fallida al backend
try {
  const data = await getAvailableTickets();
} catch (error) {
  // ✅ Muestra mensaje: "No hay conexión con el servidor"
  // ✅ No causa crash de la aplicación
  // ✅ Permite reintentar la operación
}
```

### Pruebas de Compatibilidad

#### Navegadores

| Navegador | Versión | Estado |
|-----------|---------|--------|
| Chrome | 120+ | ✅ Compatible |
| Firefox | 120+ | ✅ Compatible |
| Safari | 16+ | ✅ Compatible |
| Edge | 120+ | ✅ Compatible |

#### Dispositivos

| Dispositivo | Resolución | Estado |
|-------------|-----------|--------|
| Desktop | 1920x1080 | ✅ Funcional |
| Laptop | 1366x768 | ✅ Funcional |
| Tablet | 768x1024 | ✅ Responsivo |
| Móvil | 375x667 | ✅ Responsivo |

### Cobertura de Pruebas

```
Backend (Java):
├── Controllers: Pendiente
├── Services: Pendiente
├── Security: ✅ Validado manualmente
└── Repositories: Pendiente

Frontend (React):
├── Componentes: Pendiente
├── Servicios API: ✅ Probado con Postman
├── Autenticación: ✅ Probado
└── Manejo de errores: ✅ Probado
```

---

## 🗺️ Roadmap

### Fase 1: MVP ✅ (Completado)

- [x] Autenticación con JWT
- [x] Búsqueda de rutas
- [x] Selección de asientos
- [x] Compra de boletos
- [x] Gestión de reservas
- [x] Panel de administración básico
- [x] Documentación arquitectónica (C4)
- [x] Implementación de seguridad OWASP

### Fase 2: Mejoras Core 🚧 (En progreso)

- [ ] Sistema de notificaciones por email
- [ ] Pasarela de pagos real (Stripe/PayPal)
- [ ] Generación de PDFs para boletos
- [ ] Códigos QR para validación
- [ ] Sistema de calificaciones y reseñas
- [ ] Chat de soporte en vivo

### Fase 3: Optimización 📋 (Planificado)

- [ ] Caché de consultas frecuentes
- [ ] Optimización de imágenes
- [ ] Lazy loading de componentes
- [ ] Service Workers para PWA
- [ ] Tests automatizados (Jest, JUnit)
- [ ] CI/CD con GitHub Actions

### Fase 4: Características Avanzadas 💡 (Futuro)

- [ ] Aplicación móvil nativa (React Native)
- [ ] Sistema de puntos y recompensas
- [ ] Integración con Google Maps
- [ ] Soporte multiidioma (i18n)
- [ ] Dashboard de analytics
- [ ] API pública para terceros
- [ ] Sistema de promociones y descuentos

---

## 👥 Equipo de Desarrollo

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/identicons/miguel.png" width="100px;" alt="Miguel Luna"/><br>
      <sub><b>Miguel Luna</b></sub><br>
      <sub>Desarrollo Frontend & Backend</sub><br>
      <a href="mailto:miguel.luna@example.com">✉️ Email</a> •
      <a href="https://github.com/miguel-luna">💻 GitHub</a>
    </td>
    <td align="center">
      <img src="https://github.com/identicons/anthony.png" width="100px;" alt="Anthony Gutiérrez"/><br>
      <sub><b>Anthony Gutiérrez</b></sub><br>
      <sub>Desarrollo Frontend & Seguridad</sub><br>
      <a href="mailto:anthony.gutierrez@example.com">✉️ Email</a> •
      <a href="https://github.com/anthony-gutierrez">💻 GitHub</a>
    </td>
    <td align="center">
      <img src="https://github.com/identicons/luis.png" width="100px;" alt="Luis Armijos"/><br>
      <sub><b>Luis Armijos</b></sub><br>
      <sub>Desarrollo Backend & DevOps</sub><br>
      <a href="mailto:luis.armijos@example.com">✉️ Email</a> •
      <a href="https://github.com/luis-armijos">💻 GitHub</a>
    </td>
  </tr>
</table>

### Roles y Responsabilidades

| Miembro | Responsabilidades Principales |
|---------|------------------------------|
| **Miguel Luna** | • Desarrollo de componentes React<br>• Integración con API REST<br>• Diseño de arquitectura C4<br>• Documentación técnica |
| **Anthony Gutiérrez** | • Diseño de interfaz de usuario<br>• Implementación de seguridad OWASP<br>• Autenticación JWT<br>• Testing de seguridad |
| **Luis Armijos** | • Desarrollo de API REST<br>• Configuración de Docker<br>• Gestión de base de datos<br>• Control de versiones |

### Docente Supervisor

**Edison Leonardo Coronel Romero**  
Universidad Nacional de Loja  
Carrera de Computación  
Asignatura: Desarrollo Basado en Plataformas

---

## 🤝 Contribuciones

### ¿Cómo contribuir?

Agradecemos tu interés en contribuir al proyecto. Sigue estos pasos:

1. **Fork** el repositorio
2. Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`)
3. Realiza tus cambios siguiendo los estándares de código
4. Commit tus cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
5. Push a la rama (`git push origin feature/nueva-funcionalidad`)
6. Abre un **Pull Request**

### Guías de Contribución

- Sigue los estándares de código establecidos
- Escribe mensajes de commit descriptivos
- Incluye tests para nuevas funcionalidades
- Actualiza la documentación según sea necesario
- Asegúrate de que el código compile sin errores

### Reportar Problemas

Si encuentras un bug o tienes una sugerencia:

1. Verifica que no exista un issue similar
2. Crea un nuevo issue con una descripción clara
3. Incluye pasos para reproducir el problema
4. Adjunta capturas de pantalla si es relevante

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

```
MIT License

Copyright (c) 2025/2026 Grupo 4 - Sistema de Boletos de Bus

Se concede permiso, libre de cargos, a cualquier persona que obtenga una copia
de este software y de los archivos de documentación asociados (el "Software"),
para utilizar el Software sin restricción, incluyendo sin limitación los 
derechos a usar, copiar, modificar, fusionar, publicar, distribuir, sublicenciar,
y/o vender copias del Software...
```

---

## 📞 Contacto y Soporte

### Información del Proyecto

- **Universidad**: Universidad Nacional de Loja
- **Facultad**: Facultad de la Energía, las Industrias y los Recursos Naturales No Renovables (FEIRNNR)
- **Carrera**: Computación
- **Asignatura**: Desarrollo Basado en Plataformas
- **Ciclo**: 5to A
- **Año Académico**: 2025-2026

### Canales de Comunicación

| Canal | Información |
|-------|-------------|
| **Email del equipo** | grupo4.boletos@unl.edu.ec |
| **Repositorio** | [GitHub](https://github.com/DaviYelan/Proyecto_Plataformas.git) |
| **Documentación** | [Wiki del proyecto](https://github.com/DaviYelan/Proyecto_Plataformas.git) |
| **Issues** | [Issue Tracker](https://github.com/DaviYelan/Proyecto_Plataformas.git) |

### Soporte

Para soporte técnico o consultas:

1. **Revisa la documentación** en `/docs`
2. **Busca en issues existentes** si tu problema ya fue reportado
3. **Crea un nuevo issue** con todos los detalles necesarios
4. **Contacta al equipo** via email para consultas específicas

---

## 🙏 Agradecimientos

Queremos agradecer a:

- **Universidad Nacional de Loja** por proporcionar los recursos y el espacio para el desarrollo del proyecto
- **Ing. Edison Leonardo Coronel Romero** por su guía y supervisión durante todo el proceso
- **Comunidad de desarrollo open source** por las herramientas y librerías utilizadas
- **Compañeros de clase** por su retroalimentación y apoyo

---

## 📚 Referencias y Recursos

### Documentación Oficial

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com/)

### Seguridad

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT Introduction](https://jwt.io/introduction)
- [BCrypt Documentation](https://github.com/kelektiv/node.bcrypt.js)

### Arquitectura

- [C4 Model](https://c4model.com/)
- [PlantUML](https://plantuml.com/)
- [Microservices Patterns](https://microservices.io/)

### Testing

- [Postman Learning Center](https://learning.postman.com/)
- [Jest Documentation](https://jestjs.io/)
- [JUnit 5 User Guide](https://junit.org/junit5/docs/current/user-guide/)

---

<div align="center">

### 🌟 ¡Gracias por tu interés en nuestro proyecto! 🌟

**Desarrollado con ❤️ por el Grupo 4**

Universidad Nacional de Loja • 2025 - 2026

[![Status](https://img.shields.io/badge/Status-En%20Desarrollo-yellow)]()
[![License](https://img.shields.io/badge/License-MIT-green)]()
[![GitHub](https://img.shields.io/badge/GitHub-Grupo4-blue)]()

</div>
