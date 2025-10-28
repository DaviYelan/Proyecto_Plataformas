package controlador.dao;

import controlador.tda.lista.LinkedList;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import java.lang.reflect.Method;
import java.io.FileReader;
import java.io.FileWriter;
import java.util.Scanner;
import java.io.File;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;

public class AdapterDao<T> implements InterfazDao<T> {
    private Class<T> clazz;
    private Gson g;
    public static String filePath = "data/";

    public AdapterDao(Class<T> clazz) {
        this.clazz = clazz;
        this.g = new Gson();
    }

    private boolean useMongo() {
        String useMongo = System.getenv("USE_MONGO");
        return useMongo != null && useMongo.equalsIgnoreCase("true");
    }

    public T get(Integer id) throws Exception {
        if (useMongo()) {
            MongoDatabase db = MongoUtil.getDatabase();
            MongoCollection<Document> collection = db.getCollection(clazz.getSimpleName());
            Document doc = collection.find().skip(id - 1).first();
            if (doc != null) {
                return g.fromJson(doc.toJson(), clazz);
            }
            return null;
        } else {
            LinkedList<T> list = listAll();
            if (!list.isEmpty()) {
                T[] matriz = list.toArray();
                return matriz[id - 1];
            }
            return null;
        }
    }

    @SuppressWarnings("unchecked")
    public LinkedList<T> listAll() {
        LinkedList<T> list = new LinkedList<>();
        if (useMongo()) {
            MongoDatabase db = MongoUtil.getDatabase();
            MongoCollection<Document> collection = db.getCollection(clazz.getSimpleName());
            for (Document doc : collection.find()) {
                T obj = g.fromJson(doc.toJson(), clazz);
                list.add(obj);
            }
        } else {
            try {
                String data = readFile();
                if (data != null && !data.trim().isEmpty() && !data.equals("[]")) {
                    T[] matrix = (T[]) g.fromJson(data, java.lang.reflect.Array.newInstance(clazz, 0).getClass());
                    if (matrix != null) {
                        list.toList(matrix);
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return list;
    }

    public void merge(T object, Integer index) throws Exception {
        if (useMongo()) {
            MongoDatabase db = MongoUtil.getDatabase();
            MongoCollection<Document> collection = db.getCollection(clazz.getSimpleName());
            Document oldDoc = collection.find().skip(index).first();
            if (oldDoc != null) {
                String json = g.toJson(object);
                Document newDoc = Document.parse(json);
                collection.replaceOne(oldDoc, newDoc);
                return;
            } else {
                throw new Exception("Índice fuera de rango en MongoDB");
            }
        }

        LinkedList<T> list = listAll();
        if (index >= 0 && index < list.getSize()) {
            list.update(object, index);
        } else {
            list.add(object);
        }
        String jsonListString = g.toJson(list.toArray());
        saveFile(jsonListString);
    }

    public void persist(T object) throws Exception {
        if (useMongo()) {
            MongoDatabase db = MongoUtil.getDatabase();
            MongoCollection<Document> collection = db.getCollection(clazz.getSimpleName());
            // Ensure object has a numeric id assigned when stored in MongoDB so
            // the application-side id fields (e.g. id_cuenta) are available after insert.
            try {
                Integer nextId = obtenerSiguienteId();
                // try to find a setter like setId_<something>
                for (java.lang.reflect.Method m : clazz.getMethods()) {
                    if (m.getName().startsWith("setId_") && m.getParameterCount() == 1
                            && m.getParameterTypes()[0] == Integer.class) {
                        m.invoke(object, nextId);
                        break;
                    }
                }
            } catch (Throwable t) {
                // non-fatal: if we cannot set id reflectively, continue and let Mongo create _id
                System.err.println("Warning: no id assigned before Mongo insert: " + t.getMessage());
            }

            String json = g.toJson(object);
            Document doc = Document.parse(json);
            collection.insertOne(doc);
            return;
        }

        LinkedList<T> list = listAll();
        list.add(object);
        String jsonListString = g.toJson(list.toArray());
        saveFile(jsonListString);
    }

    private String readFile() throws Exception {
        File file = new File(filePath + clazz.getSimpleName() + ".json");
        if (!file.exists()) {
            System.out.println("El archivo no existe, creando uno nuevo: " + file.getAbsolutePath());
            saveFile("[]");
        }
        StringBuilder sb = new StringBuilder();
        try (Scanner in = new Scanner(new FileReader(file))) {
            while (in.hasNextLine()) {
                sb.append(in.nextLine()).append("\n");
            }
        }
        return sb.toString().trim();
    }

    public void saveFile(String data) throws Exception {
        File file = new File(filePath + clazz.getSimpleName() + ".json");
        file.getParentFile().mkdirs();
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        try {
            JsonElement jsonElement = JsonParser.parseString(data);
            String formattedJson = gson.toJson(jsonElement);
            try (FileWriter f = new FileWriter(file)) {
                f.write(formattedJson);
                f.flush();
            }
        } catch (Exception e) {
            System.out.println("Error al escribir en el archivo: " + e.getMessage());
            throw e;
        }
    }

    public Integer obtenerSiguienteId() throws Exception {
        LinkedList<T> items = listAll();
        if (items.isEmpty())
            return 1;
        try {
            Method getIdMethod = null;
            for (Method method : clazz.getMethods()) {
                if (method.getName().startsWith("getId_")) {
                    getIdMethod = method;
                    break;
                }
            }
            if (getIdMethod == null)
                return items.getSize() + 1;
            boolean[] usedIds = new boolean[items.getSize() + 2];
            for (int i = 0; i < items.getSize(); i++) {
                T item = items.get(i);
                Integer id = (Integer) getIdMethod.invoke(item);
                if (id != null && id <= usedIds.length) {
                    usedIds[id - 1] = true;
                }
            }
            for (int i = 0; i < usedIds.length; i++) {
                if (!usedIds[i])
                    return i + 1;
            }
            return items.getSize() + 1;
        } catch (Exception e) {
            throw new Exception("Error generando ID: " + e.getMessage());
        }
    }
}