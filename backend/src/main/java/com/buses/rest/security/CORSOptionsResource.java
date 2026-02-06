package com.buses.rest.security;

import javax.ws.rs.OPTIONS;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response;

/**
 * Catch-all OPTIONS handler to ensure preflight requests return 200 with CORS headers.
 */
@Path("/")
public class CORSOptionsResource {

    @OPTIONS
    @Path("{any:.*}")
    public Response handleOptions() {
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
        return builder.build();
    }
}
