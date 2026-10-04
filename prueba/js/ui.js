import { PRODUCTS, CATEGORIES } from './products.js';

export function renderCategories(activeCategoryId, onSelectCategory) {
    const categoryList = document.getElementById('categoryList');
    categoryList.innerHTML = '';

    CATEGORIES.forEach(cat => {
        const li = document.createElement('li');
        li.className = `category-item ${cat.id === activeCategoryId ? 'active' : ''}`;
        li.innerHTML = `<span>${cat.name}</span>`;
        li.addEventListener('click', () => onSelectCategory(cat.id));
        categoryList.appendChild(li);
    });
}

export function renderProducts(productsList, onAddToCart) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';

    if (productsList.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #666; padding: 2rem;">No se encontraron productos.</p>`;
        return;
    }

    productsList.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-img">
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-footer">
                    <span class="product-price">$${product.price.toLocaleString()}</span>
                    <button class="btn-add btn-push" data-id="${product.id}">
                        <i class="fa-solid fa-plus"></i> Ver / Agregar
                    </button>
                </div>
            </div>
        `;

        card.querySelector('.btn-add').addEventListener('click', () => onAddToCart(product));
        grid.appendChild(card);
    });
}

export function renderCartModal(cartItems, totalPrice, onUpdateQty) {
    const cartContainer = document.getElementById('cartItems');
    const totalElement = document.getElementById('cartTotal');
    
    cartContainer.innerHTML = '';
    totalElement.textContent = `$${totalPrice.toLocaleString()}`;

    if (cartItems.length === 0) {
        cartContainer.innerHTML = `<p style="text-align: center; color: #888; margin-top: 2rem;">Tu carrito está vacío.</p>`;
        return;
    }

    cartItems.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>$${(item.price * item.quantity).toLocaleString()}</p>
            </div>
            <div class="quantity-controls">
                <button class="qty-btn btn-minus" data-id="${item.id}">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn btn-plus" data-id="${item.id}">+</button>
            </div>
        `;

        itemEl.querySelector('.btn-minus').addEventListener('click', () => onUpdateQty(item.id, -1));
        itemEl.querySelector('.btn-plus').addEventListener('click', () => onUpdateQty(item.id, 1));

        cartContainer.appendChild(itemEl);
    });
}

export function updateCartBadge(count) {
    document.getElementById('cartCount').textContent = count;
}