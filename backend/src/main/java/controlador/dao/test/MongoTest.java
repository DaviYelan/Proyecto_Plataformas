package controlador.dao.test;

import controlador.dao.modelo_dao.Bus_dao;
import modelo.Bus;
import modelo.Cooperativa;
import modelo.enums.Estado_bus;

public class MongoTest {
    public static void main(String[] args) {
        try {
            // Informar al usuario cómo activar Mongo en el entorno
            System.out.println("USE_MONGO=" + System.getenv("USE_MONGO"));
            // Crear un bus de prueba
            Bus b = new Bus();
            b.setNumero_bus(123);
            b.setPlaca("ABC-123");
            b.setMarca("Mercedes");
            b.setModelo("Sprinter");
            b.setCapacidad_pasajeros(40);
            b.setVelocidad(80);
            b.setEstado_bus(Estado_bus.Activo);
            Cooperativa c = new Cooperativa();
            c.setId_cooperativa(1);
            c.setNombre_cooperativa("Coop Test");
            b.setCooperativa(c);

            Bus_dao dao = new Bus_dao();
            dao.setBus(b);
            boolean saved = dao.save();
            System.out.println("Guardado en Mongo? " + saved);

            // Listar todos y mostrar el último
            controlador.tda.lista.LinkedList<Bus> list = dao.getLista_buses();
            System.out.println("Total buses: " + list.getSize());
            if (list.getSize() > 0) {
                System.out.println(list.get(list.getSize() - 1));
            }

            // Cerrar conexión
            controlador.dao.MongoUtil.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
