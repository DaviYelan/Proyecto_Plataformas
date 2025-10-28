package controlador.servicios;

import controlador.dao.modelo_dao.Cuenta_dao;
import controlador.dao.AdapterDao;
import controlador.tda.lista.LinkedList;
import modelo.Cuenta;

public class Controlador_cuenta {
    private Cuenta_dao cuenta_dao;
    private AdapterDao<Cuenta> adapterDao;

    public Controlador_cuenta() {
        cuenta_dao = new Cuenta_dao();
        String useMongo = System.getenv("USE_MONGO");
        if (useMongo != null && useMongo.equalsIgnoreCase("true")) {
            adapterDao = new AdapterDao<>(Cuenta.class);
            // ensure AdapterDao will use Mongo by env var
            System.setProperty("USE_MONGO", "true");
        }
    }

    public Boolean save() throws Exception {
        if (adapterDao != null) {
            Cuenta c = cuenta_dao.getCuenta();
            adapterDao.persist(c);
            return true;
        }
        return cuenta_dao.save();
    }

    public Boolean update() throws Exception {
        if (adapterDao != null) {
            Cuenta c = cuenta_dao.getCuenta();
            // find index by id
            LinkedList<Cuenta> all = Lista_cuentas();
            Integer index = -1;
            for (int i = 0; i < all.getSize(); i++) {
                Cuenta item = all.get(i);
                if (item.getId_cuenta() != null && item.getId_cuenta().equals(c.getId_cuenta())) {
                    index = i;
                    break;
                }
            }
            if (index >= 0) adapterDao.merge(c, index);
            else adapterDao.persist(c);
            return true;
        }
        return cuenta_dao.update();
    }

    public LinkedList<Cuenta> Lista_cuentas() {
        if (adapterDao != null) {
            return adapterDao.listAll();
        }
        return cuenta_dao.getLista_cuentas();
    }

    public Cuenta getCuenta() {
        return cuenta_dao.getCuenta();
    }

    public void setCuenta(Cuenta cuenta) {
        cuenta_dao.setCuenta(cuenta);
    }

    public Cuenta get(Integer id) throws Exception {
        if (adapterDao != null) {
            return adapterDao.get(id);
        }
        return cuenta_dao.get(id);
    }

    public Boolean delete(Integer id) throws Exception {
        return cuenta_dao.delete(id);
    }
}
