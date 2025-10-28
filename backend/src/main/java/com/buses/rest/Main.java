package com.buses.rest;

import org.glassfish.jersey.grizzly2.httpserver.GrizzlyHttpServerFactory;
import org.glassfish.grizzly.http.server.HttpServer;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.server.ServerProperties;
import org.glassfish.jersey.jackson.JacksonFeature;

import controlador.dao.modelo_dao.Descuento_dao;
import java.io.File;
import java.net.URI;
import java.util.concurrent.CountDownLatch;

public class Main {

    // Escuchar en 0.0.0.0 para ser accesible desde otros contenedores
    public static final String BASE_URI = "http://0.0.0.0:8099/api/";

    public static HttpServer startServer() {
        File dataDir = new File("data");
        if (!dataDir.exists()) {
            dataDir.mkdirs();
        }
        // Load backend/.env into System properties so code can read config from a single file
        try {
            File envFile = new File(".env");
            if (envFile.exists()) {
                java.nio.file.Files.lines(envFile.toPath())
                    .map(String::trim)
                    .filter(l -> !l.startsWith("#") && l.contains("="))
                    .forEach(l -> {
                        int eq = l.indexOf('=');
                        String k = l.substring(0, eq).trim();
                        String v = l.substring(eq + 1).trim();
                        // remove optional quotes
                        if ((v.startsWith("\"") && v.endsWith("\"")) || (v.startsWith("'") && v.endsWith("'"))) {
                            v = v.substring(1, v.length()-1);
                        }
                        if (System.getProperty(k) == null) {
                            System.setProperty(k, v);
                        }
                    });
                System.out.println("Loaded .env into System properties");
            }
        } catch (Exception e) {
            System.err.println("Error loading .env: " + e.getMessage());
        }
        try {
            Descuento_dao descuentoDao = new Descuento_dao();
            descuentoDao.inicializarSiVacio();
        }
        catch (Exception e) {
            System.err.println("Error al inicializar descuentos: " + e.getMessage());
        }
    final ResourceConfig rc = new ResourceConfig()
    // scan both the normal package names and variants that include the 'main.java' prefix
    .packages("com.buses.rest")
    .packages("com.buses.rest.apis")
    .packages("main.java.com.buses.rest")
    .packages("main.java.com.buses.rest.apis")
    // Registrar Jackson para serialización/deserialización JSON
    .register(JacksonFeature.class)
    // Desactivar WADL para evitar que Jersey intente inicializar JAXB en tiempo de arranque
    // (esto previene intentos de carga/optimización que usan sun.misc.Unsafe en algunos entornos)
    .property(ServerProperties.WADL_FEATURE_DISABLE, true);
    // Registrar el feature de seguridad JWT para endpoints anotados con @Secured
    rc.register(com.buses.rest.security.JwtAuthDynamicFeature.class);
        return GrizzlyHttpServerFactory.createHttpServer(URI.create(BASE_URI), rc);
    }

    public static void main(String[] args) {
        final HttpServer server = startServer();
    System.out.println(String.format(
        "Jersey app started and listening at %s (HTTP)\n",
        BASE_URI));
        // En contenedores no leemos System.in; esperamos hasta recibir SIGTERM
        CountDownLatch latch = new CountDownLatch(1);
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            server.shutdownNow();
            latch.countDown();
        }));
        try {
            latch.await();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
