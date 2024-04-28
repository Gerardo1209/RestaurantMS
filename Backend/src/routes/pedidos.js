/**
 * En esta ruta se especifican todas las operaciones necesarias para manejar los pedidos
 */
const express = require('express');
const router = express.Router();
const db = require('../Auth/sql')
const authManager = require('../Auth/user_permision');


// VISUALIZAR PEDIDOS DE MESEROS, COCINEROS Y BARTENDERS







//Hasta el final exportar el router
module.exports = router;