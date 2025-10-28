package controlador.dao;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;

/**
 * Utilidad para obtener una instancia compartida de MongoDatabase.
 * Lee MONGO_URI y MONGO_DB desde variables de entorno (con valores por defecto).
 */
public class MongoUtil {
    private static MongoClient mongoClient = null;
    private static MongoDatabase database = null;

    private MongoUtil() {
        // no instancias
    }

    public static synchronized MongoDatabase getDatabase() {
        if (database == null) {
            String uri = System.getenv("MONGO_URI");
            String dbName = System.getenv("MONGO_DB");
            if (uri == null || uri.isEmpty()) {
                uri = "mongodb://localhost:27017";
            }
            if (dbName == null || dbName.isEmpty()) {
                dbName = "BusesApp";
            }
            mongoClient = MongoClients.create(uri);
            database = mongoClient.getDatabase(dbName);
        }
        return database;
    }

    public static synchronized void close() {
        if (mongoClient != null) {
            mongoClient.close();
            mongoClient = null;
            database = null;
        }
    }
}
