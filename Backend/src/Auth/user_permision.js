const sql = require('./sql');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const algorithm = 'aes-256-cbc';

const genContrasena = async (contrasena) => {
    const saltRounds = 15;
    try{
        const hashedContasena = await bcrypt.hash(contrasena,saltRounds);
        return hashedContasena;
    }catch(err){

    }
}

const revContrasena = async (contrasena, usuario) => {
    var band = false;
    try{
        const pool = await sql.pool;
        const request = await pool.request();
        request.input('usuario',sql.sql.VarChar,usuario)
        const result = await request.query('SELECT contrasena FROM empleados WHERE usuario=@usuario;');
        console.log(result)
        hashedContasena = result.recordset[0].contrasena;
        await bcrypt.compare(contrasena, hashedContasena).then((result) => {
            band=result;
        });
    }catch(error){
        band = false;
    }
    return band;
}

const PUESTOS = {
    administrador: 1, //Todos los permisos
    bartender: 7, //Solo permisos para ver pedidios de bebidas
    cocinero: 8, //Solo permisos para ver pedidos de comida
    encargado: 9, //Todos los permisos menos los empleados
    mesero: 10 //Solo permisos para ver los pedidos de cocina y bebidas
}

/**
 * 
 * @param {*} usuario 
 * @param {*} contrasena 
 * @param {*} permisos Array de permisos
 * @returns boolean
 */
const revPermisos = async (contrasena, usuario, permisos) => {
    var band = false;
    try{
        const pool = await sql.pool;
        const request = await pool.request();
        request.input('usuario',sql.sql.VarChar,usuario)
        const result = await request.query('SELECT * FROM empleados WHERE usuario=@usuario;');
        if(result.recordset[0].contrasena == contrasena && result.recordset[0].activo == 'S') band = true;
        if(band){
            band = false;
            for (let i = 0; i < permisos.length; i++) {
                const element = permisos[i];
                if(result.recordset[0].id_puesto == element){
                    band = true;
                    break;
                }
            }
        }
    }catch(error){
        band = false;
    }
    return band;
}

module.exports = {
    genContrasena,
    revContrasena,
    revPermisos,
    PUESTOS
}