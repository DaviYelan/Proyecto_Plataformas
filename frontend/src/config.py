import os
# URL base del backend. En contenedor use el nombre del servicio 'backend'.
# Para pruebas locales por defecto apuntamos a localhost:8099
API_URL = os.getenv("API_URL", "http://backend:8099")
