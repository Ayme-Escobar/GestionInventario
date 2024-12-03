import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Categoria from './components/Categoria';
import Producto from './components/Producto';
import Reporte from './components/Reporte';

function App() {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/categorias" element={<Categoria />} />
                    <Route path="/productos" element={<Producto />} />
                    <Route path="/reportes" element={<Reporte />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
