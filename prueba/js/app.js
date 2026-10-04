import { PRODUCTS, CATEGORIES } from './products.js';
import { cart } from './cart.js';
import { renderCategories, renderProducts, renderCartModal, updateCartBadge } from './ui.js';

let currentCategory = 'all';
let searchQuery = '';

// Inicialización de Eventos y Render
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    renderCategories(currentCategory, handleCategoryChange);
    filterAndRenderProducts();
    updateCartUI();

    // Agregar dentro de initApp() en js/app.js:

    const socialContainer = document.getElementById('socialFloating');
    const socialToggleBtn = document.getElementById('socialToggleBtn');

    socialToggleBtn.addEventListener('click', () => {
        socialContainer.classList.toggle('active');
    });

    // Ocultar redes al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!socialContainer.contains(e.target)) {
            socialContainer.classList.remove('active');
        }
    });

    // Eventos Modal Carrito
    document.getElementById('cartBtn').addEventListener('click', openCart);
    document.getElementById('closeCartBtn').addEventListener('click', closeCart);

    // Evento Búsqueda
    document.getElementById('searchInput').addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        filterAndRenderProducts();
    });

    // Formulario Checkout / Enviar Pedido
    document.getElementById('checkoutForm').addEventListener('submit', handleCheckout);
}

function handleCategoryChange(categoryId) {
    currentCategory = categoryId;
    const catObject = CATEGORIES.find(c => c.id === categoryId);
    document.getElementById('currentCategoryTitle').textContent = catObject ? catObject.name : 'Productos';
    
    renderCategories(currentCategory, handleCategoryChange);
    filterAndRenderProducts();
}

function filterAndRenderProducts() {
    let filtered = PRODUCTS;

    if (currentCategory !== 'all') {
        filtered = filtered.filter(p => p.category === currentCategory);
    }

    if (searchQuery.trim() !== '') {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery));
    }

    renderProducts(filtered, (product) => {
        cart.addItem(product);
        updateCartUI();
    });
}

function updateCartUI() {
    updateCartBadge(cart.getTotalCount());
    renderCartModal(cart.getItems(), cart.getTotalPrice(), (id, delta) => {
        cart.updateQuantity(id, delta);
        updateCartUI();
    });
}

function openCart() {
    document.getElementById('cartModal').classList.add('active');
    document.body.classList.add('modal-open'); // Desactiva/oculta el botón flotante
}

function closeCart() {
    document.getElementById('cartModal').classList.remove('active');
    document.body.classList.remove('modal-open'); // Vuelve a mostrarlo
}
function handleCheckout(e) {
    e.preventDefault();

    if (cart.getItems().length === 0) {
        alert("Tu carrito está vacío. Agregá productos antes de confirmar.");
        return;
    }

    const clientName = document.getElementById('clientName').value;
    const pickupTime = document.getElementById('pickupTime').value;

    // Generar mensaje para WhatsApp
    let message = `🛒 *NUEVO PEDIDO DE RETIRO EN LOCAL*\n`;
    message += `👤 *Cliente:* ${clientName}\n`;
    message += `⏰ *Retira:* ${pickupTime}\n`;
    message += `📍 *Lugar:* Machado 2099, Centro\n\n`;
    message += `📋 *Detalle del Pedido:*\n`;

    cart.getItems().forEach(item => {
        message += `• ${item.quantity}x ${item.name} - $${(item.price * item.quantity).toLocaleString()}\n`;
    });

    message += `\n💰 *Total a pagar:* $${cart.getTotalPrice().toLocaleString()}`;

    // Enviar por WhatsApp (reemplazar por el número real del comercio)
    const phoneNumber = "+541160027906"; 
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    cart.clear();
    updateCartUI();
    closeCart();

    window.open(whatsappUrl, '_blank');
}