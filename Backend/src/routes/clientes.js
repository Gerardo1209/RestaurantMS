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
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
        const pool = await db.pool;
        const request = await pool.request();
        const result = await request.query('SELECT * FROM cliente');
        res.json({success: true, message: result.recordset});
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/cliente/consultar/:idCliente', async (req, res) => {
    try {
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
        const pool = await db.pool;
        const request = await pool.request();
        const { idCliente } = req.params;
        request.input('id_cte', db.sql.Int, idCliente)
        const result = await request.query('SELECT * FROM cliente WHERE id=@id_cte;');
        res.json({success: true, message: { cliente: result.recordset[0]}});
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


router.post('/cliente/nuevo', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {
        await transaction.begin();
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
        const request = await new db.sql.Request(transaction);
        let body = req.body;
        request.input('nombre', db.sql.VarChar, body.nombre);
        request.input('ap', db.sql.VarChar, body.ap);
        request.input('am', db.sql.VarChar, body.am);
        request.input('telefono', db.sql.VarChar, body.telefono);
        request.input('email', db.sql.VarChar, body.email);
        request.input('curp', db.sql.VarChar, body.curp);        
        const result = await request.query('INSERT INTO cliente VALUES(@nombre,@ap,@am,@telefono,@email,@curp); SELECT SCOPE_IDENTITY() AS id;')
        if(result.recordset[0].id == 0) throw new Error("Error al insertar el cliente");
        await transaction.commit();
        res.json({success: true, message: "Se ha creado el cliente correctamente"});
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({success:false, message: error.message });
    }
});


router.post('/cliente/cambio', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {
        
        await transaction.begin();
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
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
        if(result.rowsAffected[0] === 0) throw new Error("Error al Actualizar el Cliente");
        await transaction.commit();
        res.json({success: true, message: "Se ha Actualizado el Cliente correctamente"});
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({success:false, message: error.message });
    }
});



// RESERVACION

router.get('/reservaciones', async (req, res) => {
    try {
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
        const pool = await db.pool;
        const request = await pool.request();
        const result = await request.query('SELECT * FROM reservacion');
        res.json({success: true, message: result.recordset});
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


router.post('/reservacion/nuevo', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {
        await transaction.begin();
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
        const request = await new db.sql.Request(transaction);
        let body = req.body;
        request.input('id_mesa', db.sql.Int, body.id_mesa);
        request.input('fecha', db.sql.DateTime, new Date());
        request.input('password', db.sql.VarChar, body.password);
        request.input('habilitado',db.sql.Bit, 1);
        const cliente = JSON.parse(body.cliente);
        request.input('nombre',db.sql.VarChar, cliente.nombre);
        request.input('ap',db.sql.VarChar, cliente.ap);
        request.input('am',db.sql.VarChar, cliente.am);
        request.input('telefono',db.sql.VarChar, cliente.telefono);
        request.input('email',db.sql.VarChar, cliente.email);
        request.input('curp',db.sql.VarChar, cliente.curp);

        let idcte

        // Verificar la existencia o NO del CLIENTE
        const resultcte = await request.query('Select * From cliente WHERE curp=@curp;')
        if(resultcte.recordset.length > 0){
            //Si el cliente existe, se extrae el ID
            idcte = resultcte.recordset[0].id;
        }else{
            // Si el cliente NO existe, entonces se crea el cliente
            const resultcte2 = await request.query('INSERT INTO cliente VALUES(@nombre,@ap,@am,@telefono,@email,@curp); SELECT SCOPE_IDENTITY() AS id;')
            if(resultcte2.recordset[0].id == 0) throw new Error("Error al insertar el cliente en la Reservacion");
            idcte = resultcte2.recordset[0].id            
            console.log("ID del cliente creado para la reservacion: ", idcte);
        }

        request.input('idcte', db.sql.Int, idcte);

        const result = await request.query('INSERT INTO reservacion VALUES(@idcte,@id_mesa,@fecha,@password,@habilitado); SELECT SCOPE_IDENTITY() AS id;')
        if(result.recordset[0].id == 0) throw new Error("Error al insertar la reservacion");
        await transaction.commit();
        res.json({success: true, message: "Se ha creado la reservacion correctamente"});
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({success:false, message: error.message });
    }
});


router.post('/reservacion/cambio', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {
        
        await transaction.begin();
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
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
        if(resultcte.rowsAffected[0] === 0) throw new Error("Error al Actualizar el Cliente en Reservacion");

        const result = await request.query('UPDATE reservacion SET id_cliente=@id_cte, id_mesa=@id_mesa, fecha=@fecha, password=@password WHERE id=@id_res;')
        if(result.rowsAffected[0] === 0) throw new Error("Error al Actualizar la Reservacion");
        
        await transaction.commit();
        res.json({success: true, message: "Se ha Actualizado la Reservacion Exitoramente"});
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({success:false, message: error.message });
    }
});


router.post('/reservacion/baja', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {
        await transaction.begin();
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
        const request = await new db.sql.Request(transaction);
        let body = req.body;
        request.input('id_res', db.sql.Int, body.id);
        request.input('habilitado', db.sql.Bit, 0);

        const result = await request.query('UPDATE reservacion SET habilitado=@habilitado WHERE id=@id_res;')
        if(result.rowsAffected[0] === 0) throw new Error("Error al dar de Baja la Reservacion");
        
        await transaction.commit();
        res.json({success: true, message: "Se ha dado de Baja la Reservacion Exitoramente"});
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({success:false, message: error.message });
    }
});

router.post('/reservacion/recuperar', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {
        await transaction.begin();
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
        const request = await new db.sql.Request(transaction);
        let body = req.body;
        request.input('id_res', db.sql.Int, body.id);
        request.input('habilitado', db.sql.Bit, 1);

        const result = await request.query('UPDATE reservacion SET habilitado=@habilitado WHERE id=@id_res;')
        if(result.rowsAffected[0] === 0) throw new Error("Error al Reactivar la Reservacion");
        
        await transaction.commit();
        res.json({success: true, message: "Se ha Reactivado la Reservacion Exitoramente"});
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({success:false, message: error.message });
    }
});






// MESA

router.get('/mesas', async (req, res) => {
    try {
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
        const pool = await db.pool;
        const request = await pool.request();
        const result = await request.query('SELECT * FROM mesa');
        res.json({success: true, message: result.recordset});
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


router.post('/mesa/nuevo', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {
        await transaction.begin();
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
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
        request.input('habilitado',db.sql.Bit, 1);
        const result = await request.query('INSERT INTO mesa VALUES(@capacidad,@estado,@tipo,@posx1, @posx2, @posy1, @posy2, @descripcion, @habilitado); SELECT SCOPE_IDENTITY() AS id;')
        if(result.recordset[0].id == 0) throw new Error("Error al crear la Mesa");
        await transaction.commit();
        res.json({success: true, message: "Se ha creado la mesa correctamente"});
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({success:false, message: error.message });
    }
});

router.post('/mesa/cambio', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {
        await transaction.begin();
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
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
        if(result.rowsAffected[0] === 0) throw new Error("Error al Actualizar la Mesa");
        await transaction.commit();
        res.json({success: true, message: "Se ha Actualizado la Mesa correctamente"});
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({success:false, message: error.message });
    }
});

router.post('/mesa/baja', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {
        await transaction.begin();
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
        const request = await new db.sql.Request(transaction);
        let body = req.body;
        request.input('id_mesa', db.sql.Int, body.id);      
        const result = await request.query('UPDATE mesa SET habilitado=0 WHERE id=@id_mesa;')
        if(result.rowsAffected[0] === 0) throw new Error("Error al dar de Baja la Mesa");
        await transaction.commit();
        res.json({success: true, message: "Se ha dado de Baja la Mesa correctamente"});
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({success:false, message: error.message });
    }
});


router.post('/mesa/recuperar', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {
        await transaction.begin();
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
        const request = await new db.sql.Request(transaction);
        let body = req.body;
        request.input('id_mesa', db.sql.Int, body.id);      
        const result = await request.query('UPDATE mesa SET habilitado=1 WHERE id=@id_mesa;')
        if(result.rowsAffected[0] === 0) throw new Error("Error al Recuperar la Mesa");
        await transaction.commit();
        res.json({success: true, message: "Se ha Recuperado la Mesa correctamente"});
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({success:false, message: error.message });
    }
});

// ORDEN




//Hasta el final exportar el router
module.exports = router;