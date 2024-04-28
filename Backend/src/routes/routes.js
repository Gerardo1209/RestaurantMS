const express = require('express');
const router = express.Router();

//Archivos de las rutas
const empleados = require('./empleados');
const productos = require('./productos');

router.use('/empleados',empleados);
router.use('/productos',productos);

module.exports = router;