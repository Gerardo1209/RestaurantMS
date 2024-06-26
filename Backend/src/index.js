const express = require('express');
const db = require('./Auth/sql')
const app = express();
const routes = require('./routes/routes')
const cors = require("cors")
const fileUpload = require('express-fileupload');
// Middleware para parsear JSON
app.use(express.json());
// Middleware para parsear cuerpos con datos de formulario urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(fileUpload());

app.use('/', routes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
