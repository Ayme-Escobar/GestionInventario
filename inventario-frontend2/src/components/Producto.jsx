import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSync, faBars } from '@fortawesome/free-solid-svg-icons';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // Para tablas automáticas
import './Producto.css'; // Importa el CSS personalizado

const Producto = () => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [filteredProductos, setFilteredProductos] = useState([]);
    const [search, setSearch] = useState('');
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [precio, setPrecio] = useState('');
    const [stock, setStock] = useState('');
    const [idCategoria, setIdCategoria] = useState('');
    const [selectedProducto, setSelectedProducto] = useState(null);
    const [categoriasActivas, setCategoriasActivas] = useState([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [currentAction, setCurrentAction] = useState(null);
    const [currentProductId, setCurrentProductId] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        fetchProductos();
        fetchCategorias();
    }, []);

    const fetchProductos = () => {
        axios.get('http://localhost:3000/productos')
            .then((response) => {
                setProductos(response.data);
                setFilteredProductos(response.data);
            })
            .catch((error) => console.error('Error al obtener los productos:', error));
    };

    const fetchCategorias = () => {
        axios.get('http://localhost:3000/categorias')
            .then((response) => {
                setCategorias(response.data); // Cargar todas las categorías
                setCategoriasActivas(response.data.filter((categoria) => categoria.activo)); // Filtrar activas
            })
            .catch((error) => console.error('Error al obtener las categorías:', error));
    };


    const handleSearch = (e) => {
        setSearch(e.target.value);
        const filtered = productos.filter((producto) =>
            producto.nombre.toLowerCase().includes(e.target.value.toLowerCase()) ||
            producto.descripcion.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setFilteredProductos(filtered);
    };

    const handleSave = () => {
        if (!nombre || !descripcion || !precio || !stock || !idCategoria) {
            setAlertMessage('Por favor, completa todos los campos.');
            setShowAlertModal(true);
            return;
        }

        if (selectedProducto) {
            axios.put(`http://localhost:3000/productos/${selectedProducto.idProducto}`, {
                nombre, descripcion, precio, stock, idCategoria,
            })
                .then(() => {
                    setAlertMessage('Producto actualizado con éxito');
                    setShowAlertModal(true);
                    resetForm();
                    fetchProductos();
                })
                .catch((error) => {
                    if (error.response && error.response.data.message === 'El nombre del producto ya existe') {
                        setAlertMessage('Error: El nombre del producto ya existe.');
                        setShowAlertModal(true);
                    } else {
                        console.error('Error al actualizar el producto:', error);
                    }
                });
        } else {
            axios.post('http://localhost:3000/productos', {
                nombre, descripcion, precio, stock, idCategoria,
            })
                .then(() => {
                    setAlertMessage('Producto creado con éxito');
                    setShowAlertModal(true);
                    resetForm();
                    fetchProductos();
                })
                .catch((error) => {
                    if (error.response && error.response.data.message === 'El nombre del producto ya existe') {
                        setAlertMessage('Error: El nombre del producto ya existe.');
                        setShowAlertModal(true);
                    } else {
                        console.error('Error al crear el producto:', error);
                    }
                });
        }
    };

    const handleDelete = (id) => {
        axios.put(`http://localhost:3000/productos/${id}`, { activo: false })
            .then(() => {
                setAlertMessage('Producto desactivado con éxito');
                setShowAlertModal(true);
                fetchProductos();
            })
            .catch((error) => console.error('Error al desactivar el producto:', error));
    };

    const handleReactivate = (id) => {
        axios.put(`http://localhost:3000/productos/reactivar/${id}`, { activo: true })
            .then(() => {
                setAlertMessage('Producto reactivado con éxito');
                setShowAlertModal(true);
                fetchProductos();
            })
            .catch((error) => console.error('Error al reactivar el producto:', error));
    };

    const openConfirmModal = (action, productId) => {
        setCurrentAction(action);
        setCurrentProductId(productId);
        setShowConfirmModal(true);
    };

    const handleConfirmAction = () => {
        if (currentAction === "reactivate") {
            handleReactivate(currentProductId);
        } else if (currentAction === "deactivate") {
            handleDelete(currentProductId);
        }
        setShowConfirmModal(false);
    };

    const resetForm = () => {
        setNombre('');
        setDescripcion('');
        setPrecio('');
        setStock('');
        setIdCategoria('');
        setSelectedProducto(null);
    };

    const handleEdit = (producto) => {
        setSelectedProducto(producto);
        setNombre(producto.nombre);
        setDescripcion(producto.descripcion);
        setPrecio(producto.precio);
        setStock(producto.stock);
        setIdCategoria(producto.idCategoria);
    };
    const generarReportePDF = () => {
        const doc = new jsPDF();

        // Título del reporte
        doc.setFontSize(18);
        doc.text('Reporte de Inventario', 14, 20);

        // Fecha actual en el formato adecuado
        const fecha = new Date();
        const fechaFormateada = fecha.toISOString().slice(0, 19).replace('T', ' '); // Convierte la fecha al formato 'YYYY-MM-DD HH:MM:SS'

        doc.setFontSize(12);
        doc.text(`Fecha: ${fechaFormateada}`, 14, 30);

        // Generar tabla
        const tablaColumnas = ['ID', 'Nombre', 'Descripción', 'Precio', 'Stock', 'Categoría', 'Estado'];
        const tablaFilas = productos.map((producto) => [
            producto.idProducto,
            producto.nombre,
            producto.descripcion,
            `$${producto.precio}`,
            producto.stock,
            categorias.find(c => c.idCategoria === producto.idCategoria)?.nombre || 'Sin categoría',
            producto.activo ? 'Activo' : 'Inactivo'  // Agregar columna para el estado
        ]);

        doc.autoTable({
            head: [tablaColumnas],
            body: tablaFilas,
            startY: 40,
        });

        // Guardar el PDF
        doc.save('reporte_inventario.pdf');

        // Enviar el reporte al backend con la fecha y los productos
        axios.post('http://localhost:3000/reportes', {
            fechaGeneracion: fechaFormateada,
            idProducto: productos.map(p => p.idProducto),  // Enviar los IDs de los productos asociados
        })
            .then((response) => {
                console.log('Reporte guardado con éxito');
            })
            .catch((error) => {
                console.error('Error al guardar el reporte', error);
            });
    };




    return (
        <div className="d-flex">
            {/* Botón de hamburguesa */}
            <button
                className="btn btn-light position-fixed m-2"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                style={{ zIndex: 1000 }}
            >
                <FontAwesomeIcon icon={faBars} />
            </button>

            {/* Sidebar */}
            <div className={`sidebar ${isSidebarOpen ? 'open' : 'collapsed'}`}>
                <h3 className="text-center">Ventas</h3>
                <div className="text-center my-4">
                    <div className="profile">
                        <img
                            src="https://www.microtech.es/hubfs/Fotos%20blog/inventario.jpg"
                            alt="Perfil"
                            className="rounded-circle mb-2"
                        />
                        <br></br>                        
                        <br></br>                        
                        <br></br>                                                
                    </div>                    
                </div>
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <a href="/" className="nav-link">
                            Menú Principal
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="/categorias" className="nav-link">
                            Categorías
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="/productos" className="nav-link active">
                            Productos
                        </a>
                    </li>
                </ul>
                <br></br>                        
                <br></br>     
                <br></br>     
                <br></br>
                <div className="text-center my-4">
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <p>Aymé Escobar</p>
                <p>Ricardo Rivadeneira</p>
                </div>                
            </div>


            <div
                className={`container mt-4 ${isSidebarOpen ? '' : 'full-width'}`}
            >
                <h2 className="text-center mb-4">Lista de Productos</h2>

                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar por Nombre o Descripción"
                        value={search}
                        onChange={handleSearch}
                    />
                </div>

                <div className="d-flex justify-content-center gap-3 mb-4">
                    <button
                        className="btn btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#addEditModal"
                        onClick={resetForm}
                    >
                        + Añadir Producto
                    </button>
                    {/* Botón para generar el reporte */}
                    <button className="btn btn-success" onClick={generarReportePDF}>
                        Descargar Reporte en PDF
                    </button>
                </div>


                <table className="table table-striped table-hover">
                    <thead className="table-primary">
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Categoría</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProductos.map((producto) => (
                            <tr key={producto.idProducto} className={producto.activo ? '' : 'table-secondary'}>
                                <td>{producto.idProducto}</td>
                                <td>{producto.nombre}</td>
                                <td>{producto.descripcion}</td>
                                <td>${producto.precio}</td>
                                <td>{producto.stock}</td>
                                <td>{categorias.find(c => c.idCategoria === producto.idCategoria)?.nombre || 'Sin categoría'}</td>
                                <td>
                                    <span className={`badge ${producto.activo ? 'bg-success' : 'bg-danger'}`}>
                                        {producto.activo ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td>
                                    {producto.activo ? (
                                        <>
                                            <button
                                                className="btn btn-warning me-2"
                                                data-bs-toggle="modal"
                                                data-bs-target="#addEditModal"
                                                onClick={() => handleEdit(producto)}
                                            >
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => openConfirmModal("deactivate", producto.idProducto)}
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            className="btn btn-success"
                                            onClick={() => openConfirmModal("reactivate", producto.idProducto)}
                                        >
                                            <FontAwesomeIcon icon={faSync} /> Reactivar
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="modal fade" id="addEditModal" tabIndex="-1" aria-labelledby="addEditModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="addEditModalLabel">
                                    {selectedProducto ? 'Editar Producto' : 'Añadir Producto'}
                                </h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="text"
                                    className="form-control mb-3"
                                    placeholder="Nombre"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                />
                                <input
                                    type="text"
                                    className="form-control mb-3"
                                    placeholder="Descripción"
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                />
                                <input
                                    type="number"
                                    className="form-control mb-3"
                                    placeholder="Precio"
                                    value={precio}
                                    onChange={(e) => setPrecio(e.target.value)}
                                />
                                <input
                                    type="number"
                                    className="form-control mb-3"
                                    placeholder="Stock"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                />
                                <select
                                    className="form-select mb-3"
                                    value={idCategoria}
                                    onChange={(e) => setIdCategoria(e.target.value)}
                                >
                                    <option value="">Selecciona una categoría</option>
                                    {categoriasActivas.map((categoria) => (
                                        <option key={categoria.idCategoria} value={categoria.idCategoria}>
                                            {categoria.nombre}
                                        </option>
                                    ))}
                                </select>

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                    Cancelar
                                </button>
                                <button type="button" className="btn btn-primary" onClick={handleSave} data-bs-dismiss="modal">
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {showConfirmModal && (
                    <div className="modal-overlay">
                        <div className="modal-confirm">
                            <h5>Confirmación</h5>
                            <p>
                                ¿Estás seguro de {currentAction === "reactivate" ? "reactivar" : "desactivar"} este producto?
                            </p>
                            <div className="modal-actions">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowConfirmModal(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleConfirmAction}
                                >
                                    Aceptar
                                </button>
                            </div>
                        </div>
                    </div>
                )}


                {showAlertModal && (
                    <div className="modal-overlay">
                        <div className="modal-alert">
                            <h5>Alerta</h5>
                            <p>{alertMessage}</p>
                            <div className="modal-actions">
                                <button className="btn btn-primary" onClick={() => setShowAlertModal(false)}>
                                    Aceptar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Producto;
