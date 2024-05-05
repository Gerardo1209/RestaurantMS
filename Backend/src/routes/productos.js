/**
 * En esta ruta se especifican todas las operaciones necesarias para manejar los Productos
 */
const express = require('express');
const router = express.Router();
const db = require('../Auth/sql')
const authManager = require('../Auth/user_permision');
const fileUpload = require('express-fileupload');

// 1. CATEGORIA
router.get('/categorias', async (req, res) => {
    try {
        const pool = await db.pool;
        const request = await pool.request();
        const result = await request.query('SELECT * FROM categoria');
        res.json({success: true, message: result.recordset});
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

router.get('/categoria/:idCategoria', async (req, res) => {
  try {
      const pool = await db.pool;
      const request = await pool.request();
      request.input('id',db.sql.Int,req.params.idCategoria)
      const result = await request.query('SELECT * FROM categoria WHERE id=@id');
      var resultCat = result.recordset[0];
      const resultSub = await request.query('SELECT * FROM subcategoria WHERE id_cat=@id');
      var subcategorias = resultSub.recordset;
      for (let i = 0; i < subcategorias.length; i++) {
        const subcat = subcategorias[i];
        const requestInner = await pool.request();
        requestInner.input('idSubcat', db.sql.Int, subcat.id);
        const resultProd = await requestInner.query('SELECT p.* FROM producto p WHERE p.id_subcat=@idSubcat;');
        subcategorias[i].productos = resultProd.recordset;
      }
      resultCat.subcategorias = subcategorias;
      res.json({success: true, message: resultCat});
  } catch (error) {
      res.json({ success: false, error: error.message });
  }
});

router.post('/categoria/nueva', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {
        await transaction.begin();
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador, authManager.PUESTOS.encargado])) throw new Error('No tienes permisos');
        const { image } = req.files;
        if(!image) throw new Error("Error al agregar la imagen");
        if (!/^image/.test(image.mimetype)) throw new Error("El archivo enviado no es una imagen");
        image.mv(__dirname+'/../upload/'+image.name);
        const request = await new db.sql.Request(transaction);
        let body = req.body;
        request.input('nombre', db.sql.VarChar, body.nombre);
        request.input('descripcion', db.sql.VarChar, body.descripcion);
        request.input('imagen',db.sql.VarChar, body.imagen);
        request.input('habilitado',db.sql.Bit, 1);

        const result = await request.query('INSERT INTO categoria VALUES(@nombre,@descripcion,@habilitado,@imagen); SELECT SCOPE_IDENTITY() AS id;');
        if(result.recordset[0].id == 0) throw new Error("Error al insertar la categoria");
    
        await transaction.commit();
        res.json({success: true, message: "Se ha creado la Categoria correctamente"});
    } catch (error) {
        await transaction.rollback();
        res.json({success:false, message: error.message });
    }
});

router.post('/categoria/cambio', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {
        await transaction.begin();
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador, authManager.PUESTOS.encargado])) throw new Error('No tienes permisos');
        const request = await new db.sql.Request(transaction);
        let body = req.body;
        request.input('id_cat', db.sql.VarChar, body.idCategoria);
        request.input('nombre', db.sql.VarChar, body.nombre);
        request.input('descripcion', db.sql.VarChar, body.descripcion);
        request.input('imagen',db.sql.VarChar, body.imagen);

        const result = await request.query('UPDATE categoria SET nombre=@nombre, descripcion=@descripcion WHERE id=@id_cat;');
        if(result.rowsAffected[0] === 0) throw new Error("Error al Actualizar la Categoria");
    
        await transaction.commit();
        res.json({success: true, message: "Se ha Actualizado la Categoria correctamente"});
    } catch (error) {
        await transaction.rollback();
        res.json({success:false, message: error.message });
    }
});

router.post('/categoria/baja', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {
        await transaction.begin();
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador, authManager.PUESTOS.encargado])) throw new Error('No tienes permisos');
        const request = await new db.sql.Request(transaction);
        let body = req.body;
        request.input('id_cat', db.sql.VarChar, body.idCategoria);

        const resultP = await request.query('UPDATE p SET p.habilitado = 0 FROM producto p INNER JOIN subcategoria s ON p.id_subcat = s.id WHERE s.id_cat = @id_cat;');        
        if(resultP.rowsAffected[0] === 0) throw new Error("Error al Deshabilitar Productos Adyascentes");

        const result = await request.query('UPDATE subcategoria SET habilitado=0 WHERE id_cat=@id_cat;');
        if(result.rowsAffected[0] === 0) throw new Error("Error al Deshabilitar Subcategorias Adyascentes");

        const resultC = await request.query('UPDATE categoria SET habilitado=0 WHERE id=@id_cat;');
        if(resultC.rowsAffected[0] === 0) throw new Error("Error al Deshabilitar Categoria");

        await transaction.commit();
        res.json({success: true, message: "Se ha Deshabilitado la Categoria, Subcategorias y Productos correctamente"});
    } catch (error) {
        await transaction.rollback();
        res.json({success:false, message: error.message });
    }
});

router.post('/categoria/recuperar', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {
        await transaction.begin();
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador, authManager.PUESTOS.encargado])) throw new Error('No tienes permisos');
        const request = await new db.sql.Request(transaction);
        let body = req.body;
        request.input('id_cat', db.sql.VarChar, body.idCategoria);

        const resultP = await request.query('UPDATE p SET p.habilitado = 1 FROM producto p INNER JOIN subcategoria s ON p.id_subcat = s.id WHERE s.id_cat = @id_cat;');        
        //if(resultP.rowsAffected[0] === 0) throw new Error("Error al Habilitar Productos Adyascentes");

        const result = await request.query('UPDATE subcategoria SET habilitado=1 WHERE id_cat=@id_cat;');
        //if(result.rowsAffected[0] === 0) throw new Error("Error al Habilitar Subcategorias Adyascentes");

        const resultC = await request.query('UPDATE categoria SET habilitado=1 WHERE id=@id_cat;');
        if(resultC.rowsAffected[0] === 0) throw new Error("Error al Habilitar Categoria");

        await transaction.commit();
        res.json({success: true, message: "Se han Habilitado la Categoria, Subcategorias y Productos correctamente"});
    } catch (error) {
        await transaction.rollback();
        res.json({success:false, message: error.message });
    }
});


// 2. SUBCATEGORIA

router.get('/subcategorias', async (req, res) => {
    try {
        const pool = await db.pool;
        const request = await pool.request();
        const result = await request.query('SELECT * FROM subcategoria;');
        res.json({success: true, message: result.recordset});
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

router.get('/subcategoria/:idSubCategoria', async (req, res) => {
  try {
      const pool = await db.pool;
      const request = await pool.request();
      request.input('id',db.sql.Int,req.params.idSubCategoria)
      const resultSub = await request.query('SELECT * FROM subcategoria WHERE id=@id');
      var subcategoria = resultSub.recordset[0];
      const resultProd = await request.query('SELECT p.* FROM producto p WHERE p.id_subcat=@id;');
      subcategoria.productos = resultProd.recordset;
      res.json({success: true, message: subcategoria});
  } catch (error) {
      res.json({ success: false, error: error.message });
  }
});

router.post('/subcategoria/nueva', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {
        
        await transaction.begin();
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador, authManager.PUESTOS.encargado])) throw new Error('No tienes permisos');
        const request = await new db.sql.Request(transaction);
        let body = req.body;
        request.input('id_cat', db.sql.Int, body.id_cat);
        request.input('nombre', db.sql.VarChar, body.nombre);
        request.input('descripcion',db.sql.VarChar,body.descripcion);
        request.input('habilitado',db.sql.Bit,1);

        const result = await request.query('INSERT INTO subcategoria VALUES(@id_cat,@nombre,@descripcion,@habilitado); SELECT SCOPE_IDENTITY() AS id;');
        if(result.recordset[0].id == 0) throw new Error("Error al insertar la subcategoria");
        await transaction.commit();
        res.json({success: true, message: "Se ha creado la subcategoria correctamente"});
    } catch (error) {
        await transaction.rollback();
        res.json({success:false, message: error.message });
    }
});

router.post('/subcategoria/cambio', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {
        
        await transaction.begin();
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador, authManager.PUESTOS.encargado])) throw new Error('No tienes permisos');
        const request = await new db.sql.Request(transaction);

        let body = req.body;
        request.input('id', db.sql.Int, body.id);
        request.input('id_cat', db.sql.Int, body.id_cat);
        request.input('nombre', db.sql.VarChar, body.nombre);
        request.input('descripcion',db.sql.VarChar,body.descripcion);
        const result = await request.query('UPDATE subcategoria SET id_cat=@id_cat, nombre=@nombre, descripcion=@descripcion WHERE id=@id;');
        if(result.rowsAffected[0] == 0) throw new Error("Error al editar la subcategoria");
        await transaction.commit();
        res.json({success: true, message: "Se ha editado la subcategoria correctamente"});
    } catch (error) {
        await transaction.rollback();
        res.json({success:false, message: error.message });
    }
});

router.post('/subcategoria/baja', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {
        
        await transaction.begin();
        const request = await new db.sql.Request(transaction);
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador, authManager.PUESTOS.encargado])) throw new Error('No tienes permisos');
        let body = req.body;
        request.input('id', db.sql.Int, body.id);
        const resultProd = await request.query('UPDATE producto SET habilitado=0 WHERE id_subcat=@id;');
        const result = await request.query('UPDATE subcategoria SET habilitado=0 WHERE id=@id;');
        if(result.rowsAffected[0] == 0) throw new Error("Error al dar de baja la subcategoria");
        await transaction.commit();
        res.json({success: true, message: "Se ha dado de baja la subcategoria correctamente"});
    } catch (error) {
        await transaction.rollback();
        res.json({success:false, message: error.message });
    }
});

router.post('/subcategoria/recuperar', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {
        await transaction.begin();
        const request = await new db.sql.Request(transaction);
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador, authManager.PUESTOS.encargado])) throw new Error('No tienes permisos');
        let body = req.body;
        request.input('id', db.sql.Int, body.id);
        const resultProd = await request.query('UPDATE producto SET habilitado=1 WHERE id_subcat=@id;');
        const result = await request.query('UPDATE subcategoria SET habilitado=1 WHERE id=@id;');
        if(result.rowsAffected[0] == 0) throw new Error("Error al recuperar la subcategoria");
        await transaction.commit();
        res.json({success: true, message: "Se ha recuperado la subcategoria correctamente"});
    } catch (error) {
        await transaction.rollback();
        res.json({success:false, message: error.message });
    }
});

// 3. INGREDIENTES

router.get('/ingredientes', async (req, res) => {
    try {
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador, authManager.PUESTOS.encargado])) throw new Error('No tienes permisos');
        const pool = await db.pool;
        const request = await pool.request();
        const result = await request.query('SELECT * FROM ingredientes;');
        res.json({success: true, message: result.recordset});
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

router.get('/ingrediente/:idIngrediente', async (req, res) => {
    try {
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador, authManager.PUESTOS.encargado])) throw new Error('No tienes permisos');
        const pool = await db.pool;
        const request = await pool.request();
        request.input('id', db.sql.Int, req.params.idIngrediente);
        const result = await request.query('SELECT * FROM ingredientes WHERE id=@id;');
        res.json({success: true, message: result.recordset});
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

router.post('/ingrediente/nuevo', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {  
        await transaction.begin();
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador, authManager.PUESTOS.encargado])) throw new Error('No tienes permisos');
        const request = await new db.sql.Request(transaction);
        
        let body = req.body;
        request.input('nombre', db.sql.VarChar, body.nombre);
        request.input('costo', db.sql.Float, body.costo);
        request.input('descripcion',db.sql.VarChar,body.descripcion);
        request.input('habilitado',db.sql.Bit,1);
        const result = await request.query('INSERT INTO ingredientes VALUES(@nombre,@descripcion,@costo,@habilitado); SELECT SCOPE_IDENTITY() AS id;');
        if(result.recordset[0].id == 0) throw new Error("Error al insertar el ingrediente");
        await transaction.commit();
        res.json({success: true, message: "Se ha creado el ingrediente correctamente"});
    } catch (error) {
        await transaction.rollback();
        res.json({success:false, message: error.message });
    }
});

router.post('/ingrediente/cambio', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {
       
        await transaction.begin();
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador, authManager.PUESTOS.encargado])) throw new Error('No tienes permisos');
        const request = await new db.sql.Request(transaction);
        let body = req.body;
        request.input('id', db.sql.Int, body.id);
        request.input('nombre', db.sql.VarChar, body.nombre);
        request.input('costo', db.sql.Float, body.costo);
        request.input('descripcion',db.sql.VarChar,body.descripcion);
        const result = await request.query('UPDATE ingredientes SET nombre=@nombre, costo=@costo, descripcion=@descripcion WHERE id=@id;');
        if(result.rowsAffected[0] == 0) throw new Error("Error al editar el ingrediente");
        await transaction.commit();
        res.json({success: true, message: "Se ha editado el ingrediente correctamente"});
    } catch (error) {
        await transaction.rollback();
        res.json({success:false, message: error.message });
    }
});

router.post('/ingrediente/baja', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {
        
        await transaction.begin();
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador, authManager.PUESTOS.encargado])) throw new Error('No tienes permisos');
        const request = await new db.sql.Request(transaction);
        let body = req.body;
        request.input('id', db.sql.Int, body.id);
        const result = await request.query('UPDATE ingredientes SET habilitado=0 WHERE id=@id;');
        if(result.rowsAffected[0] == 0) throw new Error("Error al dar de baja el ingrediente");
        await transaction.commit();
        res.json({success: true, message: "Se ha dado de baja el ingrediente correctamente"});
    } catch (error) {
        await transaction.rollback();
        res.json({success:false, message: error.message });
    }
});

router.post('/ingrediente/recuperar', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {
        
        await transaction.begin();
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador, authManager.PUESTOS.encargado])) throw new Error('No tienes permisos');
        const request = await new db.sql.Request(transaction);
        let body = req.body;
        request.input('id', db.sql.Int, body.id);
        const result = await request.query('UPDATE ingredientes SET habilitado=1 WHERE id=@id;');
        if(result.rowsAffected[0] == 0) throw new Error("Error al recuperar el ingrediente");
        await transaction.commit();
        res.json({success: true, message: "Se ha recuperado el ingrediente correctamente"});
    } catch (error) {
        await transaction.rollback();
        res.json({success:false, message: error.message });
    }
});

// 4. PRODUCTOS (ALTAS, BAJAS, CONSULTAS)
router.get('/productos', async (req, res) => {
    try {
        const pool = await db.pool;
        const request = await pool.request();
        const result = await request.query('SELECT p.*, s.id_cat FROM producto p, subcategoria s WHERE p.id_subcat=s.id;');
        res.json({success: true, message: result.recordset});
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

router.get('/producto/:idProducto', async (req, res) => {
    try {
        const pool = await db.pool;
        const request = await pool.request();
        request.input('id', db.sql.Int, req.params.idProducto);
        const resultIng = await request.query('SELECT i.*,p.cantidad FROM ingredientes i, prod_ingr p WHERE p.id_prod = @id AND p.id_ingre=i.id;');
        const result = await request.query('SELECT p.*, s.id_cat FROM producto p, subcategoria s WHERE p.id=@id AND p.id_subcat=s.id;');
        var producto = result.recordset[0];
        producto.ingredientes = resultIng.recordset;
        res.json({success: true, message: producto});
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

router.post('/producto/nuevo', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {  
        await transaction.begin();
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador, authManager.PUESTOS.encargado])) throw new Error('No tienes permisos');
        const { image } = req.files;
        if(!image) throw new Error("Error al agregar la imagen");
        if (!/^image/.test(image.mimetype)) throw new Error("El archivo enviado no es una imagen");
        image.mv(__dirname+'/../upload/'+image.name);
        const request = await new db.sql.Request(transaction);
        let body = req.body;
        request.input('nombre', db.sql.VarChar, body.nombre);
        request.input('precio', db.sql.Float, body.precio);
        request.input('descripcion',db.sql.VarChar,body.descripcion);
        request.input('id_subcat',db.sql.Int,body.id_subcat);
        request.input('imagen',db.sql.VarChar,image.name);
        request.input('tiempo',db.sql.VarChar,body.tiempo);
        request.input('habilitado',db.sql.Bit,1);
        if(!body.ingredientes) throw new Error("No se enviaron los ingredientes del producto");
        const result = await request.query('INSERT INTO producto VALUES(@nombre,@descripcion,@precio,@id_subcat,@imagen,@habilitado); SELECT SCOPE_IDENTITY() AS id;');
        if(result.recordset[0].id == 0) throw new Error("Error al insertar el producto");
        var ingredientes = JSON.parse(body.ingredientes);
        for (let i = 0; i < ingredientes.length; i++) {
            const ingrediente = ingredientes[i];
            const newReq = await new db.sql.Request(transaction);
            newReq.input('id_producto',db.sql.Int,result.recordset[0].id);
            newReq.input('id_ingrediente',db.sql.Int,ingrediente.id)
            newReq.input('cantidad',db.sql.VarChar, ingrediente.cantidad)
            const resultProdIng = await newReq.query('INSERT INTO prod_ingr VALUES(@id_producto,@id_ingrediente,@cantidad); SELECT SCOPE_IDENTITY() AS id;');
            if(resultProdIng.recordset[0].id == 0) throw new Error("Error al insertar la relación entre el producto e ingredientes");
        }
        await transaction.commit();
        res.json({success: true, message: "Se ha creado el producto correctamente"});
    } catch (error) {
        await transaction.rollback();
        res.json({success:false, message: error.message });
    }
});

router.post('/producto/cambio', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {  
        await transaction.begin();
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador, authManager.PUESTOS.encargado])) throw new Error('No tienes permisos');
        const request = await new db.sql.Request(transaction);
        let body = req.body;
        request.input('id',db.sql.Int,body.id);
        request.input('nombre', db.sql.VarChar, body.nombre);
        request.input('precio', db.sql.Float, body.precio);
        request.input('descripcion',db.sql.VarChar,body.descripcion);
        request.input('id_subcat',db.sql.VarChar,body.id_subcat);
        request.input('imagen',db.sql.VarChar,body.imagen);
        request.input('tiempo',db.sql.VarChar,body.tiempo);
        if(!body.ingredientes) throw new Error("No se enviaron los ingredientes del producto");
        const result = await request.query('UPDATE producto SET nombre=@nombre,descripcion=@descripcion,precio=@precio,id_subcat=@id_subcat,imagen=@imagen WHERE id=@id;');
        if(result.rowsAffected[0] == 0) throw new Error("Error al editar el producto");
        const resultDelPrdIng = await request.query('DELETE FROM prod_ingr WHERE id_prod=@id');
        if(resultDelPrdIng.rowsAffected[0] == 0) throw new Error("Error al quitar la relación entre el producto e ingredientes");
        var ingredientes = JSON.parse(body.ingredientes);
        for (let i = 0; i < ingredientes.length; i++) {
            const ingrediente = ingredientes[i];
            const newReq = await new db.sql.Request(transaction);
            newReq.input('id_producto',db.sql.Int,body.id);
            newReq.input('id_ingrediente',db.sql.Int,ingrediente.id)
            newReq.input('cantidad',db.sql.VarChar, ingrediente.cantidad)
            const resultProdIng = await newReq.query('INSERT INTO prod_ingr VALUES(@id_producto,@id_ingrediente,@cantidad); SELECT SCOPE_IDENTITY() AS id;');
            if(resultProdIng.recordset[0].id == 0) throw new Error("Error al insertar la relación entre el producto e ingredientes");
        }
        await transaction.commit();
        res.json({success: true, message: "Se ha editado el producto correctamente"});
    } catch (error) {
        await transaction.rollback();
        res.json({success:false, message: error.message });
    }
});

router.post('/prodcuto/baja', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {
        await transaction.begin();
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador, authManager.PUESTOS.encargado])) throw new Error('No tienes permisos');
        const request = await new db.sql.Request(transaction);
        let body = req.body;
        request.input('id', db.sql.Int, body.id);
        const result = await request.query('UPDATE prodcuto SET habilitado=0 WHERE id=@id;');
        if(result.rowsAffected[0] == 0) throw new Error("Error al dar de baja el prodcuto");
        await transaction.commit();
        res.json({success: true, message: "Se ha dado de baja el producto correctamente"});
    } catch (error) {
        await transaction.rollback();
        res.json({success:false, message: error.message });
    }
});

router.post('/prodcuto/recuperar', async (req, res) => {
    const pool = await db.pool;
    const transaction = await new db.sql.Transaction(pool);
    try {
        
        await transaction.begin();
        if(!await authManager.revPermisos(req.body.usr_contrasena, req.body.usr_usuario, [authManager.PUESTOS.administrador, authManager.PUESTOS.encargado])) throw new Error('No tienes permisos');
        const request = await new db.sql.Request(transaction);
        let body = req.body;
        request.input('id', db.sql.Int, body.id);
        const result = await request.query('UPDATE producto SET habilitado=1 WHERE id=@id;');
        if(result.rowsAffected[0] == 0) throw new Error("Error al recuperar el producto");
        await transaction.commit();
        res.json({success: true, message: "Se ha recuperado el producto correctamente"});
    } catch (error) {
        await transaction.rollback();
        res.json({success:false, message: error.message });
    }
});

// Visualizar Productos y sus Ingredientes correspondientes
router.get('/pi', async (req, res) => {
    try {
        const pool = await db.pool;
        const request = await pool.request();
        const result = await request.query('SELECT prod_ingr.id as "ID", p.id as "ID Producto", p.nombre as "Nombre", i.ID as "ID Ingrediente", i.nombre as "Nombre Ingrediente", prod_ingr.cantidad as "Cantidad" FROM prod_ingr join producto p on prod_ingr.id_prod = p.id join ingredientes i on prod_ingr.id_ingre = i.id;');
        res.json({success: true, message: result.recordset});
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});


module.exports = router;