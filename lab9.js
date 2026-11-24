class Product {
    constructor(name, category, amount, image) {
        this.name = name;
        this.category = category;
        this.amount = amount;
        this.image = image;
    }

    addToBasket() {
        console.log(`Product with name ${this.name} has been added to the basket`);
    }
}

class Shoe extends Product {
    constructor(name, amount, image) {
        super(name, 'shoe', amount, image);
    }
}

class Grocerie extends Product {
    constructor(name, amount, image) {
        super(name, 'grocerie', amount, image);
    }
}

function productFactory(itemData) {
    if (itemData.category === 'shoe') {
        return new Shoe(itemData.name, itemData.amount, itemData.image);
    } else if (itemData.category === 'grocerie') {
        return new Grocerie(itemData.name, itemData.amount, itemData.image);
    } else {
        throw new Error(`Невідома категорія товару: ${itemData.category}`);
    }
}

class Basket {
    constructor() {
        this.products = [];
    }

    add(product) {
        const addedTime = new Date().toLocaleTimeString('uk-UA');

        const basketEntry = {
            product: product,
            addedAt: addedTime
        };

        this.products.push(basketEntry);
        product.addToBasket();
        this.render();
    }

    render() {
        const basketList = document.getElementById('basket-list');
        const basketCount = document.getElementById('basket-count');

        basketCount.textContent = this.products.length;
        basketList.innerHTML = '';

        if (this.products.length === 0) {
            basketList.innerHTML = '<p class="empty-msg">Кошик поки порожній</p>';
            return;
        }

        this.products.forEach((entry) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'basket-item';

            itemDiv.innerHTML = `
                <img src="${entry.product.image}" alt="${entry.product.name}">
                <div class="basket-item-info">
                    <span class="basket-item-name">${entry.product.name}</span>
                    <span class="basket-item-time">🕒 Додано о: ${entry.addedAt}</span>
                </div>
            `;

            basketList.appendChild(itemDiv);
        });
    }
}

class Store {
    constructor() {
        this.products = [];
        this.basket = new Basket();
    }

    fillStoreWithProducts(jsonData) {
        this.products = jsonData.map(item => productFactory(item));
        this.renderProducts();
    }

    addProductToBasket(productIndex) {
        const product = this.products[productIndex];

        if (product && product.amount > 0) {
            product.amount -= 1;
            this.basket.add(product);
            this.renderProducts();
        } else {
            alert('На жаль, цей годинник закінчився в наявності!');
        }
    }

    renderProducts() {
        const grid = document.getElementById('products-grid');
        grid.innerHTML = '';

        this.products.forEach((product, index) => {
            const card = document.createElement('div');
            card.className = 'product-card';

            const isOutOfStock = product.amount === 0;
            const categoryClass = product.category === 'shoe' ? 'tag-shoe' : 'tag-grocerie';
            const categoryLabel = product.category === 'shoe' ? 'Класичні годинники' : 'Смарт-годинники';

            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="card-body">
                    <span class="category-tag ${categoryClass}">${categoryLabel}</span>
                    <div class="card-title">${product.name}</div>
                    <div class="card-amount">
                        ${isOutOfStock ? 'Немає в наявності' : `В наявності: <strong>${product.amount} шт.</strong>`}
                    </div>
                    <button class="add-btn" ${isOutOfStock ? 'disabled' : ''}>
                        ${isOutOfStock ? 'Закінчився' : 'Додати в кошик'}
                    </button>
                </div>
            `;

            const btn = card.querySelector('.add-btn');
            btn.addEventListener('click', () => {
                this.addProductToBasket(index);
            });

            grid.appendChild(card);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const myStore = new Store();

    fetch('lab9.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Помилка завантаження lab9.json');
            }
            return response.json();
        })
        .then(data => {
            myStore.fillStoreWithProducts(data);
        })
        .catch(error => {
            console.error('Помилка:', error);
            document.getElementById('products-grid').innerHTML =
                '<p style="color: red;">Не вдалося завантажити товари. Перевір, чи файл lab9.json лежить у тій самій папці та чи запущено Live Server.</p>';
        });
});