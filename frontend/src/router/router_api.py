from flask import Blueprint, jsonify, request
from ..config import API_URL
import requests

router_api = Blueprint("router_api", __name__)

def proxy_request(method, endpoint, data=None):
    try:
        url = f"{API_URL}{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if method == 'GET':
            response = requests.get(url, headers=headers, timeout=10)
        elif method == 'POST':
            response = requests.post(url, json=data, headers=headers, timeout=10)
        elif method == 'PUT':
            response = requests.put(url, json=data, headers=headers, timeout=10)
        elif method == 'DELETE':
            response = requests.delete(url, headers=headers, timeout=10)
        else:
            return jsonify({"error": "Método no soportado"}), 400
            
        return response.json(), response.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500


# ========== COOPERATIVAS ==========
@router_api.route("/api/cooperativa/lista", methods=["GET"])
def get_cooperativas():
    result, status = proxy_request('GET', '/api/cooperativa/lista')
    return jsonify(result), status

@router_api.route("/api/cooperativa/guardar", methods=["POST"])
def save_cooperativa():
    result, status = proxy_request('POST', '/api/cooperativa/guardar', request.json)
    return jsonify(result), status

@router_api.route("/api/cooperativa/actualizar", methods=["PUT"])
def update_cooperativa():
    result, status = proxy_request('PUT', '/api/cooperativa/actualizar', request.json)
    return jsonify(result), status

@router_api.route("/api/cooperativa/eliminar/<int:id>", methods=["DELETE"])
def delete_cooperativa(id):
    result, status = proxy_request('DELETE', f'/api/cooperativa/eliminar/{id}')
    return jsonify(result), status


# ========== BUSES ==========
@router_api.route("/api/bus/lista", methods=["GET"])
def get_buses():
    result, status = proxy_request('GET', '/api/bus/lista')
    return jsonify(result), status

@router_api.route("/api/bus/guardar", methods=["POST"])
def save_bus():
    result, status = proxy_request('POST', '/api/bus/guardar', request.json)
    return jsonify(result), status

@router_api.route("/api/bus/actualizar", methods=["PUT"])
def update_bus():
    result, status = proxy_request('PUT', '/api/bus/actualizar', request.json)
    return jsonify(result), status

@router_api.route("/api/bus/eliminar/<int:id>", methods=["DELETE"])
def delete_bus(id):
    result, status = proxy_request('DELETE', f'/api/bus/eliminar/{id}')
    return jsonify(result), status


# ========== RUTAS ==========
@router_api.route("/api/ruta/lista", methods=["GET"])
def get_rutas():
    result, status = proxy_request('GET', '/api/ruta/lista')
    return jsonify(result), status

@router_api.route("/api/ruta/guardar", methods=["POST"])
def save_ruta():
    result, status = proxy_request('POST', '/api/ruta/guardar', request.json)
    return jsonify(result), status

@router_api.route("/api/ruta/actualizar", methods=["PUT"])
def update_ruta():
    result, status = proxy_request('PUT', '/api/ruta/actualizar', request.json)
    return jsonify(result), status

@router_api.route("/api/ruta/eliminar/<int:id>", methods=["DELETE"])
def delete_ruta(id):
    result, status = proxy_request('DELETE', f'/api/ruta/eliminar/{id}')
    return jsonify(result), status


# ========== HORARIOS ==========
@router_api.route("/api/horario/lista", methods=["GET"])
def get_horarios():
    result, status = proxy_request('GET', '/api/horario/lista')
    return jsonify(result), status

@router_api.route("/api/horario/guardar", methods=["POST"])
def save_horario():
    result, status = proxy_request('POST', '/api/horario/guardar', request.json)
    return jsonify(result), status

@router_api.route("/api/horario/eliminar/<int:id>", methods=["DELETE"])
def delete_horario(id):
    result, status = proxy_request('DELETE', f'/api/horario/eliminar/{id}')
    return jsonify(result), status


# ========== ESCALAS ==========
@router_api.route("/api/escala/lista", methods=["GET"])
def get_escalas():
    result, status = proxy_request('GET', '/api/escala/lista')
    return jsonify(result), status

@router_api.route("/api/escala/guardar", methods=["POST"])
def save_escala():
    result, status = proxy_request('POST', '/api/escala/guardar', request.json)
    return jsonify(result), status

@router_api.route("/api/escala/eliminar/<int:id>", methods=["DELETE"])
def delete_escala(id):
    result, status = proxy_request('DELETE', f'/api/escala/eliminar/{id}')
    return jsonify(result), status


# ========== DESCUENTOS ==========
@router_api.route("/api/descuento/lista", methods=["GET"])
def get_descuentos():
    result, status = proxy_request('GET', '/api/descuento/lista')
    return jsonify(result), status

@router_api.route("/api/descuento/guardar", methods=["POST"])
def save_descuento():
    result, status = proxy_request('POST', '/api/descuento/guardar', request.json)
    return jsonify(result), status

@router_api.route("/api/descuento/eliminar/<int:id>", methods=["DELETE"])
def delete_descuento(id):
    result, status = proxy_request('DELETE', f'/api/descuento/eliminar/{id}')
    return jsonify(result), status


# ========== PERSONAS/CLIENTES ==========
@router_api.route("/api/persona/lista", methods=["GET"])
def get_personas():
    result, status = proxy_request('GET', '/api/persona/lista')
    return jsonify(result), status

@router_api.route("/api/persona/guardar", methods=["POST"])
def save_persona():
    result, status = proxy_request('POST', '/api/persona/guardar', request.json)
    return jsonify(result), status

@router_api.route("/api/persona/eliminar/<int:id>", methods=["DELETE"])
def delete_persona(id):
    result, status = proxy_request('DELETE', f'/api/persona/eliminar/{id}')
    return jsonify(result), status


# ========== BOLETOS ==========
@router_api.route("/api/boleto/lista", methods=["GET"])
def get_boletos():
    result, status = proxy_request('GET', '/api/boleto/lista')
    return jsonify(result), status
