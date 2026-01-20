package com.buses.rest.security;

import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.container.ContainerResponseFilter;
import javax.ws.rs.ext.Provider;
import java.io.IOException;

@Provider
public class CORSFilter implements ContainerResponseFilter {

    @Override
    public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext) throws IOException {
        String origin = System.getenv("FRONTEND_ORIGIN");
        if (origin == null || origin.trim().isEmpty()) {
            // Default to local frontend for credentials-based calls
            origin = "http://localhost:5000";
        }

        responseContext.getHeaders().putSingle("Access-Control-Allow-Origin", origin);
        responseContext.getHeaders().putSingle("Access-Control-Allow-Headers", "origin, content-type, accept, authorization");
        responseContext.getHeaders().putSingle("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD");

        // Allow credentials only if origin is explicit
        if (!"*".equals(origin)) {
            responseContext.getHeaders().putSingle("Access-Control-Allow-Credentials", "true");
        }
    }
}
