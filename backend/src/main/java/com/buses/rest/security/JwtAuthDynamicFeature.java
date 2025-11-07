package com.buses.rest.security;

import javax.ws.rs.container.DynamicFeature;
import javax.ws.rs.container.ResourceInfo;
import javax.ws.rs.core.FeatureContext;
import java.lang.reflect.Method;

public class JwtAuthDynamicFeature implements DynamicFeature {

    @Override
    public void configure(ResourceInfo resourceInfo, FeatureContext context) {
        Method m = resourceInfo.getResourceMethod();
        Secured secured = m.getAnnotation(Secured.class);
        if (secured == null) {
            secured = resourceInfo.getResourceClass().getAnnotation(Secured.class);
        }
        if (secured != null) {
            String[] roles = secured.roles();
            context.register(new JwtAuthFilter(roles));
        }
    }
}
