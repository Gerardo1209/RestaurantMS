/**
 * En esta ruta se especifican todas las operaciones necesarias para manejar los empleados
 */
const express = require('express');
const router = express.Router();
const db = require('../Auth/sql')
const authManager = require('../Auth/user_permision')

router.get('/puestos', async (req, res) => {
    try {
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
        const pool = await db.pool;
        const request = await pool.request();
        const result = await request.query('SELECT * FROM puesto');
        res.json( {success: true, message: result.recordset} );
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

router.get('/estados', async (req, res) => {
    try {
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
        const pool = await db.pool;
        const request = await pool.request();
        const result = await request.query('SELECT * FROM estado');
        res.json({success: true, message: result.recordset});
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

router.get('/municipios', async (req, res) => {
    try {
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
        const pool = await db.pool;
        const request = await pool.request();
        const result = await request.query('SELECT * FROM municipio',);
        res.json({success: true, message: result.recordset});
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

router.get('/municipios/:idEstado', async (req, res) => {
    try {
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
        const pool = await db.pool;
        const request = await pool.request();
        const { idEstado } = req.params;
        request.input('id_edo', db.sql.Int, idEstado)
        const result = await request.query('SELECT * FROM municipio WHERE id_edo=@id_edo',);
        res.json({success: true, message: result.recordset});
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

router.get('/empleados', async (req, res) => {
    try {
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
        const pool = await db.pool;
        const request = await pool.request();
        const result = await request.query('SELECT * FROM empleados');
        res.json({success: true, message: result.recordset});
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

router.get('/empleado/consultar/:idEmpleado', async (req, res) => {
    try {
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
        const pool = await db.pool;
        const request = await pool.request();
        const { idEmpleado } = req.params;
        request.input('id_emp', db.sql.Int, idEmpleado)
        const result = await request.query('SELECT * FROM empleados WHERE id=@id_emp;');
        request.input('id_dir', db.sql.Int, result.recordset[0].cdg_dir)
        const resultDir = await request.query('SELECT * FROM direccion WHERE id=@id_dir;');
        res.json({success: true, message: { empleado: result.recordset[0], direccion: resultDir.recordset[0] }});
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

router.get('/direccion/:idEmpleado', async (req, res) => {
    try {
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
        const pool = await db.pool;
        const request = await pool.request();
        const { idEmpleado } = req.params;
        request.input('id_emp', db.sql.Int, idEmpleado)
        const result = await request.query('SELECT * FROM direccion WHERE id=(SELECT cdg_dir FROM empleados WHERE id=@id_emp);');
        res.json({success: true, message: result.recordset[0]});
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

router.get('/direcciones', async (req, res) => {
    try {
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
        const pool = await db.pool;
        const request = await pool.request();
        const result = await request.query('SELECT * FROM direccion;');
        res.json({success: true, message: result.recordset});
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

router.post('/empleado/login', async(req,res) => {
    try {
        const pool = await db.pool;
        const request = await pool.request();
        let body = req.body;
        if(!await authManager.revContrasena(body.contrasena, body.usuario)) throw new Error('Usuario o contraseña incorrecto');
        request.input('usuario', db.sql.VarChar, body.usuario);
        const result = await request.query('SELECT * FROM empleados WHERE usuario=@usuario;');
        res.json({success: true, message: result.recordset[0]});
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

router.post('/empleado/nuevo', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {
        
        await transaction.begin();
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
        const request = await new db.sql.Request(transaction);
        let body = req.body;
        if(body.contrasena.length <= 8) throw new Error("La contraseña debe ser de al menos 8 caracteres");
        request.input('nombre', db.sql.VarChar, body.nombre);
        request.input('ap', db.sql.VarChar, body.ap);
        request.input('am', db.sql.VarChar, body.am);
        request.input('id_puesto', db.sql.Int, body.id_puesto);
        request.input('usuario', db.sql.VarChar, body.usuario);
        request.input('contrasena', db.sql.VarChar, await authManager.genContrasena(body.contrasena)); //Genera contraseñas hasheadas
        request.input('sueldo', db.sql.Float, body.sueldo);
        request.input('telefono', db.sql.VarChar, body.telefono);
        request.input('jefe', db.sql.Int, null);
        request.input('email', db.sql.VarChar, body.email);
        request.input('activo', db.sql.Char, body.activo);
        request.input('FCU', db.sql.DateTime, new Date());
        request.input('FAU', db.sql.DateTime, new Date());
        const direccion = JSON.parse(body.direccion);
        request.input('calle',db.sql.VarChar,direccion.calle);
        request.input('no_ext',db.sql.VarChar,direccion.no_ext);
        if(direccion.no_int == 0) direccion.no_int = null;
        request.input('no_int',db.sql.VarChar,direccion.no_int);
        request.input('localidad',db.sql.VarChar,direccion.localidad);
        request.input('id_mun',db.sql.Int,direccion.id_mun);
        request.input('descripcion',db.sql.VarChar,direccion.descripcion);

        const resultDir = await request.query('INSERT INTO direccion VALUES(@calle,@no_ext,@no_int,@localidad,@id_mun,@descripcion); SELECT SCOPE_IDENTITY() AS id;');
        if(resultDir.recordset[0].id == 0) throw new Error("Error al insertar la direccion");
        
        request.input('cdg_dir',db.sql.Int, resultDir.recordset[0].id);
        const result = await request.query('INSERT INTO empleados VALUES(@cdg_dir,@nombre,@ap,@am,@sueldo,@telefono,@email,@jefe,@id_puesto,@usuario,@contrasena,@activo,@FCU,@FAU); SELECT SCOPE_IDENTITY() AS id;')
        if(result.recordset[0].id == 0) throw new Error("Error al insertar el empleado");
        await transaction.commit();
        res.json({success: true, message: "Se ha creado el empleado correctamente"});
    } catch (error) {
        await transaction.rollback();
        res.json({success:false, message: error.message });
    }
});

router.post('/empleado/baja', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {
       
        await transaction.begin();
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
        const request = await new db.sql.Request(transaction);
        let body = req.body;
        request.input('id', db.sql.Int, body.id);
        request.input('FAU', db.sql.DateTime, new Date());
        const result = await request.query('UPDATE empleados SET activo=0, FAU=@FAU WHERE id=@id;')
        if(result.rowsAffected[0] == 0) throw new Error("Error al desactivar el empleado");
        await transaction.commit();
        res.json({success: true, message: "Se ha desactivado el empleado correctamente"});
    } catch (error) {
        await transaction.rollback();
        res.json({success:false, message: error.message });
    }
});

router.post('/empleado/recuperar', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {
       
        await transaction.begin();
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
        const request = await new db.sql.Request(transaction);
        let body = req.body;
        request.input('id', db.sql.Int, body.id);
        request.input('FAU', db.sql.DateTime, new Date());
        const result = await request.query('UPDATE empleados SET activo=1, FAU=@FAU WHERE id=@id;')
        if(result.rowsAffected[0] == 0) throw new Error("Error al reactivar el empleado");
        await transaction.commit();
        res.json({success: true, message: "Se ha reactivado el empleado correctamente"});
    } catch (error) {
        await transaction.rollback();
        res.json({success:false, message: error.message });
    }
});




// Consulta para Cambio de Empleado
router.post('/empleado/cambio', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {
        
        await transaction.begin();
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador])) throw new Error('No tienes permisos');
        const request = await new db.sql.Request(transaction);
        let body = req.body;
        if(body.contrasena.length <= 8) throw new Error("La contraseña debe ser de al menos 8 caracteres");
        request.input('id_emp', db.sql.Int, body.id)
        request.input('nombre', db.sql.VarChar, body.nombre);
        request.input('ap', db.sql.VarChar, body.ap);
        request.input('am', db.sql.VarChar, body.am);
        request.input('id_puesto', db.sql.Int, body.id_puesto);
        request.input('usuario', db.sql.VarChar, body.usuario);
        request.input('contrasena', db.sql.VarChar, await authManager.genContrasena(body.contrasena));
        request.input('sueldo', db.sql.Float, body.sueldo);
        request.input('telefono', db.sql.VarChar, body.telefono);
        request.input('jefe', db.sql.Int, null);
        request.input('email', db.sql.VarChar, body.email);
        request.input('activo', db.sql.Char, body.activo);
        request.input('FAU', db.sql.DateTime, new Date());
        const direccion = JSON.parse(body.direccion);
        request.input('cdg_dir', db.sql.Int, body.cdg_dir)
        request.input('calle', db.sql.VarChar, direccion.calle);
        request.input('no_ext', db.sql.VarChar, direccion.no_ext);
        if(direccion.no_int == 0) direccion.no_int = null;
        request.input('no_int', db.sql.VarChar, direccion.no_int);
        request.input('localidad', db.sql.VarChar, direccion.localidad);
        request.input('id_mun', db.sql.Int, direccion.id_mun);
        request.input('descripcion', db.sql.VarChar, direccion.descripcion);
        const resultDir = await request.query('UPDATE direccion SET calle=@calle, no_ext=@no_ext, no_int=@no_int, localidad=@localidad, id_mun=@id_mun, descripcion=@descripcion WHERE id=@cdg_dir;');
        if(resultDir.rowsAffected[0] === 0) throw new Error("Error al Actualizar la Direccion");
        //request.input('cdg_dir',db.sql.Int, resultDir.recordset[0].id);
        const result = await request.query('UPDATE empleados SET cdg_dir=@cdg_dir, nombre=@nombre, ap=@ap, am=@am, sueldo=@sueldo, telefono=@telefono, email=@email, jefe=@jefe, id_puesto=@id_puesto, usuario=@usuario, contrasena=@contrasena, activo=@activo, FAU=@FAU WHERE id=@id_emp;')
        if(result.rowsAffected[0] === 0) throw new Error("Error al Actualizar el Empleado");
        await transaction.commit();
        res.json({success: true, message: "Se ha Actualizado el Empleado correctamente"});
    } catch (error) {
        await transaction.rollback();
        res.json({success:false, message: error.message });
    }
});


module.exports = router;