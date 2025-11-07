package com.buses.rest.security;

import io.jsonwebtoken.Claims;
import javax.annotation.Priority;
import javax.ws.rs.Priorities;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.container.ResourceInfo;
import java.io.IOException;
import java.security.Principal;
import java.util.List;

@Priority(Priorities.AUTHENTICATION)
public class JwtAuthFilter implements ContainerRequestFilter {

    private final String[] rolesAllowed;

    public JwtAuthFilter(String[] rolesAllowed) {
        this.rolesAllowed = rolesAllowed == null ? new String[0] : rolesAllowed;
    }

    @Context
    private ResourceInfo resourceInfo;

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        String auth = requestContext.getHeaderString("Authorization");
        if (auth == null || !auth.startsWith("Bearer ")) {
            abort(requestContext, Response.Status.UNAUTHORIZED, "Authorization header missing or invalid");
            return;
        }
        String token = auth.substring(7).trim();
        Claims claims;
        try {
            claims = JwtUtil.parseClaims(token);
        } catch (Exception e) {
            abort(requestContext, Response.Status.UNAUTHORIZED, "Invalid or expired token");
            return;
        }

        final String subject = claims.getSubject();
        final Object rolesObj = claims.get("roles");
        final List<String> roles = rolesObj instanceof List ? (List<String>) rolesObj : null;

        // check roles if any required
        if (rolesAllowed != null && rolesAllowed.length > 0) {
            boolean match = false;
            if (roles != null) {
                for (String r : rolesAllowed) {
                    for (String u : roles) {
                        if (r.equalsIgnoreCase(u) || r.equalsIgnoreCase(mapRole(u))) {
                            match = true; break;
                        }
                    }
                    if (match) break;
                }
            }
            if (!match) {
                abort(requestContext, Response.Status.FORBIDDEN, "Insufficient role");
                return;
            }
        }

        // set security context so resource methods can access user/principal
        final SecurityContext current = requestContext.getSecurityContext();
        SecurityContext sc = new SecurityContext() {
            @Override
            public Principal getUserPrincipal() {
                return () -> subject;
            }

            @Override
            public boolean isUserInRole(String role) {
                if (roles == null) return false;
                for (String u : roles) {
                    if (u.equalsIgnoreCase(role) || mapRole(u).equalsIgnoreCase(role)) return true;
                }
                return false;
            }

            @Override
            public boolean isSecure() {
                return current != null && current.isSecure();
            }

            @Override
            public String getAuthenticationScheme() {
                return "Bearer";
            }
        };
        requestContext.setSecurityContext(sc);
        // optionally set a property with the claims so resources can read more info
        requestContext.setProperty("claims", claims);
    }

    private String mapRole(String role) {
        // No normalizar, solo devolver el valor original en mayúsculas
        if (role == null) return "";
        return role;
    }

    private void abort(ContainerRequestContext ctx, Response.Status status, String msg) {
        ctx.abortWith(Response.status(status).entity(java.util.Collections.singletonMap("mensaje", msg)).build());
    }
}
