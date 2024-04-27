const express = require('express');
const db = require('./Auth/sql')
const app = express();


//Ruta para manejar las solicitudes HTTP
app.get('/clientes', async (req, res) => {
    try {
        const pool = await db.pool;
        const result = await pool.request().query('SELECT * FROM cliente');
        res.json(result.recordset); // Devuelve los registros como JSON
    } catch (error) {
        res.status(500).json({ error: error.message }); // Devuelve un error HTTP 500 en caso de error
    }
});

// Puerto en el que el servidor va a escuchar
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
