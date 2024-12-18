// script.js

// URLs de la API
const API_URL = 'http://localhost:3000/proyectos';

// Seleccionar elementos del DOM
const nameInput = document.getElementById('name');
const priceInput = document.getElementById('price');
const imageInput = document.getElementById('image');
const sendButton = document.querySelector('.send');
const clearButton = document.querySelector('.clear'); // Seleccionar el botón Clear
const productContainer = document.querySelector('.left-block');

// Cargar sonidos
const sendSound = new Audio('./sounds/send-sound.mp3')
const clearSound = new Audio('./sounds/clear-sound.mp3');

// Función para crear una tarjeta de producto en el DOM
function createProductCard(product) {
    const { id, name, price, imageUrl } = product;

    // Crear elementos
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.id = id; // Asociar el ID del producto

    const productImage = document.createElement('img');
    productImage.src = imageUrl || './imagenes/default-product.png'; // Imagen por defecto si no se proporciona

    const infoContainer = document.createElement('div');
    infoContainer.classList.add('card-container--info');

    const productName = document.createElement('p');
    productName.textContent = name;

    const valueContainer = document.createElement('div');
    valueContainer.classList.add('card-container--value');

    const productPrice = document.createElement('p');
    productPrice.textContent = `$ ${parseFloat(price).toFixed(2)}`;

    const deleteIcon = document.createElement('img');
    deleteIcon.src = './imagenes/🦆 icon _trash 2_.png';
    deleteIcon.alt = 'Eliminar producto';
    deleteIcon.classList.add('delete-icon');
    deleteIcon.addEventListener('click', () => deleteProduct(id, card));

    // Construir la tarjeta
    valueContainer.appendChild(productPrice);
    valueContainer.appendChild(deleteIcon);
    infoContainer.appendChild(productName);
    infoContainer.appendChild(valueContainer);
    card.appendChild(productImage);
    card.appendChild(infoContainer);

    return card;
}

// Función para mostrar los productos en el DOM
function loadProducts() {
    fetch(API_URL)
        .then((response) => response.json())
        .then((products) => {
            products.forEach((product) => {
                const card = createProductCard(product);
                productContainer.appendChild(card);
            });
        })
        .catch((error) => console.error('Error al cargar productos:', error));
}

// Función para agregar un nuevo producto al servidor
function addProduct(name, price, imageUrl) {
    const newProduct = { name, price, imageUrl };
    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
    })
        .then((response) => response.json())
        .then((product) => {
            const card = createProductCard(product);
            productContainer.appendChild(card);
        })
        .catch((error) => console.error('Error al agregar producto:', error));
}

// Función para eliminar un producto del servidor
function deleteProduct(id, cardElement) {
    fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    })
        .then(() => {
            cardElement.remove(); // Eliminar la tarjeta del DOM
        })
        .catch((error) => console.error('Error al eliminar producto:', error));
}

// Manejar el evento de clic en el botón "Enviar"
sendButton.addEventListener('click', () => {
    const name = nameInput.value.trim();
    const price = priceInput.value.trim();
    const imageUrl = imageInput.value.trim();

    // Validar campos
    if (!name || !price || !imageUrl) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    // Reproducir sonido de envío
    sendSound.play();

    // Agregar producto al servidor
    addProduct(name, price, imageUrl);

    // Limpiar formulario
    nameInput.value = '';
    priceInput.value = '';
    imageInput.value = '';
});

// Manejar el evento de clic en el botón "Clear"
clearButton.addEventListener('click', () => {
    // Reproducir sonido de limpieza
    clearSound.play();

    // Limpiar campos del formulario
    nameInput.value = '';
    priceInput.value = '';
    imageInput.value = '';
});
  
// Cargar los productos al inicio
loadProducts();
