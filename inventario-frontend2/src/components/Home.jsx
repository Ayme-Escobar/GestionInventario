import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div style={styles.container}>
            <div style={styles.overlay}></div>
            <div style={styles.content}>
                <div style={styles.header}>
                    <img
                        src="https://www.microtech.es/hubfs/Fotos%20blog/inventario.jpg"
                        alt="Inventario"
                        style={styles.image}
                    />
                    <h1 style={styles.title}>Bienvenido al Sistema de Inventario</h1>
                    <p style={styles.subtitle}>
                        Administra tus categorías y productos desde un solo lugar.
                    </p>
                </div>
                <div style={styles.linksContainer}>
                    <Link to="/categorias" style={styles.link}>
                        <span style={styles.icon}>📂</span> Gestionar Categorías
                    </Link>
                    <Link to="/productos" style={styles.link}>
                        <span style={styles.icon}>📦</span> Gestionar Productos
                    </Link>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        padding: '20px',
        backgroundImage: 'linear-gradient(to bottom, #4e54c8, #8f94fb)', // Fondo con gradiente
        fontFamily: 'Arial, sans-serif',
        color: '#fff',
        textAlign: 'center',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.3)', // Efecto oscuro para contraste
        zIndex: 1,
    },
    content: {
        position: 'relative',
        zIndex: 2,
        width: '100%',
        maxWidth: '600px',
    },
    header: {
        marginBottom: '30px',
    },
    image: {
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        objectFit: 'cover',
        marginBottom: '15px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
    },
    title: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: '10px',
    },
    subtitle: {
        fontSize: '1.2rem',
        color: '#e2e8f0',
        marginBottom: '30px',
    },
    linksContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
    },
    link: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textDecoration: 'none',
        color: '#fff',
        backgroundColor: '#4a90e2',
        padding: '15px 30px',
        borderRadius: '8px',
        fontWeight: 'bold',
        fontSize: '1.1rem',
        transition: 'background-color 0.3s, transform 0.2s',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '300px',
        textAlign: 'center',
    },
    linkHover: {
        backgroundColor: '#357ABD',
    },
    icon: {
        marginRight: '10px',
        fontSize: '1.5rem',
    },
};

export default Home;
