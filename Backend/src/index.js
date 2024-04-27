const express = require('express');
const sql = require('mssql');

const app = express();

// Configuración de la conexión a la base de datos
const config = {
    server: 'localhost',
    database: 'Restaurante_Final',
    user: 'sa', // Nombre de usuario
    password: '12345', // Contraseña
    options: {
        encrypt: false, // Dependiendo de tu configuración de SQL Server, puede que necesites cambiar este valor
        trustServerCertificate: false // Dependiendo de tu configuración de SQL Server, puede que necesites cambiar este valor
    }
};

// Función para conectar a la base de datos y ejecutar una consulta
async function conectarYConsultar() {
    try {
        // Conexión a la base de datos
        await sql.connect(config);

        // Consulta SQL
        const resultado = await sql.query`SELECT * FROM Cliente`;

        return resultado.recordset; // Devuelve los registros obtenidos

    } catch (error) {
        throw new Error('Error al conectar a la base de datos: ' + error.message);
    } finally {
        // Cierra la conexión a la base de datos
        await sql.close();
    }
}

// Ruta para manejar las solicitudes HTTP
app.get('/clientes', async (req, res) => {
    try {
        const clientes = await conectarYConsultar();
        res.json(clientes); // Devuelve los registros como JSON
    } catch (error) {
        res.status(500).json({ error: error.message }); // Devuelve un error HTTP 500 en caso de error
    }
});

// Puerto en el que el servidor va a escuchar
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
