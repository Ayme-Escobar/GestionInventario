const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors'); // Para manejar CORS

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Habilitar CORS para todas las solicitudes

// Configuración de conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'Inventario',
});

db.connect((err) => {
    if (err) throw err;
    console.log('Conectado a la base de datos.');
});

// =========================
// CRUD para Categorías
// =========================

// Obtener todas las categorías activas
app.get('/categorias/activas', (req, res) => {
    db.query('SELECT * FROM Categoria WHERE activo = TRUE', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});
// Obtener todas las categorías (activas e inactivas)
app.get('/categorias', (req, res) => {
    db.query('SELECT * FROM Categoria', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Crear una categoría
app.post('/categorias', (req, res) => {
    const { nombre, descripcion } = req.body;

    if (!nombre || !descripcion) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    db.query(
        'INSERT INTO Categoria (nombre, descripcion, activo) VALUES (?, ?, TRUE)',
        [nombre, descripcion],
        (err) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    // Manejo del error de entrada duplicada
                    return res.status(400).json({ message: 'El nombre de la categoría ya existe' });
                }
                // Manejo de otros errores
                return res.status(500).json({ message: 'Error al crear la categoría' });
            }
            res.json({ message: 'Categoría creada con éxito' });
        }
    );
});


// Actualizar una categoría
app.put('/categorias/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, activo } = req.body;

    if (activo !== undefined) {
        db.query(
            'UPDATE Categoria SET activo = ? WHERE idCategoria = ?',
            [activo, id],
            (err) => {
                if (err) return res.status(500).json({ message: 'Error al actualizar el estado de la categoría' });
                res.json({ message: `Categoría ${activo ? 'activada' : 'desactivada'} con éxito` });
            }
        );
        return;
    }

    if (!nombre || !descripcion) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Verificar si el nombre ya existe para otra categoría
    db.query('SELECT * FROM Categoria WHERE nombre = ? AND idCategoria != ?', [nombre, id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error al verificar la categoría' });
        if (results.length > 0) {
            return res.status(400).json({ message: 'El nombre de la categoría ya existe' });
        }

        db.query(
            'UPDATE Categoria SET nombre = ?, descripcion = ? WHERE idCategoria = ?',
            [nombre, descripcion, id],
            (err) => {
                if (err) return res.status(500).json({ message: 'Error al actualizar la categoría' });
                res.json({ message: 'Categoría actualizada con éxito' });
            }
        );
    });
});


// Desactivar una categoría (borrado lógico)
app.delete('/categorias/:id', (req, res) => {
    const { id } = req.params;
    db.query('UPDATE Categoria SET activo = FALSE WHERE idCategoria = ?', [id], (err) => {
        if (err) throw err;
        res.json({ message: 'Categoría desactivada con éxito' });
    });
});

// Reactivar una categoría
app.put('/categorias/reactivar/:id', (req, res) => {
    const { id } = req.params;
    db.query('UPDATE Categoria SET activo = TRUE WHERE idCategoria = ?', [id], (err) => {
        if (err) throw err;
        res.json({ message: 'Categoría reactivada con éxito' });
    });
});

// =========================
// CRUD para Productos
// =========================

// Obtener todos los productos activos
app.get('/productos', (req, res) => {
    db.query('SELECT * FROM Producto', (err, results) => {
        if (err) throw err;
        res.json(results); // Devuelve todos los productos
    });
});

// Obtener un producto específico (incluidos inactivos)
app.get('/productos/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM Producto WHERE idProducto = ?', [id], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    });
});

// Crear un producto
app.post('/productos', (req, res) => {
    const { nombre, descripcion, precio, stock, idCategoria } = req.body;
    if (!nombre || !descripcion || !precio || !stock || !idCategoria) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Verificar si el nombre ya existe
    db.query('SELECT * FROM Producto WHERE nombre = ?', [nombre], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error al verificar el producto' });
        if (results.length > 0) {
            return res.status(400).json({ message: 'El nombre del producto ya existe' });
        }

        // Si no existe, proceder a crearlo
        db.query(
            'INSERT INTO Producto (nombre, descripcion, precio, stock, idCategoria, activo) VALUES (?, ?, ?, ?, ?, TRUE)',
            [nombre, descripcion, precio, stock, idCategoria],
            (err) => {
                if (err) return res.status(500).json({ message: 'Error al crear el producto' });
                res.json({ message: 'Producto creado con éxito' });
            }
        );
    });
});


// Actualizar un producto (incluido el campo activo)
app.put('/productos/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, idCategoria, activo } = req.body;

    if (activo !== undefined) {
        db.query(
            'UPDATE Producto SET activo = ? WHERE idProducto = ?',
            [activo, id],
            (err) => {
                if (err) return res.status(500).json({ message: 'Error al actualizar el estado del producto' });
                res.json({ message: `Producto ${activo ? 'activado' : 'desactivado'} con éxito` });
            }
        );
        return;
    }

    if (!nombre || !descripcion || !precio || !stock || !idCategoria) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios para actualizar un producto' });
    }

    // Verificar si el nombre ya existe para otro producto
    db.query('SELECT * FROM Producto WHERE nombre = ? AND idProducto != ?', [nombre, id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error al verificar el producto' });
        if (results.length > 0) {
            return res.status(400).json({ message: 'El nombre del producto ya existe' });
        }

        db.query(
            'UPDATE Producto SET nombre = ?, descripcion = ?, precio = ?, stock = ?, idCategoria = ? WHERE idProducto = ?',
            [nombre, descripcion, precio, stock, idCategoria, id],
            (err) => {
                if (err) return res.status(500).json({ message: 'Error al actualizar el producto' });
                res.json({ message: 'Producto actualizado con éxito' });
            }
        );
    });
});


// Desactivar un producto (borrado lógico)
app.delete('/productos/:id', (req, res) => {
    const { id } = req.params;
    db.query('UPDATE Producto SET activo = FALSE WHERE idProducto = ?', [id], (err) => {
        if (err) throw err;
        res.json({ message: 'Producto desactivado con éxito' });
    });
});

// Reactivar un producto
app.put('/productos/reactivar/:id', (req, res) => {
    const { id } = req.params;
    db.query('UPDATE Producto SET activo = TRUE WHERE idProducto = ?', [id], (err) => {
        if (err) throw err;
        res.json({ message: 'Producto reactivado con éxito' });
    });
});

// =========================
// CRUD para Reportes
// =========================

// Obtener todos los reportes
app.get('/reportes', (req, res) => {
    db.query('SELECT * FROM Reporte', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Crear un reporte
app.post('/reportes', (req, res) => {
    console.log(req.body);  // Verifica lo que estás recibiendo en el servidor
    const { fechaGeneracion, idProducto } = req.body;

    if (!fechaGeneracion || !idProducto || !Array.isArray(idProducto)) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Guardar el reporte con la fecha
    db.query('INSERT INTO Reporte (fechaGeneracion) VALUES (?)', [fechaGeneracion], (err, result) => {
        if (err) throw err;

        const idReporte = result.insertId;  // Obtén el ID del reporte recién creado

        // Ahora, asociamos los productos con el reporte en la tabla detalle_reporte
        const reportDetails = idProducto.map(id => [idReporte, id]);

        // Insertar los detalles de los productos en la tabla detalle_reporte
        db.query('INSERT INTO detalle_reporte (idReporte, idProducto) VALUES ?', [reportDetails], (err) => {
            if (err) throw err;
            res.json({ message: 'Reporte creado con éxito' });
        });
    });
});




// Actualizar un reporte
app.put('/reportes/:id', (req, res) => {
    const { id } = req.params;
    const { fechaGeneracion, idProducto } = req.body;
    if (!fechaGeneracion || !idProducto) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    db.query(
        'UPDATE Reporte SET fechaGeneracion = ?, idProducto = ? WHERE idReporte = ?',
        [fechaGeneracion, idProducto, id],
        (err) => {
            if (err) throw err;
            res.json({ message: 'Reporte actualizado con éxito' });
        }
    );
});

// Eliminar un reporte
app.delete('/reportes/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM Reporte WHERE idReporte = ?', [id], (err) => {
        if (err) throw err;
        res.json({ message: 'Reporte eliminado con éxito' });
    });
});

// =========================
// Iniciar el servidor
// =========================

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
