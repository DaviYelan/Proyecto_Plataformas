# Integración de la Aplicación Móvil con el Backend

Este README describe la integración de la aplicación móvil de **venta de boletos de buses** con el backend del proyecto mediante una **API REST**, detallando los endpoints consumidos, ejemplos de solicitudes y respuestas, evidencias visuales y el manejo de errores implementado.

---

## 1. Endpoints Consumidos

### 🔹 Obtener boletos disponibles
- **Método:** `GET`
- **Endpoint:** `/api/tickets`
- **Descripción:** Obtiene la lista de boletos disponibles para la venta según la ruta y disponibilidad de buses.
- **Uso en la app:** Vista de *Búsqueda de viajes*.

---

## 2. Ejemplo de Solicitud y Respuesta

### 📤 Solicitud
```http
GET /api/tickets HTTP/1.1
Host: api.backend-boletos.com
Authorization: Bearer <token_de_autenticacion>
Content-Type: application/json
```

### 📥 Respuesta Exitosa (200 OK)
```json
{
  "status": "success",
  "data": [
    {
      "id": 12,
      "ruta": "Quito - Guayaquil",
      "fecha": "2026-01-30",
      "hora": "08:30",
      "asientos_disponibles": 15,
      "precio": 12.50
    },
    {
      "id": 13,
      "ruta": "Quito - Cuenca",
      "fecha": "2026-01-30",
      "hora": "10:00",
      "asientos_disponibles": 8,
      "precio": 15.00
    }
  ]
}
```

### 📥 Respuesta de Error (401 Unauthorized)
```json
{
  "status": "error",
  "message": "Sesión expirada o token inválido"
}
```

## 3. Evidencia del Manejo de Errores

La aplicación móvil implementa manejo de errores utilizando bloques `try-catch` y validación de códigos de estado HTTP.

### 🔸 Errores manejados
- ❌ **Error de red:** servidor no disponible o sin conexión a internet.
- ❌ **Errores 4xx:** sesión expirada, token inválido.
- ❌ **Errores 5xx:** fallos internos del servidor.

### 🧠 Ejemplo de Lógica Implementada (pseudocódigo)
```javascript
try {
  const response = await getAvailableTickets();
  setTickets(response.data);
} catch (error) {
  if (!error.response) {
    showAlert("No hay conexión con el servidor de boletos");
  } else if (error.response.status === 401) {
    showAlert("Sesión expirada. Por favor inicie sesión nuevamente");
  } else {
    showAlert("Ocurrió un error inesperado");
  }
}
```
---

## 5. Conclusión Técnica

La integración móvil–backend se realizó exitosamente, permitiendo que la aplicación consuma datos en tiempo real desde la API REST del proyecto. El manejo adecuado de errores garantiza una experiencia de usuario estable y confiable, incluso ante condiciones de red adversas o fallos del servidor. La documentación incluida facilita el mantenimiento y escalabilidad futura del sistema.

Por: 

Miguel Luna

Luis Armijos

Anthony Gutierrez
