const express = require('express');
const router = express.Router();

//Archivos de las rutas
const empleados = require('./empleados');
const productos = require('./productos');
const clientes = require('./clientes');

router.use('/empleados',empleados);
router.use('/productos',productos);
router.use('/clientes',clientes)

module.exports = router;