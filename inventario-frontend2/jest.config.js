module.exports = {
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
    },
    moduleNameMapper: {
      '^axios$': require.resolve('axios'), // Asegura que Jest use la misma versión de Axios
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Ignora estilos en pruebas
    },
    testEnvironment: 'jsdom',
  };
  