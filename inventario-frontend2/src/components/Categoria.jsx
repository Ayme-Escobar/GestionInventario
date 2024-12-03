import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSync, faBars } from '@fortawesome/free-solid-svg-icons';
import './Categoria.css'; // Estilos personalizados

const Categoria = () => {
    const [categorias, setCategorias] = useState([]);
    const [filteredCategorias, setFilteredCategorias] = useState([]);
    const [search, setSearch] = useState('');
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [selectedCategoria, setSelectedCategoria] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [currentAction, setCurrentAction] = useState(null);
    const [currentCategoryId, setCurrentCategoryId] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        fetchCategorias();
    }, []);

    const fetchCategorias = () => {
        axios.get('http://localhost:3000/categorias')
            .then((response) => {
                setCategorias(response.data); // Incluye todas las categorías
                setFilteredCategorias(response.data); // Inicializa las categorías filtradas
            })
            .catch((error) => console.error('Error al obtener las categorías:', error));
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
        const filtered = categorias.filter((categoria) =>
            categoria.idCategoria.toString().includes(e.target.value) ||
            categoria.nombre.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setFilteredCategorias(filtered);
    };

    const handleSave = () => {
        if (!nombre || !descripcion) {
            setAlertMessage('Por favor, completa todos los campos.');
            setShowAlertModal(true);
            return;
        }

        if (selectedCategoria) {
            axios.put(`http://localhost:3000/categorias/${selectedCategoria.idCategoria}`, { nombre, descripcion })
                .then(() => {
                    setAlertMessage('Categoría actualizada con éxito');
                    setShowAlertModal(true);
                    resetForm();
                    fetchCategorias();
                })
                .catch((error) => {
                    if (error.response && error.response.data.message === 'El nombre de la categoría ya existe') {
                        setAlertMessage('Error: El nombre de la categoría ya existe.');
                    } else {
                        setAlertMessage('Error al actualizar la categoría.');
                    }
                    setShowAlertModal(true);
                    console.error('Error al actualizar la categoría:', error);
                });
        } else {
            axios.post('http://localhost:3000/categorias', { nombre, descripcion })
                .then(() => {
                    setAlertMessage('Categoría creada con éxito');
                    setShowAlertModal(true);
                    resetForm();
                    fetchCategorias();
                })
                .catch((error) => {
                    if (error.response && error.response.data.message === 'El nombre de la categoría ya existe') {
                        setAlertMessage('Error: El nombre de la categoría ya existe.');
                    } else {
                        setAlertMessage('Error al crear la categoría.');
                    }
                    setShowAlertModal(true);
                    console.error('Error al crear la categoría:', error);
                });
        }
    };

    const handleDelete = (id) => {
        axios.put(`http://localhost:3000/categorias/${id}`, { activo: false })
            .then(() => {
                setAlertMessage('Categoría desactivada con éxito');
                setShowAlertModal(true);
                fetchCategorias();
            })
            .catch((error) => console.error('Error al desactivar la categoría:', error));
    };

    const handleReactivate = (id) => {
        axios.put(`http://localhost:3000/categorias/reactivar/${id}`, { activo: true })
            .then(() => {
                setAlertMessage('Categoría reactivada con éxito');
                setShowAlertModal(true);
                fetchCategorias();
            })
            .catch((error) => console.error('Error al reactivar la categoría:', error));
    };

    const openConfirmModal = (action, categoryId) => {
        setCurrentAction(action);
        setCurrentCategoryId(categoryId);
        setShowConfirmModal(true);
    };

    const handleConfirmAction = () => {
        if (currentAction === "reactivate") {
            handleReactivate(currentCategoryId);
        } else if (currentAction === "deactivate") {
            handleDelete(currentCategoryId);
        }
        setShowConfirmModal(false);
    };

    const resetForm = () => {
        setNombre('');
        setDescripcion('');
        setSelectedCategoria(null);
    };

    const handleEdit = (categoria) => {
        setSelectedCategoria(categoria);
        setNombre(categoria.nombre);
        setDescripcion(categoria.descripcion);
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
                        <a href="/categorias" className="nav-link active">
                            Categorías
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="/productos" className="nav-link">
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
                <h2 className="text-center mb-4">Lista de Categorías</h2>

                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar por ID o Nombre"
                        value={search}
                        onChange={handleSearch}
                    />
                </div>

                <div className="text-center mb-4">
                    <button
                        className="btn btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#addEditModal"
                        onClick={resetForm}
                    >
                        + Añadir Categoría
                    </button>
                </div>

                <table className="table table-striped table-hover">
                    <thead className="table-primary">
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Detalle</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCategorias.map((categoria) => (
                            <tr
                                key={categoria.idCategoria}
                                className={categoria.activo ? '' : 'table-secondary'}
                            >
                                <td>{categoria.idCategoria}</td>
                                <td>{categoria.nombre}</td>
                                <td>{categoria.descripcion}</td>
                                <td>
                                    <span className={`badge ${categoria.activo ? 'bg-success' : 'bg-danger'}`}>
                                        {categoria.activo ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td>
                                    {categoria.activo ? (
                                        <>
                                            <button
                                                className="btn btn-warning me-2"
                                                data-bs-toggle="modal"
                                                aria-label="Editar Categoría"
                                                data-bs-target="#addEditModal"
                                                onClick={() => handleEdit(categoria)}
                                            >
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                aria-label="Desactivar Categoría"
                                                onClick={() => openConfirmModal("deactivate", categoria.idCategoria)}
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            className="btn btn-success"
                                            onClick={() => openConfirmModal("reactivate", categoria.idCategoria)}
                                        >
                                            <FontAwesomeIcon icon={faSync} /> Reactivar
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div
                    className="modal fade"
                    id="addEditModal"
                    tabIndex="-1"
                    aria-labelledby="addEditModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="addEditModalLabel">
                                    {selectedCategoria ? 'Editar Categoría' : 'Añadir Categoría'}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                ></button>
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
                                    className="form-control"
                                    placeholder="Descripción"
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                />
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleSave}
                                    data-bs-dismiss="modal"
                                >
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal de confirmación */}
                {showConfirmModal && (
                    <div className="modal-overlay">
                        <div className="modal-confirm">
                            <h5>Confirmación</h5>
                            <p>
                                ¿Estás seguro de {currentAction === "reactivate" ? "reactivar" : "desactivar"} esta categoría?
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

                {/* Modal de alerta */}
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

export default Categoria;
