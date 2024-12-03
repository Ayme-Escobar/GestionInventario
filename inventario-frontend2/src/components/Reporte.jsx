import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reporte = () => {
    const [reportes, setReportes] = useState([]);
    const [fechaGeneracion, setFechaGeneracion] = useState('');
    const [idProducto, setIdProducto] = useState('');

    // Obtener reportes
    useEffect(() => {
        axios.get('http://localhost:3000/reportes')
            .then((response) => {
                setReportes(response.data);
            })
            .catch((error) => {
                console.error('Error al obtener los reportes:', error);
            });
    }, []);

    // Crear nuevo reporte
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3000/reportes', { fechaGeneracion, idProducto })
            .then(() => {
                alert('Reporte creado con éxito');
                window.location.reload(); // Recarga los reportes
            })
            .catch((error) => {
                console.error('Error al crear el reporte:', error);
            });
    };

    return (
        <div>
            <h2>Reportes</h2>
            <ul>
                {reportes.map((reporte) => (
                    <li key={reporte.idReporte}>
                        Fecha: {reporte.fechaGeneracion} - Producto ID: {reporte.idProducto}
                    </li>
                ))}
            </ul>

            <h3>Crear Nuevo Reporte</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="date"
                    placeholder="Fecha Generación"
                    value={fechaGeneracion}
                    onChange={(e) => setFechaGeneracion(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="ID Producto"
                    value={idProducto}
                    onChange={(e) => setIdProducto(e.target.value)}
                />
                <button type="submit">Crear</button>
            </form>
        </div>
    );
};

export default Reporte;
