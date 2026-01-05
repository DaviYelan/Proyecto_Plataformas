# 🚌 Sistema de Venta y Reserva de Boletos de Bus

## 📌 Descripción del Proyecto
Este proyecto consiste en el desarrollo de un **sistema web para la venta y reserva de boletos de bus**, que permite a los usuarios registrarse, autenticarse, buscar rutas, seleccionar turnos, elegir asientos y gestionar la compra o reserva de boletos de manera rápida, intuitiva y segura.

El sistema integra un **frontend web responsivo** conectado a un **backend mediante una API REST**, siguiendo buenas prácticas de desarrollo, principios de usabilidad, accesibilidad y una arquitectura basada principalmente en **Cliente–Servidor con integración de microservicios**.

---

## 📑 Tabla de Contenidos
- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Planteamiento del Problema](#-planteamiento-del-problema)
- [Objetivos](#-objetivos)
  - [Objetivo General](#objetivo-general)
  - [Objetivos Específicos](#objetivos-específicos)
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Funcionalidades Principales](#-funcionalidades-principales)
- [Herramientas y Tecnologías](#-herramientas-y-tecnologías)
- [Requisitos del Sistema](#-requisitos-del-sistema)
- [Estándares de Codificación](#-estándares-de-codificación)
- [Flujo de Trabajo con GitFlow](#-flujo-de-trabajo-con-gitflow)
- [Instalación y Uso](#-instalación-y-uso)
- [Resultados y Conclusiones](#-resultados-y-conclusiones)

---

## ❓ Planteamiento del Problema
La gestión tradicional de venta de boletos de bus suele presentar **procesos lentos**, dependencia de atención presencial, escasa disponibilidad de información en tiempo real y poca flexibilidad para reservas anticipadas.

Ante esta problemática, se plantea la necesidad de un **sistema web accesible y eficiente** que permita a los usuarios gestionar sus viajes de forma autónoma, reduciendo tiempos de espera y mejorando la experiencia general del cliente.

---

## 🎯 Objetivos

### Objetivo General
Desarrollar un sistema web funcional y responsivo que permita la **venta y reserva de boletos de bus**, integrando el frontend con el backend mediante una API REST y aplicando estándares modernos de desarrollo web.

### Objetivos Específicos
- Implementar una interfaz web intuitiva y accesible.
- Permitir el registro y autenticación segura de usuarios.
- Facilitar la búsqueda de rutas, horarios y disponibilidad de asientos.
- Integrar el sistema con un backend mediante servicios REST.
- Aplicar principios de diseño responsivo y accesibilidad (WAI-ARIA).
- Documentar la arquitectura del sistema utilizando el modelo C4.

---

## 🏗️ Arquitectura del Sistema
El sistema utiliza principalmente una **arquitectura Cliente–Servidor**, con una **integración parcial de microservicios** para mejorar la escalabilidad y modularidad.

### Componentes principales:
- **Frontend Web**: Interfaz de usuario desarrollada con arquitectura basada en componentes.
- **Backend**: API REST encargada de la lógica de negocio, autenticación y gestión de datos.
- **Base de Datos**: Almacenamiento de usuarios, rutas, horarios, boletos y reservas.
- **Contenedores Docker**: Ejecución de microservicios y backend.

La arquitectura está documentada mediante **diagramas C4** (Contexto, Contenedores, Componentes y Código), ubicados en el directorio `/docs/architecture/`.

---

## ⚙️ Funcionalidades Principales

### Requisitos Funcionales

| Código | Funcionalidad | Descripción | Prioridad |
|------|--------------|------------|-----------|
| RF01 | Registro de cuenta | Creación de cuentas de usuario | Alta |
| RF02 | Inicio de sesión | Autenticación por correo y contraseña | Alta |
| RF03 | Preferencias de turnos | Visualización de turnos frecuentes | Baja |
| RF04 | Generación de boletos | Compra de uno o varios boletos | Alta |
| RF05 | Selección de ruta | Elección de origen y destino | Alta |
| RF06 | Selección de horario | Visualización de horarios disponibles | Alta |
| RF07 | Previsualización | Vista previa de ruta y horario | Media |
| RF08 | Elección de asientos | Selección de asientos disponibles | Media |
| RF09 | Compra / Reserva / Cancelación | Gestión completa del boleto | Alta |
| RF10 | Reserva temporal | Reserva válida por un día | Alta |

---

## 🧰 Herramientas y Tecnologías

| Categoría | Tecnologías |
|---------|-------------|
| Frontend | React, HTML5, CSS3, JavaScript |
| Estilos | Tailwind CSS / CSS Modules |
| Backend | API REST |
| Comunicación | Axios / Fetch API |
| Contenedores | Docker |
| Arquitectura | Modelo C4 |
| Diagramas | PlantUML / Mermaid / Draw.io |
| Control de versiones | Git, GitFlow, GitKraken |

---

## 💻 Requisitos del Sistema

| Requisito | Descripción |
|----------|-------------|
| Navegador | Chrome, Edge, Safari u Opera |
| Disponibilidad | 99.9% |
| Rendimiento | Respuesta menor a 2 segundos |
| Seguridad | Acceso mediante credenciales seguras |
| Diseño | Interfaz responsiva |
| Compatibilidad | Equipos de escritorio |
| Mantenimiento | Código documentado |

---

## 📝 Estándares de Codificación
- Nombres de variables en **camelCase**
- Comentarios en **español**
- Commits descriptivos y en tiempo presente
- Organización de carpetas por responsabilidad
- Componentes React modulares y reutilizables

---

## 🌱 Flujo de Trabajo con GitFlow
- `main` → versión estable
- `develop` → integración de funcionalidades
- `feature/*` → desarrollo de nuevas características

---

## ▶️ Instalación y Uso

### Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd nombre-del-repo

Backend

python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
pip install Flask
python app.py

Frontend

cd frontend
npm install
npm run dev

Acceso

Abrir el navegador y acceder a la URL indicada por el servidor frontend.
