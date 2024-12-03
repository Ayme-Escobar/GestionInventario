describe('Gestión de Productos', () => {
  it('Crea un producto nuevo y verifica que se muestra en la lista', () => {    
    cy.visit('http://localhost:3001/productos');
    cy.wait(1000); 

    // Abrir el modal para crear un producto
    cy.contains('+ Añadir Producto').click();
    cy.wait(500); // Esperar medio segundo para la animación del modal

    // Llenar el formulario de creación de productos
    cy.get('input[placeholder="Nombre"]').type('Producto Cypress', { delay: 100 }); // Introducir texto lentamente
    cy.wait(300); // Esperar antes de continuar
    cy.get('input[placeholder="Descripción"]').type('Descripción Cypress', { delay: 100 });
    cy.wait(300);
    cy.get('input[placeholder="Precio"]').type('50', { delay: 100 });
    cy.wait(300);
    cy.get('input[placeholder="Stock"]').type('5', { delay: 100 });
    cy.wait(300);
    cy.get('select').select('1'); // Seleccionar una categoría
    cy.wait(300);

    // Guardar el producto
    cy.contains('Guardar').click();
    cy.wait(1000); // Esperar para que el producto se guarde y la lista se actualice

    // Verificar que el producto aparece en la lista
    cy.contains('Producto Cypress').should('exist');
  });

  it('Desactiva un producto existente y verifica el estado', () => {
    // Visitar la página de productos
    cy.visit('http://localhost:3001/productos');
    cy.wait(1000);

    // Buscar el producto y hacer clic en el botón correspondiente
    cy.contains('asdsaa')
      .parent()
      .find('button.btn-danger') // Seleccionar el botón de desactivar basado en su clase
      .click();
    cy.wait(500);

    // Confirmar la acción en el modal
    cy.contains('¿Estás seguro de desactivar este producto?') // Verificar que el mensaje está presente
      .should('exist');
    cy.contains('Aceptar').click(); // Hacer clic en el botón 'Aceptar' del modal de confirmación
    cy.wait(1000);

    // Manejar el modal de éxito
    cy.contains('Producto desactivado con éxito') // Verificar el mensaje de éxito
      .should('exist');
    cy.contains('Aceptar').click(); // Cerrar el modal de éxito haciendo clic en 'Aceptar'
    cy.wait(1000);
  });
  
  it('Edita un producto existente y verifica los cambios', () => {
    // Visitar la página de productos
    cy.visit('http://localhost:3001/productos');
    cy.wait(1000);

    // Buscar el producto por su nombre y hacer clic en el botón de editar
    cy.contains('Grapadora')
      .parent()
      .find('button.btn-warning') // Seleccionar el botón de editar basado en su clase
      .click();
    cy.wait(1000);

    // Verificar que el modal de edición está abierto
    cy.get('.modal-title').should('contain', 'Editar Producto');

    // Cambiar los valores del producto en el formulario
    cy.get('input[placeholder="Nombre"]').clear().type('Producto Editado1');
    cy.get('input[placeholder="Descripción"]').clear().type('Descripción Editada');
    cy.get('input[placeholder="Precio"]').clear().type('75.00');
    cy.get('input[placeholder="Stock"]').clear().type('10');    

    // Guardar los cambios
    cy.contains('Guardar').click();
    cy.wait(1000);

    // Verificar que el modal de confirmación de éxito aparece
    cy.contains('Producto actualizado con éxito').should('be.visible');
    cy.contains('Aceptar').click();
    cy.wait(1000);

    // Verificar que el producto actualizado aparece en la lista
    cy.contains('Producto Editado1').should('exist');
    cy.contains('Producto Editado1')
      .parent()
      .find('td')
      .eq(2) // Verificar la descripción actualizada
      .should('contain', 'Descripción Editada');
    cy.contains('Producto Editado1')
      .parent()
      .find('td')
      .eq(3) // Verificar el precio actualizado
      .should('contain', '$75.00');
    cy.contains('Producto Editado')
      .parent()
      .find('td')
      .eq(4) // Verificar el stock actualizado
      .should('contain', '10');
    cy.contains('Producto Editado1')
      .parent()
      .find('td')
      .eq(5) // Verificar la categoría actualizada      
  });
});