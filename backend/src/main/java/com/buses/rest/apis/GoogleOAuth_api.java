package com.buses.rest.apis;

import com.google.gson.Gson;
import controlador.servicios.Controlador_cuenta;
import controlador.servicios.Controlador_persona;
import modelo.Cuenta;
import modelo.Persona;
import com.buses.rest.security.JwtUtil;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Consumes;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Path("/auth/google")
public class GoogleOAuth_api {

    private static final Gson gson = new Gson();
    private static final String GOOGLE_CLIENT_ID = "GOOGLE_CLIENT_ID";

    /**
     * @param redirectTo
     * @return
     * @throws Exception 
     */
    @GET
    @Path("/start")
    @Produces(MediaType.APPLICATION_JSON)
    public Response start(@QueryParam("redirectTo") String redirectTo) throws Exception {
        String clientId = System.getenv(GOOGLE_CLIENT_ID);
        if (clientId == null) clientId = System.getProperty(GOOGLE_CLIENT_ID);
        if (clientId == null) clientId = System.getProperty(GOOGLE_CLIENT_ID);
        String redirectUri = System.getenv("GOOGLE_REDIRECT_URI");
        if (redirectUri == null) redirectUri = System.getProperty("GOOGLE_REDIRECT_URI");
        if (clientId == null || redirectUri == null) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Google OAuth not configured").build();
        }
        String state = UUID.randomUUID().toString();
        // For simplicity store state in a temporary cookie-less way: return as param (frontend should store it client-side)
        String scope = URLEncoder.encode("openid email profile", "UTF-8");
        String url = "https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=" + clientId
                + "&redirect_uri=" + URLEncoder.encode(redirectUri, StandardCharsets.UTF_8.name())
                + "&scope=" + scope + "&state=" + state + "&access_type=online&prompt=select_account";
        // return URL to frontend so it can redirect (avoids server-side sessions in this simple implementation)
        Map<String, String> resp = new HashMap<>();
        resp.put("url", url);
        resp.put("state", state);
        if (redirectTo != null) resp.put("redirect_to", redirectTo);
        return Response.ok(resp).build();
    }

    @GET
    @Path("/callback")
    @Produces(MediaType.APPLICATION_JSON)
    public Response callback(@QueryParam("code") String code, @QueryParam("state") String state, @QueryParam("error") String error) {
        // Debug incoming query params
        System.out.println("[GoogleOAuth_api] Callback received: code=" + (code == null ? "<null>" : code) + ", state=" + (state == null ? "<null>" : state) + ", error=" + (error == null ? "<null>" : error));
        if (error != null) {
            System.out.println("[GoogleOAuth_api] OAuth error parameter present: " + error);
            return Response.status(Response.Status.BAD_REQUEST).entity(Collections.singletonMap("error", error)).build();
        }
        if (code == null) {
            System.out.println("[GoogleOAuth_api] Missing 'code' in callback");
            return Response.status(Response.Status.BAD_REQUEST).entity(Collections.singletonMap("error", "missing_code")).build();
        }

        String clientId = System.getenv("GOOGLE_CLIENT_ID");
        String clientSecret = System.getenv("GOOGLE_CLIENT_SECRET");
        String redirectUri = System.getenv("GOOGLE_REDIRECT_URI");
        if (clientId == null || clientSecret == null || redirectUri == null) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(Collections.singletonMap("error", "Google OAuth not configured" )).build();
        }

        try {
            // Exchange code for tokens
            String body = "code=" + URLEncoder.encode(code, "UTF-8")
                    + "&client_id=" + URLEncoder.encode(clientId, "UTF-8")
                    + "&client_secret=" + URLEncoder.encode(clientSecret, "UTF-8")
                    + "&redirect_uri=" + URLEncoder.encode(redirectUri, "UTF-8")
                    + "&grant_type=authorization_code";
            // Exchange code for tokens using HttpURLConnection
            URL tokenUrl = new URL("https://oauth2.googleapis.com/token");
            HttpURLConnection conn = (HttpURLConnection) tokenUrl.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            conn.setDoOutput(true);
            try (java.io.OutputStream os = conn.getOutputStream()) {
                byte[] input = body.getBytes(java.nio.charset.StandardCharsets.UTF_8);
                os.write(input, 0, input.length);
            }
            int status = conn.getResponseCode();
            java.io.InputStream is = status >= 200 && status < 400 ? conn.getInputStream() : conn.getErrorStream();
            String respBody;
            try (java.io.BufferedReader br = new java.io.BufferedReader(new java.io.InputStreamReader(is, java.nio.charset.StandardCharsets.UTF_8))) {
                StringBuilder sb = new StringBuilder();
                String line;
                while ((line = br.readLine()) != null) sb.append(line);
                respBody = sb.toString();
            }
            if (status != 200) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "token_exchange_failed");
                errorResponse.put("detail", respBody);
                return Response.status(Response.Status.BAD_GATEWAY).entity(errorResponse).build();
            }
            Map<String, Object> tokenResp = gson.fromJson(respBody, Map.class);
            String idToken = (String) tokenResp.get("id_token");
            String accessToken = (String) tokenResp.get("access_token");

            // fetch userinfo
            // Fetch userinfo using HttpURLConnection
            URL userInfoUrl = new URL("https://openidconnect.googleapis.com/v1/userinfo");
            HttpURLConnection uconn = (HttpURLConnection) userInfoUrl.openConnection();
            uconn.setRequestMethod("GET");
            uconn.setRequestProperty("Authorization", "Bearer " + accessToken);
            int ustatus = uconn.getResponseCode();
            java.io.InputStream uis = ustatus >= 200 && ustatus < 400 ? uconn.getInputStream() : uconn.getErrorStream();
            String urespBody;
            try (java.io.BufferedReader br = new java.io.BufferedReader(new java.io.InputStreamReader(uis, java.nio.charset.StandardCharsets.UTF_8))) {
                StringBuilder sb = new StringBuilder();
                String line;
                while ((line = br.readLine()) != null) sb.append(line);
                urespBody = sb.toString();
            }
            if (ustatus != 200) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "userinfo_failed");
                errorResponse.put("detail", urespBody);
                return Response.status(Response.Status.BAD_GATEWAY).entity(errorResponse).build();
            }
            Map<String, Object> userInfo = gson.fromJson(urespBody, Map.class);
            String email = (String) userInfo.get("email");
            String googleId = (String) userInfo.get("sub");

            // find or create account
            Controlador_cuenta cc = new Controlador_cuenta();
            controlador.tda.lista.LinkedList<Cuenta> cuentas = cc.Lista_cuentas();
            Cuenta matched = null;
            for (int i = 0; i < cuentas.getSize(); i++) {
                Cuenta c = cuentas.get(i);
                if (email != null && c.getCorreo() != null && c.getCorreo().equalsIgnoreCase(email)) {
                    matched = c;
                    break;
                }
            }

            if (matched == null) {
                // create Persona and Cuenta
                Controlador_persona cp = new Controlador_persona();
                Persona p = new Persona();
                p.setNumero_identificacion("");
                p.setNombre((String) userInfo.getOrDefault("given_name", ""));
                p.setApellido((String) userInfo.getOrDefault("family_name", ""));
                p.setCorreo(email != null ? email : "");
                cp.setPersona(p);
                cp.save();

                Cuenta nc = new Cuenta();
                nc.setCorreo(email != null ? email : "");
                nc.setContrasenia("");
                nc.setEstado_cuenta(modelo.enums.Estado_cuenta.Activo);
                nc.setTipo_cuenta(modelo.enums.Tipo_cuenta.Cliente);
                cc.setCuenta(nc);
                cc.save();
                matched = nc;
            }

            // generate JWT and return
            Map<String, Object> claims = new HashMap<>();
            claims.put("roles", java.util.Collections.singletonList(matched.getTipo_cuenta().name()));
            String token = JwtUtil.generateToken(matched.getCorreo(), claims);
            // Log token and correo to help debugging OAuth flow in development (do NOT log in production)
            System.out.println("[GoogleOAuth_api] Generated token for user=" + matched.getCorreo());
            System.out.println("[GoogleOAuth_api] token_preview=" + (token != null ? token.substring(0, Math.min(token.length(), 40)) : "null"));
            // try to obtain the saved persona (if any) so frontend can set session user without an extra API call
            Persona personaSaved = null;
            try {
                Controlador_persona cpForReturn = new Controlador_persona();
                // attempt to find persona by correo in the list (fallback if controller didn't expose last saved)
                for (int i = 0; i < cpForReturn.Lista_personas().getSize(); i++) {
                    Persona ptemp = cpForReturn.Lista_personas().get(i);
                    if (ptemp.getCorreo() != null && ptemp.getCorreo().equalsIgnoreCase(matched.getCorreo())) {
                        personaSaved = ptemp;
                        break;
                    }
                }
            } catch (Exception ex) {
                System.out.println("[GoogleOAuth_api] Warning: could not load persona for return: " + ex.getMessage());
            }
        // Instead of returning JSON, post the token to the frontend endpoint
        // so the frontend can store the token in session securely.
        String correoForForm = matched.getCorreo() != null ? matched.getCorreo() : "";
        String personaJsonEncoded = "";
            if (personaSaved != null) {
            try {
                // Ensure the persona JSON includes a 'cuenta' snippet with tipo_cuenta and correo
                String personaJson = gson.toJson(personaSaved);
                java.util.Map personaMap = gson.fromJson(personaJson, java.util.Map.class);
                java.util.Map cuentaMap = new java.util.HashMap();
                cuentaMap.put("tipo_cuenta", matched.getTipo_cuenta().name());
                cuentaMap.put("correo", matched.getCorreo() != null ? matched.getCorreo() : "");
                personaMap.put("cuenta", cuentaMap);
                String personaWithCuenta = gson.toJson(personaMap);
                personaJsonEncoded = URLEncoder.encode(personaWithCuenta, "UTF-8");
                System.out.println("[GoogleOAuth_api] persona_preview=" + (personaWithCuenta.length() > 200 ? personaWithCuenta.substring(0, 200) + "..." : personaWithCuenta));
            } catch (Exception ex) {
                System.out.println("[GoogleOAuth_api] Error encoding persona JSON: " + ex.getMessage());
            }
        }
        String html = "<!doctype html><html><head><meta charset=\"utf-8\"></head><body>"
            + "<form id=\"f\" method=\"post\" action=\"http://localhost:5000/auth/google/receive\">"
            + "<input type=\"hidden\" name=\"token\" value=\"" + token + "\"/>"
            + "<input type=\"hidden\" name=\"correo\" value=\"" + correoForForm + "\"/>"
            + "<input type=\"hidden\" name=\"persona_json_encoded\" value=\"" + personaJsonEncoded + "\"/>"
            + "</form><script>document.getElementById('f').submit();</script></body></html>";
        System.out.println("[GoogleOAuth_api] Returning HTML auto-post to frontend (length=" + html.length() + ")");
        return Response.ok(html, MediaType.TEXT_HTML).build();

        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    @POST
    @Path("/receive")
    @Consumes(MediaType.WILDCARD)
    @Produces(MediaType.APPLICATION_JSON)
    public Response receive(String requestBody) {
        try {
            Map<String, Object> payload = new HashMap<>();
            if (requestBody != null && !requestBody.trim().isEmpty()) {
                try {
                    payload = gson.fromJson(requestBody, Map.class);
                } catch (Exception ex) {
                    // fall back to empty map if JSON parse fails
                    payload = new HashMap<>();
                }
            }
            if (payload == null || !payload.containsKey("token")) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity(Collections.singletonMap("error", "missing_token"))
                        .build();
            }
            String idToken = payload.get("token").toString();
            if (idToken == null || idToken.trim().isEmpty()) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity(Collections.singletonMap("error", "empty_token"))
                        .build();
            }

            // Validate id_token with Google's tokeninfo endpoint
            String tokenInfoUrlStr = "https://oauth2.googleapis.com/tokeninfo?id_token=" + URLEncoder.encode(idToken, "UTF-8");
            URL tokenInfoUrl = new URL(tokenInfoUrlStr);
            HttpURLConnection tconn = (HttpURLConnection) tokenInfoUrl.openConnection();
            tconn.setRequestMethod("GET");
            int tstatus = tconn.getResponseCode();
            java.io.InputStream tis = tstatus >= 200 && tstatus < 400 ? tconn.getInputStream() : tconn.getErrorStream();
            String tresp;
            try (java.io.BufferedReader br = new java.io.BufferedReader(new java.io.InputStreamReader(tis, java.nio.charset.StandardCharsets.UTF_8))) {
                StringBuilder sb = new StringBuilder();
                String line;
                while ((line = br.readLine()) != null) sb.append(line);
                tresp = sb.toString();
            }
            if (tstatus != 200) {
                Map<String, Object> err = new HashMap<>();
                err.put("error", "invalid_token");
                err.put("detail", tresp);
                return Response.status(Response.Status.BAD_REQUEST).entity(err).build();
            }
            Map<String, Object> tokenInfo = gson.fromJson(tresp, Map.class);

            // Validate audience
            String clientId = System.getenv("GOOGLE_CLIENT_ID");
            if (clientId == null) clientId = System.getProperty("GOOGLE_CLIENT_ID");
            if (clientId != null) {
                Object aud = tokenInfo.get("aud");
                if (aud == null || !clientId.equals(aud.toString())) {
                    return Response.status(Response.Status.UNAUTHORIZED)
                            .entity(Collections.singletonMap("error", "invalid_audience"))
                            .build();
                }
            }

            String email = tokenInfo.get("email") != null ? tokenInfo.get("email").toString() : "";
            String givenName = tokenInfo.get("given_name") != null ? tokenInfo.get("given_name").toString() : "";
            String familyName = tokenInfo.get("family_name") != null ? tokenInfo.get("family_name").toString() : "";
            String picture = tokenInfo.get("picture") != null ? tokenInfo.get("picture").toString() : "";

            // find or create account (Cuenta) by email
            Controlador_cuenta cc = new Controlador_cuenta();
            controlador.tda.lista.LinkedList<Cuenta> cuentas = cc.Lista_cuentas();
            Cuenta matched = null;
            for (int i = 0; i < cuentas.getSize(); i++) {
                Cuenta c = cuentas.get(i);
                if (email != null && c.getCorreo() != null && c.getCorreo().equalsIgnoreCase(email)) {
                    matched = c;
                    break;
                }
            }

            if (matched == null) {
                // create Persona and Cuenta
                Controlador_persona cp = new Controlador_persona();
                Persona p = new Persona();
                p.setNumero_identificacion("");
                p.setNombre(givenName != null ? givenName : "");
                p.setApellido(familyName != null ? familyName : "");
                p.setCorreo(email != null ? email : "");
                // use placeholder fecha if backend expects one
                try { p.setFecha_nacimiento("01/01/1990"); } catch (Exception ex) { /* ignore */ }
                cp.setPersona(p);
                cp.save();

                Cuenta nc = new Cuenta();
                nc.setCorreo(email != null ? email : "");
                nc.setContrasenia("");
                nc.setEstado_cuenta(modelo.enums.Estado_cuenta.Activo);
                nc.setTipo_cuenta(modelo.enums.Tipo_cuenta.Cliente);
                cc.setCuenta(nc);
                cc.save();
                matched = nc;
            }

            // generate internal JWT
            Map<String, Object> claims = new HashMap<>();
            claims.put("roles", java.util.Collections.singletonList(matched.getTipo_cuenta().name()));
            String token = JwtUtil.generateToken(matched.getCorreo(), claims);

            // Prepare response JSON as requested
            Map<String, Object> usuario = new HashMap<>();
            usuario.put("nombre", (givenName + (familyName != null && !familyName.isEmpty() ? " " + familyName : "")).trim());
            usuario.put("correo", email);
            usuario.put("foto", picture != null ? picture : "");
            String rolStr = "usuario";
            try {
                if (matched.getTipo_cuenta() != null && matched.getTipo_cuenta().name().equalsIgnoreCase("Administrador")) {
                    rolStr = "admin";
                }
            } catch (Exception ex) { /* ignore */ }
            usuario.put("rol", rolStr);

            Map<String, Object> resp = new HashMap<>();
            resp.put("mensaje", "Autenticación con Google exitosa");
            resp.put("usuario", usuario);
            resp.put("token", token);
            return Response.ok(resp).build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(Collections.singletonMap("error", e.getMessage()))
                    .build();
        }
    }
}
