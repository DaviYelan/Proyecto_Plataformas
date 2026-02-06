package com.buses.rest.apis;

import controlador.servicios.Controlador_cuenta;
import controlador.servicios.Controlador_persona;
import modelo.Cuenta;
import modelo.Persona;
import modelo.enums.Estado_cuenta;
import modelo.enums.Tipo_cuenta;
import modelo.enums.Tipo_tarifa;
import com.buses.rest.security.JwtUtil;
import org.mindrot.jbcrypt.BCrypt;
import java.security.MessageDigest;
import java.util.Base64;

import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Consumes;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.HashMap;
import java.util.Map;
import java.util.Collections;

@Path("/auth")
public class Auth_api {
    
    /**
     * Determina el tipo de tarifa basado en el correo electrónico
     * @param correo Correo electrónico del usuario
     * @return Tipo de tarifa correspondiente
     */
    private Tipo_tarifa determinarTipoTarifa(String correo) {
        if (correo == null) return Tipo_tarifa.General;
        String correoLower = correo.toLowerCase().trim();
        
        // Estudiantes universitarios con correo @unl.edu.ec
        if (correoLower.endsWith("@unl.edu.ec")) {
            return Tipo_tarifa.Estudiante;
        }
        
        // Por defecto, tarifa general
        return Tipo_tarifa.General;
    }
    
    /**
     * Crea o actualiza la persona asociada a una cuenta con el tipo de tarifa correcto
     */
    private void crearOActualizarPersona(Cuenta cuenta) {
        try {
            Controlador_persona cp = new Controlador_persona();
            controlador.tda.lista.LinkedList<Persona> personas = cp.Lista_personas();
            Persona persona = null;
            
            // Buscar si ya existe una persona con este correo
            for (int i = 0; i < personas.getSize(); i++) {
                Persona p = personas.get(i);
                if (p.getCorreo() != null && p.getCorreo().equalsIgnoreCase(cuenta.getCorreo())) {
                    persona = p;
                    break;
                }
            }
            
            Tipo_tarifa tipoTarifa = determinarTipoTarifa(cuenta.getCorreo());
            
            if (persona == null) {
                // Crear nueva persona
                persona = new Persona();
                persona.setCorreo(cuenta.getCorreo());
                persona.setTipo_tarifa(tipoTarifa);
                persona.setCuenta(cuenta);
                persona.setSaldo_disponible(0.0f);
                cp.setPersona(persona);
                cp.save();
                System.out.println("[Auth] Nueva persona creada con tipo_tarifa=" + tipoTarifa + " para correo=" + cuenta.getCorreo());
            } else {
                // Actualizar tipo de tarifa si es necesario
                if (persona.getTipo_tarifa() != tipoTarifa) {
                    persona.setTipo_tarifa(tipoTarifa);
                    cp.setPersona(persona);
                    cp.update();
                    System.out.println("[Auth] Tipo_tarifa actualizado a " + tipoTarifa + " para correo=" + cuenta.getCorreo());
                }
            }
        } catch (Exception e) {
            System.err.println("[Auth] Error al crear/actualizar persona: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    private String hashPassword(String plain) {
        try {
            // Usar BCrypt para cifrar la contraseña con un factor de trabajo de 12
            return BCrypt.hashpw(plain, BCrypt.gensalt(12));
        } catch (Exception e) {
            // En caso de error, devolver la contraseña sin cifrar como fallback
            System.err.println("Error al cifrar contraseña: " + e.getMessage());
            return plain;
        }
    }

    private boolean matchesPassword(String plain, String stored) {
        try {
            if (stored == null) return false;
            if (stored.startsWith("sha256:")) {
                String b64 = stored.substring(7);
                MessageDigest md = MessageDigest.getInstance("SHA-256");
                byte[] digest = md.digest(plain.getBytes(java.nio.charset.StandardCharsets.UTF_8));
                String candidate = Base64.getEncoder().encodeToString(digest);
                return candidate.equals(b64);
            }
            try {
                return BCrypt.checkpw(plain, stored);
            } catch (Throwable t) {
                return plain.equals(stored);
            }
        } catch (Throwable t) {
            return false;
        }
    }

    @Path("/register")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response register(Map<String, Object> body) {
        HashMap<String, Object> response = new HashMap<>();
        try {
            String correo = (String) body.get("correo");
            String contrasenia = (String) body.get("contrasenia");
            String tipo = (String) body.getOrDefault("tipo_cuenta", "Cliente");
            if (correo == null || contrasenia == null) {
                response.put("mensaje", "correo y contrasenia requeridos");
                return Response.status(Response.Status.BAD_REQUEST).entity(response).build();
            }
            Controlador_cuenta cc = new Controlador_cuenta();
            // crear cuenta
            Cuenta cuenta = new Cuenta();
            cuenta.setCorreo(correo);
            cuenta.setContrasenia(hashPassword(contrasenia));
            cuenta.setEstado_cuenta(Estado_cuenta.Activo);
            cuenta.setTipo_cuenta(Tipo_cuenta.valueOf(tipo));
            cc.setCuenta(cuenta);
            if (cc.save()) {
                // Crear persona con tipo de tarifa automático
                crearOActualizarPersona(cuenta);
                
                // Agregar información de tipo de tarifa en la respuesta
                Tipo_tarifa tipoTarifa = determinarTipoTarifa(correo);
                response.put("mensaje", "Cuenta creada");
                response.put("cuenta", cuenta);
                response.put("tipo_tarifa", tipoTarifa.name());
                if (tipoTarifa == Tipo_tarifa.Estudiante) {
                    response.put("descuento_info", "Descuento de estudiante (30%) aplicado automáticamente");
                }
                return Response.status(Response.Status.CREATED).entity(response).build();
            }
            response.put("mensaje", "Error al crear cuenta");
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(response).build();
        } catch (Exception e) {
            response.put("mensaje", "Error: " + e.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(response).build();
        }
    }

    @Path("/login")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response login(Map<String, Object> body) {
        HashMap<String, Object> response = new HashMap<>();
        try {
            String correo = (String) body.get("correo");
            String contrasenia = (String) body.get("contrasenia");
            // normalize inputs: avoid accidental surrounding spaces or invisible chars
            if (correo != null) correo = correo.trim();
            if (contrasenia != null) contrasenia = contrasenia.trim();
            if (correo == null || contrasenia == null) {
                response.put("mensaje", "correo y contrasenia requeridos");
                return Response.status(Response.Status.BAD_REQUEST).entity(response).build();
            }
            Controlador_cuenta cc = new Controlador_cuenta();
            // buscar cuenta por correo
            controlador.tda.lista.LinkedList<Cuenta> cuentas = cc.Lista_cuentas();
            for (int i = 0; i < cuentas.getSize(); i++) {
                Cuenta c = cuentas.get(i);
                if (c.getCorreo().equalsIgnoreCase(correo)) {
                    // Lockout policy (configurable via env)
                    int maxAttempts = 5;
                    long lockSeconds = 300L; // 5 minutes
                    String maxAttemptsEnv = System.getenv("AUTH_MAX_ATTEMPTS");
                    String lockSecondsEnv = System.getenv("AUTH_LOCK_SECONDS");
                    if (maxAttemptsEnv != null) {
                        try { maxAttempts = Integer.parseInt(maxAttemptsEnv); } catch (NumberFormatException ignored) {}
                    }
                    if (lockSecondsEnv != null) {
                        try { lockSeconds = Long.parseLong(lockSecondsEnv); } catch (NumberFormatException ignored) {}
                    }

                    long now = System.currentTimeMillis();
                    if (c.getLockedUntil() != null && c.getLockedUntil() > now) {
                        long remainingMs = c.getLockedUntil() - now;
                        long remainingSec = remainingMs / 1000L;
                        response.put("mensaje", "Cuenta bloqueada. Intente de nuevo en " + remainingSec + " segundos");
                        response.put("locked_until", c.getLockedUntil());
                        return Response.status(423).entity(response).build();
                    }

                    // safe logging: record attempt with email and password length only (do NOT log the password)
                    System.out.println("[Auth] Login attempt for correo='" + c.getCorreo() + "' passwordLength=" + (contrasenia == null ? 0 : contrasenia.length()));

                    if (!matchesPassword(contrasenia, c.getContrasenia())) {
                        // incorrect password: increment failedAttempts and possibly lock
                        int attempts = c.getFailedAttempts() == null ? 0 : c.getFailedAttempts();
                        attempts += 1;
                        c.setFailedAttempts(attempts);
                        if (attempts >= maxAttempts) {
                            long lockedUntil = now + lockSeconds * 1000L;
                            c.setLockedUntil(lockedUntil);
                        }
                        // persist changes
                        try {
                            cc.setCuenta(c);
                            cc.update();
                        } catch (Exception ex) {
                            // log and continue, but still return unauthorized
                        }

                        if (c.getLockedUntil() != null && c.getLockedUntil() > now) {
                            long remainingSec = (c.getLockedUntil() - now) / 1000L;
                            response.put("mensaje", "Cuenta bloqueada por demasiados intentos. Intente de nuevo en " + remainingSec + " segundos");
                            return Response.status(423).entity(response).build();
                        }

                        response.put("mensaje", "Credenciales inválidas");
                        response.put("failedAttempts", c.getFailedAttempts());
                        return Response.status(Response.Status.UNAUTHORIZED).entity(response).build();
                    }

                    // generar token
                    Map<String, Object> claims = new HashMap<>();
                    claims.put("roles", Collections.singletonList(c.getTipo_cuenta().name()));
                    String token = JwtUtil.generateToken(c.getCorreo(), claims);
                    
                    // successful login: reset counters, set token, and persist
                    c.setFailedAttempts(0);
                    c.setLockedUntil(0L);
                    c.setToken(token);
                    try {
                        cc.setCuenta(c);
                        cc.update();
                    } catch (Exception ex) {
                        // ignore persistence error for login success
                    }
                    
                    // Actualizar persona con tipo de tarifa correcto
                    crearOActualizarPersona(c);
                    
                    // Agregar información de tipo de tarifa en la respuesta
                    Tipo_tarifa tipoTarifa = determinarTipoTarifa(c.getCorreo());
                    response.put("token", token);
                    response.put("user", c);
                    response.put("tipo_tarifa", tipoTarifa.name());
                    if (tipoTarifa == Tipo_tarifa.Estudiante) {
                        response.put("descuento_info", "Tienes descuento de estudiante (30%) en tus compras");
                    }
                    return Response.ok(response).build();
                }
            }
            response.put("mensaje", "Cuenta no encontrada");
            return Response.status(Response.Status.NOT_FOUND).entity(response).build();
        } catch (Exception e) {
            response.put("mensaje", "Error: " + e.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(response).build();
        }
    }
}
