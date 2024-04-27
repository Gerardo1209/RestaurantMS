/**
 * En esta ruta se especifican todas las operaciones necesarias para manejar los empleados
 */
const express = require('express');
const router = express.Router();
const db = require('../Auth/sql')

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

router.get('/empleado/:idEmpleado', async (req, res) => {
    try {
        const pool = await db.pool;
        const request = await pool.request();
        const { idEmpleado } = req.params;
        request.input('id_emp', db.sql.Int, idEmpleado)
        const result = await request.query('SELECT * FROM empleados WHERE id=@id_emp');
        res.json(result.recordset); // Devuelve los registros como JSON
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
        const result = await request.query('SELECT * FROM direccion WHERE id=(SELECT cdg_dir FROM empleados WHERE id=@id_emp)');
        res.json(result.recordset); // Devuelve los registros como JSON
    } catch (error) {
        res.status(500).json({ error: error.message }); // Devuelve un error HTTP 500 en caso de error
    }
});

router.post('/empleado/nuevo', async (req, res) => {
    try {
        let body = req.body
        console.log(body)
        const pool = await db.pool;
        const request = await pool.request();
        request.input('nombre', db.sql.Int, body.nombre);
        request.input('ap', db.sql.Int, body.ap);
        request.input('am', db.sql.Int, body.am);
        request.input('idPuesto', db.sql.Int, body.puesto);
        const result = await request.query('INSERT INTO empleados VALUES()')
        res.json("Empleado creado"); // Devuelve los registros como JSON
    } catch (error) {
        res.status(500).json({ error: error.message }); // Devuelve un error HTTP 500 en caso de error
    }
});

module.exports = router;