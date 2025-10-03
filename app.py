from flask import Flask

# Crear la aplicación Flask
app = Flask(__name__)

# Configuración básica
app.config['DEBUG'] = True

# Ruta raíz - endpoint hello
@app.route('/')
def hello():
    return {
        "message": "Hola Servidor Flask funcionando correctamente",
        "status": "success",
        "endpoint": "/"
    }

# Endpoint alternativo /hello
@app.route('/hello')
def hello_world():
    return {
        "message": "Hello World from Flask!",
        "status": "success",
        "endpoint": "/hello"
    }

# Endpoint de información del proyecto
@app.route('/info')
def project_info():
    return {
        "project": "Proyecto_Plataformas",
        "framework": "Flask",
        "version": "1.0.0",
        "description": "Servidor backend con Flask usando GitFlow",
        "status": "running"
    }

if __name__ == '__main__':
    # Ejecutar la aplicación en modo debug
    app.run(host='0.0.0.0', port=5000, debug=True)