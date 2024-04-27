const express = require('express');
const router = express.Router();

//Archivos de las rutas
const empleados = require('./empleados')

router.use('/empleados',empleados);

module.exports = router;