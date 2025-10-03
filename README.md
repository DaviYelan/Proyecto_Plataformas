# Proyecto de Venta de Boletos de Bus

Este proyecto permite a los usuarios registrarse, buscar rutas, seleccionar turnos y comprar o reservar boletos de manera sencilla y rápida.

## Requisitos Funcionales

| Nº Requisito | Nombre                        | Descripción                                                                                   | Prioridad |
|-------------|-------------------------------|-----------------------------------------------------------------------------------------------|-----------|
| RF01        | Registro de cuenta            | Los usuarios podrán crear una cuenta para ingresar.                                          | Alta      |
| RF02        | Inicio de sesión              | El sistema permitirá iniciar sesión con credenciales (correo y contraseña).                  | Alta      |
| RF03        | Preferencias de turnos       | Permitirá visualizar turnos frecuentes para agilizar la compra.                              | Baja      |
| RF04        | Generación de boleto         | El usuario podrá generar uno o varios boletos.                                               | Alta      |
| RF05        | Selección de ruta           | Podrá escoger una ruta disponible indicando origen y destino.                                | Alta      |
| RF06        | Selección de horario        | Podrá escoger horarios disponibles para la ruta seleccionada.                                | Alta      |
| RF07        | Previsualización de ruta    | Cada turno mostrará la ruta y horario correspondiente.                                      | Media     |
| RF08        | Elección de asientos       | Podrá seleccionar los asientos disponibles que desee.                                       | Media     |
| RF09        | Generación y cancelación   | Previsualizará el boleto y podrá comprarlo, reservarlo o cancelarlo.                         | Alta      |
| RF10        | Reservación de boleto      | Podrá reservar su boleto por un lapso de un día para comprobar la compra del mismo.         | Alta      |

## Requisitos No Funcionales

| Nº Requisito | Nombre                   | Descripción                                                                             | Prioridad |
|-------------|--------------------------|-----------------------------------------------------------------------------------------|-----------|
| RNF01       | Rendimiento             | El sistema deberá permitir la búsqueda de boletos en menos de 2 segundos.               | Alta      |
| RNF02       | Escalabilidad          | Permitirá implementar más compañías de buses y rutas a futuro.                          | Media     |
| RNF03       | Disponibilidad        | El sistema debe estar disponible el 99.9% del tiempo.                                   | Alta      |
| RNF04       | Múltiples navegadores | Compatible con Chrome, Edge, Safari y Opera.                                           | Media     |
| RNF05       | Interfaz intuitiva     | Deberá ser fácil de usar y permitir la compra sin muchos pasos.                         | Alta      |
| RNF06       | Diseño responsivo     | La interfaz deberá adaptarse correctamente en PC.                                     | Alta      |
| RNF07       | Mantenimiento         | Deberá estar bien documentado para futuros mantenimientos.                             | Media     |
| RNF08       | Seguridad              | Acceso solo mediante credenciales seguras (correo y contraseña).                        | Alta      |
| RNF09       | Sistema de reserva    | Deberá permitir reservar boletos hasta un día antes del viaje.                         | Alta      |

## Arquitectura Seleccionada

La arquitectura seleccionada es principalmente Cliente-Servidor pero con una pero con una pequeña integracion de Microservicios.

## Estandares de codificacion adoptados

Nombres de variables en camelCase
Comentarios en español
Commits con mensajes claros, en tiempo presente
Carpetas organizadas por responsabilidad

## Flujo de trabajo con GitFlow

feature/* → nuevas funcionalidades
develop → integración
main → versión de lanzamiento

## Instrucciones de Ejecucion

Clonar el repositorio:
git clone
cd nombre-del-repo

Crear un entorno virtual:
python -m venv venv

Activar el entorno virtual:
venv\Scripts\activate

Instalar dependencias:
pip install -r requirements.txt
pip install Flask

Ejecutar el servidor Flask:
python app.py

Abrir en el navegador
