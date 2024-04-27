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

const revContrasena = async (contrasena, correoUsr) => {
    q = `SELECT contrasena FROM Usuario WHERE RFC=? OR correo=?;`;
    var band = false;
    var hashedContasena = '';
    await sql.query(q,[correoUsr, correoUsr]).then(async (res) => {
        if(res[0]){
            hashedContasena = res[0].contrasena;
        }else{
            q = `SELECT contrasena FROM empleado WHERE correo=?;`;
            await sql.query(q, [correoUsr]).then((empContasena)=>{
                hashedContasena = empContasena[0].contrasena;
            }).catch((err)=>{})
        }
    }).catch((err) => {});
    await bcrypt.compare(contrasena, hashedContasena).then((result) => {
        band=result;
    });
    return band;
}

module.exports = {
    genContrasena,
    revContrasena
}