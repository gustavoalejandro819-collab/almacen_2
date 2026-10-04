class CartManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('almacen_cart')) || [];
    }

    save() {
        localStorage.setItem('almacen_cart', JSON.stringify(this.cart));
    }

    addItem(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({ ...product, quantity: 1 });
        }
        this.save();
    }

    updateQuantity(productId, delta) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                this.cart = this.cart.filter(i => i.id !== productId);
            }
        }
        this.save();
    }

    clear() {
        this.cart = [];
        this.save();
    }

    getItems() {
        return this.cart;
    }

    getTotalCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    getTotalPrice() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
}

export const cart = new CartManager();