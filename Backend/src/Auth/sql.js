const sql = require('mssql');
const config = {
    server: '31.220.107.117',
    database: 'Restaurante Final',
    user: 'sa', // Nombre de usuario
    password: 'axz123.!', // Contraseña
    options: {
        encrypt: false, // Dependiendo de tu configuración de SQL Server, puede que necesites cambiar este valor
        trustServerCertificate: false // Dependiendo de tu configuración de SQL Server, puede que necesites cambiar este valor
    }
};

var pool = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log("Base de datos conectada");
        return pool;
    })
    .catch((error) => {
        console.log("La conexión a la base de datos fallo");
    })

module.exports = {
    sql, pool
}