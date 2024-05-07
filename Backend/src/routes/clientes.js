/**
 * En esta ruta se especifican todas las operaciones necesarias para manejar los clientes
 */
const express = require('express');
const router = express.Router();
const db = require('../Auth/sql')
const authManager = require('../Auth/user_permision');


// CLIENTE (ALTAS, BAJAS, CONSULTA, ACTUALIZAR)

router.get('/clientes', async (req, res) => {
    try {
        if (!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
        const pool = await db.pool;
        const request = await pool.request();
        const result = await request.query('SELECT * FROM cliente');
        res.json({ success: true, message: result.recordset });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

router.get('/cliente/consultar/:idCliente', async (req, res) => {
    try {
        if (!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
        const pool = await db.pool;
        const request = await pool.request();
        const { idCliente } = req.params;
        request.input('id_cte', db.sql.Int, idCliente)
        const result = await request.query('SELECT * FROM cliente WHERE id=@id_cte;');
        res.json({ success: true, message: { cliente: result.recordset[0] } });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});


router.post('/cliente/nuevo', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {
        await transaction.begin();
        if (!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
        const request = await new db.sql.Request(transaction);
        let body = req.body;
        request.input('nombre', db.sql.VarChar, body.nombre);
        request.input('ap', db.sql.VarChar, body.ap);
        request.input('am', db.sql.VarChar, body.am);
        request.input('telefono', db.sql.VarChar, body.telefono);
        request.input('email', db.sql.VarChar, body.email);
        request.input('curp', db.sql.VarChar, body.curp);
        const result = await request.query('INSERT INTO cliente VALUES(@nombre,@ap,@am,@telefono,@email,@curp); SELECT SCOPE_IDENTITY() AS id;')
        if (result.recordset[0].id == 0) throw new Error("Error al insertar el cliente");
        await transaction.commit();
        res.json({ success: true, message: "Se ha creado el cliente correctamente" });
    } catch (error) {
        await transaction.rollback();
        res.json({success:false, message: error.message });
    }
});


router.post('/cliente/cambio', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {

        await transaction.begin();
        if (!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
        const request = await new db.sql.Request(transaction);
        let body = req.body;
        request.input('id_cte', db.sql.Int, body.id)
        request.input('nombre', db.sql.VarChar, body.nombre);
        request.input('ap', db.sql.VarChar, body.ap);
        request.input('am', db.sql.VarChar, body.am);
        request.input('telefono', db.sql.VarChar, body.telefono);
        request.input('email', db.sql.VarChar, body.email);
        request.input('curp', db.sql.VarChar, body.curp);
        const result = await request.query('UPDATE cliente SET nombre=@nombre, ap=@ap, am=@am, telefono=@telefono, email=@email, curp=@curp WHERE id=@id_cte;')
        if (result.rowsAffected[0] === 0) throw new Error("Error al Actualizar el Cliente");
        await transaction.commit();
        res.json({ success: true, message: "Se ha Actualizado el Cliente correctamente" });
    } catch (error) {
        await transaction.rollback();
        res.json({success:false, message: error.message });
    }
});



// RESERVACION

router.get('/reservaciones', async (req, res) => {
    try {
        if (!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
        const pool = await db.pool;
        const request = await pool.request();
        const result = await request.query('SELECT * FROM reservacion');
        res.json({ success: true, message: result.recordset });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});


router.post('/reservacion/nuevo', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {
        await transaction.begin();
        const request = await new db.sql.Request(transaction);
        let body = req.body;
        const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let contrasena = '';
        for (let i = 0; i < 5; i++) {
            const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
            contrasena += caracteres.charAt(indiceAleatorio);
        }
        request.input('id_mesa', db.sql.Int, body.id_mesa);
        request.input('fecha', db.sql.DateTime, body.fecha);
        request.input('password', db.sql.VarChar, await authManager.genContrasena(contrasena));
        request.input('habilitado', db.sql.Bit, 1);
        const cliente = body.cliente;
        request.input('nombre', db.sql.VarChar, cliente.Nombre);
        request.input('ap', db.sql.VarChar, cliente.AP);
        request.input('am', db.sql.VarChar, cliente.AM);
        request.input('telefono', db.sql.VarChar, cliente.Telefono);
        request.input('email', db.sql.VarChar, cliente.Email);
        request.input('curp', db.sql.VarChar, cliente.CURP);

        let idcte
        console.log(cliente)
        // Verificar la existencia o NO del CLIENTE
        const resultcte = await request.query('Select * From cliente WHERE curp=@curp;')
        if (resultcte.recordset.length > 0 && cliente.CURP.length>0) {
            //Si el cliente existe, se extrae el ID
            idcte = resultcte.recordset[0].id;
        } else {
            // Si el cliente NO existe, entonces se crea el cliente
            const resultcte2 = await request.query('INSERT INTO cliente VALUES(@nombre,@ap,@am,@telefono,@email,@curp); SELECT SCOPE_IDENTITY() AS id;')
            if (resultcte2.recordset[0].id == 0) throw new Error("Error al insertar el cliente en la Reservacion");
            idcte = resultcte2.recordset[0].id
        }
        request.input('idcte', db.sql.Int, idcte);
        const result = await request.query('INSERT INTO reservacion VALUES(@idcte,@id_mesa,@fecha,@password,@habilitado); SELECT SCOPE_IDENTITY() AS id;')
        if (result.recordset[0].id == 0) throw new Error("Error al insertar la reservacion");
        await transaction.commit();
        res.json({ success: true, message: "Se ha creado la reservacion correctamente", data: {id: result.recordset[0].id, password: contrasena} });
    } catch (error) {
        await transaction.rollback();
        res.json({success:false, message: error.message });
    }
});


router.post('/reservacion/cambio', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {

        await transaction.begin();
        if (!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
        const request = await new db.sql.Request(transaction);
        let body = req.body;
        request.input('id_res', db.sql.Int, body.id);
        request.input('id_cte', db.sql.Int, body.id_cliente);
        request.input('id_mesa', db.sql.Int, body.id_mesa);
        request.input('fecha', db.sql.DateTime, new Date());
        request.input('password', db.sql.VarChar, body.password);
        const cliente = JSON.parse(body.cliente);
        request.input('nombre', db.sql.VarChar, cliente.nombre);
        request.input('ap', db.sql.VarChar, cliente.ap);
        request.input('am', db.sql.VarChar, cliente.am);
        request.input('telefono', db.sql.VarChar, cliente.telefono);
        request.input('email', db.sql.VarChar, cliente.email);
        request.input('curp', db.sql.VarChar, cliente.curp);

        const resultcte = await request.query('UPDATE cliente SET nombre=@nombre, ap=@ap, am=@am, telefono=@telefono, email=@email, curp=@curp WHERE id=@id_cte;');
        if (resultcte.rowsAffected[0] === 0) throw new Error("Error al Actualizar el Cliente en Reservacion");

        const result = await request.query('UPDATE reservacion SET id_cliente=@id_cte, id_mesa=@id_mesa, fecha=@fecha, password=@password WHERE id=@id_res;')
        if (result.rowsAffected[0] === 0) throw new Error("Error al Actualizar la Reservacion");

        await transaction.commit();
        res.json({ success: true, message: "Se ha Actualizado la Reservacion Exitoramente" });
    } catch (error) {
        await transaction.rollback();
        res.json({success:false, message: error.message });
    }
});


router.post('/reservacion/baja', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {
        await transaction.begin();
        if (!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
        const request = await new db.sql.Request(transaction);
        let body = req.body;
        request.input('id_res', db.sql.Int, body.id);
        request.input('habilitado', db.sql.Bit, 0);

        const result = await request.query('UPDATE reservacion SET habilitado=@habilitado WHERE id=@id_res;')
        if (result.rowsAffected[0] === 0) throw new Error("Error al dar de Baja la Reservacion");

        await transaction.commit();
        res.json({ success: true, message: "Se ha dado de Baja la Reservacion Exitoramente" });
    } catch (error) {
        await transaction.rollback();
        res.json({success:false, message: error.message });
    }
});

router.post('/reservacion/recuperar', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {
        await transaction.begin();
        if (!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
        const request = await new db.sql.Request(transaction);
        let body = req.body;
        request.input('id_res', db.sql.Int, body.id);
        request.input('habilitado', db.sql.Bit, 1);

        const result = await request.query('UPDATE reservacion SET habilitado=@habilitado WHERE id=@id_res;')
        if (result.rowsAffected[0] === 0) throw new Error("Error al Reactivar la Reservacion");

        await transaction.commit();
        res.json({ success: true, message: "Se ha Reactivado la Reservacion Exitoramente" });
    } catch (error) {
        await transaction.rollback();
        res.json({success:false, message: error.message });
    }
});






// MESA

router.get('/mesas', async (req, res) => {
    try {
        if (!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
        const pool = await db.pool;
        const request = await pool.request();
        const result = await request.query('SELECT * FROM mesa');
        res.json({ success: true, message: result.recordset });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});


router.post('/mesa/nuevo', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {
        await transaction.begin();
        if (!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
        const request = await new db.sql.Request(transaction);
        let body = req.body;
        request.input('capacidad', db.sql.Int, body.capacidad);
        request.input('estado', db.sql.Char, body.estado);
        request.input('tipo', db.sql.Char, body.tipo);
        request.input('posx1', db.sql.Int, body.posx1);
        request.input('posx2', db.sql.Int, body.posx2);
        request.input('posy1', db.sql.Int, body.posy1);
        request.input('posy2', db.sql.Int, body.posy2);
        request.input('descripcion', db.sql.VarChar, body.descripcion);
        request.input('habilitado', db.sql.Bit, 1);
        const result = await request.query('INSERT INTO mesa VALUES(@capacidad,@estado,@tipo,@posx1, @posx2, @posy1, @posy2, @descripcion, @habilitado); SELECT SCOPE_IDENTITY() AS id;')
        if (result.recordset[0].id == 0) throw new Error("Error al crear la Mesa");
        await transaction.commit();
        res.json({ success: true, message: "Se ha creado la mesa correctamente" });
    } catch (error) {
        await transaction.rollback();
        res.json({success:false, message: error.message });
    }
});

router.post('/mesa/cambio', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {
        await transaction.begin();
        if (!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
        const request = await new db.sql.Request(transaction);
        let body = req.body;
        request.input('id_mesa', db.sql.Int, body.id);
        request.input('capacidad', db.sql.Int, body.capacidad);
        request.input('estado', db.sql.Char, body.estado);
        request.input('tipo', db.sql.Char, body.tipo);
        request.input('posx1', db.sql.Int, body.posx1);
        request.input('posx2', db.sql.Int, body.posx2);
        request.input('posy1', db.sql.Int, body.posy1);
        request.input('posy2', db.sql.Int, body.posy2);
        request.input('descripcion', db.sql.VarChar, body.descripcion);
        const result = await request.query('UPDATE mesa SET capacidad=@capacidad,estado=@estado, tipo=@tipo, posx1=@posx1, posx2=@posx2, posy1=@posy1, posy2=@posy2, descripcion=@descripcion WHERE id=@id_mesa;')
        if (result.rowsAffected[0] === 0) throw new Error("Error al Actualizar la Mesa");
        await transaction.commit();
        res.json({ success: true, message: "Se ha Actualizado la Mesa correctamente" });
    } catch (error) {
        await transaction.rollback();
        res.json({success:false, message: error.message });
    }
});

router.post('/mesa/baja', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {
        await transaction.begin();
        if (!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
        const request = await new db.sql.Request(transaction);
        let body = req.body;
        request.input('id_mesa', db.sql.Int, body.id);
        const result = await request.query('UPDATE mesa SET habilitado=0 WHERE id=@id_mesa;')
        if (result.rowsAffected[0] === 0) throw new Error("Error al dar de Baja la Mesa");
        await transaction.commit();
        res.json({ success: true, message: "Se ha dado de Baja la Mesa correctamente" });
    } catch (error) {
        await transaction.rollback();
        res.json({success:false, message: error.message });
    }
});


router.post('/mesa/recuperar', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {
        await transaction.begin();
        if (!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
        const request = await new db.sql.Request(transaction);
        let body = req.body;
        request.input('id_mesa', db.sql.Int, body.id);
        const result = await request.query('UPDATE mesa SET habilitado=1 WHERE id=@id_mesa;')
        if(result.rowsAffected[0] === 0) throw new Error("Error al Recuperar la Mesa");
        await transaction.commit();
        res.json({success: true, message: "Se ha Recuperado la Mesa correctamente"});
    } catch (error) {
        await transaction.rollback();
        res.json({success:false, message: error.message });
    }
});

// SERVICIO

router.get('/servicios', async (req, res) => {
    try {
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
        const pool = await db.pool;
        const request = await pool.request();
        const result = await request.query('SELECT * FROM servicio');
        res.json({success: true, message: result.recordset});
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

router.post('/servicio/nuevo', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {
        await transaction.begin();
        if(!await authManager.revContrasenaReservacion(req.body.res_contrasena, req.body.res_id, [authManager.PUESTOS.administrador])) throw new Error('No se ha podido iniciar el servicio, las credenciales son incorrectas');
        const request = await new db.sql.Request(transaction);
        let body = req.body;
        request.input('id_res', db.sql.Int, body.id_res);
        request.input('id_emp', db.sql.Int, body.id_emp);
        request.input('he', db.sql.DateTime, new Date());
        request.input('hs', db.sql.DateTime, new Date());
        request.input('estado', db.sql.VarChar, body.estado);
        const result = await request.query('INSERT INTO servicio VALUES(@id_res,@id_emp,@he, @hs, @estado); SELECT SCOPE_IDENTITY() AS id;')
        if(result.recordset[0].id == 0) throw new Error("Error al crear el Servicio");
        const cliente = await request.query('SELECT * FROM cliente WHERE id=(SELECT id_cliente FROM reservacion WHERE id=@id_res)');
        if(!cliente.recordset[0]) throw new Error("Error al obtener el cliente asociado");
        const reservacion = await request.query('SELECT * FROM reservacion WHERE id=@id_res');
        if(!reservacion.recordset[0]) throw new Error("Error al obtener el cliente asociado");
        await transaction.commit();
        res.json({success: true, message: "Se ha creado el Servicio correctamente", data:{ id: result.recordset[0].id, cliente: cliente.recordset[0], reservacion: reservacion.recordset[0]}});
    } catch (error) {
        await transaction.rollback();
        res.json({success:false, message: error.message });
    }
});


// Hay que liberar la mesa en la cual se estaba dando el servicio
router.post('/servicio/pagar', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {
        await transaction.begin();
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
        const request = await new db.sql.Request(transaction);
        let body = req.body;
        request.input('id_serv', db.sql.Int, body.id);  
        request.input('id_res', db.sql.Int, body.id_res);    
        request.input('hs', db.sql.DateTime, new Date());
        request.input('estado', db.sql.VarChar, 'Pa');
        const result = await request.query('UPDATE servicio SET hs=@hs, estado=@estado WHERE id=@id_serv;');
        if(result.rowsAffected[0] === 0) throw new Error("Error al finalizar el Servicio");

        // Se tiene que poner como libre la mesa que se ha liberado
        request.input('estado2', db.sql.Char, 'L')
        const resultM = await request.query('UPDATE m SET m.estado=@estado2 FROM mesa m INNER JOIN reservacion r ON m.id = r.id_mesa WHERE r.id = @id_res;');        
        if(resultM.rowsAffected[0] === 0) throw new Error("Error al Liberar la Mesa del Servicio");


        await transaction.commit();
        res.json({success: true, message: "Se ha finalizado el servicio correctamente"});
    } catch (error) {
        await transaction.rollback();
        res.json({success:false, message: error.message });
    }
});

// El usuario termina pero aun no paga por el servicio
router.post('/servicio/terminar', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {
        await transaction.begin();
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
        const request = await new db.sql.Request(transaction);
        let body = req.body;
        request.input('id_serv', db.sql.Int, body.id);  
        request.input('id_res', db.sql.Int, body.id_res);    
        request.input('estado', db.sql.VarChar, 'Te');
        const result = await request.query('UPDATE servicio SET estado=@estado WHERE id=@id_serv;');
        if(result.rowsAffected[0] === 0) throw new Error("Error al terminar el Servicio");
        await transaction.commit();
        res.json({success: true, message: "Se ha Terminado el servicio correctamente"});
    } catch (error) {
        await transaction.rollback();
        res.json({success:false, message: error.message });
    }
});



// ORDEN

router.get('/ordenes', async (req, res) => {
    try {
        if(!await authManager.revReservacion(req.body.res_contrasena, req.body.res_id)) throw new Error('No tienes permisos');
        const pool = await db.pool;
        const request = await pool.request();
        const result = await request.query('SELECT * FROM orden');
        res.json({success: true, message: result.recordset});
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

router.post('/orden/nuevo', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {
        await transaction.begin();
        if(!await authManager.revReservacion(req.body.res_contrasena, req.body.res_id)) throw new Error('No tienes permisos');
        const request = await new db.sql.Request(transaction);
        let body = req.body;
        request.input('id_serv', db.sql.Int, body.id_serv);
        request.input('estado', db.sql.Char, 'P');
        request.input('hora', db.sql.DateTime, new Date());
        request.input('flag', db.sql.Char, 'I');
        request.input('habilitado', db.sql.Bit, 1);
        const result = await request.query('INSERT INTO orden VALUES(@id_serv,@estado,@hora, @flag, @habilitado); SELECT SCOPE_IDENTITY() AS id;')
        if(result.recordset[0].id == 0) throw new Error("Error al crear la Orden");
        await transaction.commit();
        res.json({success: true, message: "Se ha creado la Orden Exitosamente"});
    } catch (error) {
        await transaction.rollback();
        res.json({success:false, message: error.message });
    }
});


router.post('/orden/baja', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {
        await transaction.begin();
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
        const request = await new db.sql.Request(transaction);
        let body = req.body;
        request.input('id_orden', db.sql.Int, body.id);  
        const result = await request.query('UPDATE orden SET habilitado=0 WHERE id=@id_orden;')
        if(result.rowsAffected[0] === 0) throw new Error("Error al dar de baja la Orden");

        await transaction.commit();
        res.json({success: true, message: "Se ha dado de Baja la Orden correctamente"});
    } catch (error) {
        await transaction.rollback();
        res.json({success:false, message: error.message });
    }
});


router.post('/orden/recuperar', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {
        await transaction.begin();
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
        const request = await new db.sql.Request(transaction);
        let body = req.body;
        request.input('id_orden', db.sql.Int, body.id);  
        const result = await request.query('UPDATE orden SET habilitado=1 WHERE id=@id_orden;')
        if(result.rowsAffected[0] === 0) throw new Error("Error al recuperar la Orden");

        await transaction.commit();
        res.json({success: true, message: "Se ha recuperado la Orden Correctamente"});
    } catch (error) {
        await transaction.rollback();
        res.json({success:false, message: error.message });
    }
});

// Mas que cambio considero su utilidad se encontrara en cambiar el estado de la orden
router.post('/orden/cambio', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {
        await transaction.begin();
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
        const request = await new db.sql.Request(transaction);
        let body = req.body;
        request.input("id_ord", db.sql.Int, body.id);
        request.input('estado', db.sql.Char, body.estado);
        // Cambiar la fecha de la orden ??
        //request.input('hora', db.sql.DateTime, new Date()); 
        const result = await request.query('UPDATE orden SET estado=@estado WHERE id=@id_ord;')
        if(result.rowsAffected[0] === 0) throw new Error("Error al Actualizar la Orden");
        await transaction.commit();
        res.json({success: true, message: "Se ha Actualizado la Orden Exitosamente"});
    } catch (error) {
        await transaction.rollback();
        res.json({success:false, message: error.message });
    }
});



router.post('/orden/estado', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {
        await transaction.begin();
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
        const request = await new db.sql.Request(transaction);
        let body = req.body;
        request.input("id_ord", db.sql.Int, body.id);
        request.input('estado', db.sql.Char, body.estado);
        const result = await request.query('UPDATE orden SET estado=@estado WHERE id=@id_ord;')
        if(result.rowsAffected[0] === 0) throw new Error("Error al Cambiar Estado de la Orden");
        await transaction.commit();
        res.json({success: true, message: "Se ha Actualizado el Estado de la Orden Exitosamente"});
    } catch (error) {
        await transaction.rollback();
        res.json({success:false, message: error.message });
    }
});



router.post('/orden/terminar', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {
        await transaction.begin();
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
        const request = await new db.sql.Request(transaction);
        let body = req.body;
        request.input('id_orden', db.sql.Int, body.id);  
        const result = await request.query('UPDATE orden SET flag=T WHERE id=@id_orden;')
        if(result.rowsAffected[0] === 0) throw new Error("Error al terminar la Orden");

        await transaction.commit();
        res.json({success: true, message: "Se ha Terminado la Orden Correctamente"});
    } catch (error) {
        await transaction.rollback();
        res.json({success:false, message: error.message });
    }
});

//Detalle de orden

router.get('/detalle', async (req, res) => {
    try {
        if (!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
        const pool = await db.pool;
        const request = await pool.request();
        const result = await request.query('SELECT * FROM Detalle_Orden');
        res.json({ success: true, message: result.recordset });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/detalle/:idOrden', async (req, res) => {
    try {
        if (!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
        const pool = await db.pool;
        const request = await pool.request();
        request.input('id_orden', db.sql.Int, req.params.idOrden)
        const result = await request.query('SELECT * FROM Detalle_Orden WHERE id_orden=@id_orden');
        res.json({ success: true, message: result.recordset });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/detalle/nuevo', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {
        await transaction.begin();
        if (!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
        const request = await new db.sql.Request(transaction);
        let body = req.body;

        // Asignar los valores a los parámetros de la consulta
        request.input('id_prod', db.sql.Int, body.id_prod);
        request.input('id_orden', db.sql.Int, body.id_orden);
        request.input('cantidad', db.sql.Int, body.cantidad);
        request.input('p_unit', db.sql.Decimal, body.p_unit);
        request.input('descripcion', db.sql.VarChar, body.descripcion);

        // Verificar existencia del id_prod en Producto
        const prodQuery = await request.query('SELECT COUNT(*) AS count FROM Producto WHERE id = @id_prod;');
        if (prodQuery.recordset[0].count === 0) throw new Error('El id_prod especificado no existe en la tabla Producto');

        // Verificar existencia del id_orden en Orden
        const ordenQuery = await request.query('SELECT COUNT(*) AS count FROM Orden WHERE id = @id_orden;');
        if (ordenQuery.recordset[0].count === 0) throw new Error('El id_orden especificado no existe en la tabla Orden');

        // Insertar en Detalle_Orden
        const result = await request.query('INSERT INTO Detalle_Orden (id_prod, id_orden, cantidad, p_unit, descripcion) VALUES (@id_prod, @id_orden, @cantidad, @p_unit, @descripcion); SELECT SCOPE_IDENTITY() AS id;');
        if (result.recordset[0].id == 0) throw new Error("Error al insertar en Detalle_Orden");

        await transaction.commit();
        res.json({ success: true, message: "Se ha creado el detalle de la orden correctamente" });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ success: false, message: error.message });
    }
});



//Detalle de pedido ordenado

router.get('/det_ped_orden', async (req, res) => {
    try {
        if (!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
        const pool = await db.pool;
        const request = await pool.request();
        const result = await request.query('SELECT * FROM Det_Ped_Ord');
        res.json({ success: true, message: result.recordset });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/det_ped_orden/nuevo', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {
        await transaction.begin();
        const request = await new db.sql.Request(transaction);
        let body = req.body;

        // Verificar existencia del id_do en Detalle_Orden
        request.input('id_do', db.sql.Int, body.id_do);
        const detOrdenQuery = await request.query('SELECT COUNT(*) AS count FROM Detalle_Orden WHERE id = @id_do;');
        if (detOrdenQuery.recordset[0].count === 0) throw new Error('El id_do especificado no existe en la tabla Detalle_Orden');

        // Verificar existencia del id_ingre en Ingredientes
        request.input('id_ingre', db.sql.Int, body.id_ingre);
        const ingredienteQuery = await request.query('SELECT COUNT(*) AS count FROM Ingredientes WHERE id = @id_ingre;');
        if (ingredienteQuery.recordset[0].count === 0) throw new Error('El id_ingre especificado no existe en la tabla Ingredientes');

        // Asignar los valores a los parámetros de la consulta
        request.input('cantidad', db.sql.VarChar, body.cantidad);

        // Insertar en Det_Ped_Ord
        const result = await request.query('INSERT INTO Det_Ped_Ord (id_do, id_ingre, cantidad) VALUES (@id_do, @id_ingre, @cantidad); SELECT SCOPE_IDENTITY() AS id;');
        if (result.recordset[0].id == 0) throw new Error("Error al insertar en Det_Ped_Ord");

        await transaction.commit();
        res.json({ success: true, message: "Se ha creado el detalle del pedido de orden correctamente" });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ success: false, message: error.message });
    }
});




//Hasta el final exportar el router
module.exports = router;