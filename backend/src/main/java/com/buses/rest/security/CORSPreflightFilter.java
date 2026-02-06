package com.buses.rest.security;

import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.Provider;
import java.io.IOException;

/**
 * Handles CORS preflight (OPTIONS) requests so that browsers accept cross-origin calls
 * when the backend is on a different port. Uses FRONTEND_ORIGIN env var; falls back to "*".
 */
@Provider
public class CORSPreflightFilter implements ContainerRequestFilter {

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        if (!"OPTIONS".equalsIgnoreCase(requestContext.getMethod())) {
            return; // only handle preflight
        }

        String origin = System.getenv("FRONTEND_ORIGIN");
        if (origin == null || origin.trim().isEmpty()) {
            origin = "http://localhost:5000";
        }

        Response.ResponseBuilder builder = Response.ok();
        builder.header("Access-Control-Allow-Origin", origin);
        builder.header("Access-Control-Allow-Headers", "origin, content-type, accept, authorization");
        builder.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD");

        if (!"*".equals(origin)) {
            builder.header("Access-Control-Allow-Credentials", "true");
        }

        requestContext.abortWith(builder.build());
    }
}
