/**
 * En esta ruta se especifican todas las operaciones necesarias para manejar los empleados
 */
const express = require('express');
const router = express.Router();
const db = require('../Auth/sql')
const authManager = require('../Auth/user_permision')

router.get('/puestos', async (req, res) => {
    try {
        const pool = await db.pool;
        const request = await pool.request();
        const result = await request.query('SELECT * FROM puesto');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/estados', async (req, res) => {
    try {
        const pool = await db.pool;
        const request = await pool.request();
        const result = await request.query('SELECT * FROM estado');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/municipios', async (req, res) => {
    try {
        const pool = await db.pool;
        const request = await pool.request();
        const result = await request.query('SELECT * FROM municipio',);
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/municipios/:idEstado', async (req, res) => {
    try {
        const pool = await db.pool;
        const request = await pool.request();
        const { idEstado } = req.params;
        request.input('id_edo', db.sql.Int, idEstado)
        const result = await request.query('SELECT * FROM municipio WHERE id_edo=@id_edo',);
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/empleados', async (req, res) => {
    try {
        const pool = await db.pool;
        const request = await pool.request();
        const result = await request.query('SELECT * FROM empleados');
        res.json(result.recordset); // Devuelve los registros como JSON
    } catch (error) {
        res.status(500).json({ error: error.message }); // Devuelve un error HTTP 500 en caso de error
    }
});

router.get('/empleado/consultar/:idEmpleado', async (req, res) => {
    try {
        const pool = await db.pool;
        const request = await pool.request();
        const { idEmpleado } = req.params;
        request.input('id_emp', db.sql.Int, idEmpleado)
        const result = await request.query('SELECT * FROM empleados WHERE id=@id_emp;');
        request.input('id_dir', db.sql.Int, result.recordset[0].cdg_dir)
        const resultDir = await request.query('SELECT * FROM direccion WHERE id=@id_dir;');
        res.json({empleado: result.recordset[0], direccion: resultDir.recordset[0]}); // Devuelve los registros como JSON
    } catch (error) {
        res.status(500).json({ error: error.message }); // Devuelve un error HTTP 500 en caso de error
    }
});

router.get('/direccion/:idEmpleado', async (req, res) => {
    try {
        const pool = await db.pool;
        const request = await pool.request();
        const { idEmpleado } = req.params;
        request.input('id_emp', db.sql.Int, idEmpleado)
        const result = await request.query('SELECT * FROM direccion WHERE id=(SELECT cdg_dir FROM empleados WHERE id=@id_emp);');
        res.json(result.recordset); // Devuelve los registros como JSON
    } catch (error) {
        res.status(500).json({ error: error.message }); // Devuelve un error HTTP 500 en caso de error
    }
});

router.get('/direcciones', async (req, res) => {
    try {
        const pool = await db.pool;
        const request = await pool.request();
        const result = await request.query('SELECT * FROM direccion;');
        res.json(result.recordset); // Devuelve los registros como JSON
    } catch (error) {
        res.status(500).json({ error: error.message }); // Devuelve un error HTTP 500 en caso de error
    }
});

router.post('/empleado/nuevo', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {
        await transaction.begin();
        const request = await new db.sql.Request(transaction);
        let body = req.body;
        request.input('nombre', db.sql.VarChar, body.nombre);
        request.input('ap', db.sql.VarChar, body.ap);
        request.input('am', db.sql.VarChar, body.am);
        request.input('id_puesto', db.sql.Int, body.id_puesto);
        request.input('usuario', db.sql.VarChar, body.usuario);
        request.input('contrasena', db.sql.VarChar, body.contrasena);
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
        res.json({success: true, message: "Se ha creado el empleado correctamente"})

    } catch (error) {
        await transaction.rollback();
        res.status(500).json({success:false, message: error.message }); // Devuelve un error HTTP 500 en caso de error
    }
});

module.exports = router;