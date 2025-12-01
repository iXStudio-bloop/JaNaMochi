document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const registerModal = document.getElementById('registerModal');
    const mainSite = document.getElementById('mainSite');
    const registerForm = document.getElementById('registerForm');
    const registerError = document.getElementById('registerError');
    const musicToggle = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');
    const languageSelect = document.getElementById('languageSelect');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const profileEmail = document.getElementById('profileEmail');
    const profileUsername = document.getElementById('profileUsername');
    const productsContainer = document.getElementById('productsContainer');
    const cartItems = document.getElementById('cartItems');
    const totalPrice = document.getElementById('totalPrice');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const checkoutModal = document.getElementById('checkoutModal');
    const checkoutTitle = document.getElementById('checkoutTitle');
    const checkoutMessage = document.getElementById('checkoutMessage');
    const closeCheckout = document.getElementById('closeCheckout');

    // Данные пользователя и корзина
    let user = null;
    let cart = [];
    let currentLanguage = 'pl';

    // Тексты на разных языках
    const translations = {
        pl: {
            shop: 'Sklep',
            profile: 'Profil',
            ourMochi: 'Nasze mochi',
            yourProfile: 'Twój profil',
            email: 'E-mail',
            username: 'Nazwa użytkownika',
            yourCart: 'Twój koszyk',
            total: 'Suma',
            checkout: 'Zapłać',
            payment: 'Płatność',
            thanks: 'Dziękujemy za zakupy!',
            addToCart: 'Dodaj do koszyka',
            price: 'Cena',
            currency: 'PLN',
            musicBtn: 'MOCHIBASS',
            emptyCart: 'Koszyk jest pusty'
        },
        ru: {
            shop: 'Магазин',
            profile: 'Профиль',
            ourMochi: 'Наше моти',
            yourProfile: 'Ваш профиль',
            email: 'Эл. почта',
            username: 'Имя пользователя',
            yourCart: 'Ваша корзина',
            total: 'Сумма',
            checkout: 'Оплатить',
            payment: 'Оплата',
            thanks: 'Спасибо за покупку!',
            addToCart: 'Добавить в корзину',
            price: 'Цена',
            currency: 'руб.',
            musicBtn: 'MOCHIBASS',
            emptyCart: 'Корзина пуста'
        },
        en: {
            shop: 'Shop',
            profile: 'Profile',
            ourMochi: 'Our mochi',
            yourProfile: 'Your profile',
            email: 'E-mail',
            username: 'Username',
            yourCart: 'Your cart',
            total: 'Total',
            checkout: 'Checkout',
            payment: 'Payment',
            thanks: 'Thank you for your purchase!',
            addToCart: 'Add to cart',
            price: 'Price',
            currency: 'USD',
            musicBtn: 'MOCHIBASS',
            emptyCart: 'Cart is empty'
        }
    };

    // Товары
    const products = [
        {
            id: 1,
            name: { pl: 'Mochi Truskawkowe', ru: 'Клубничное моти', en: 'Strawberry Mochi' },
            description: { 
                pl: 'Delikatne mochi z nadzieniem truskawkowym', 
                ru: 'Нежное моти с клубничной начинкой', 
                en: 'Soft mochi with strawberry filling' 
            },
            price: 12.99,
            img: 'https://images.unsplash.com/photo-1569929238190-869826b1bb05?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: 2,
            name: { pl: 'Mochi Matcha', ru: 'Моти матча', en: 'Matcha Mochi' },
            description: { 
                pl: 'Tradycyjne mochi z zieloną herbatą matcha', 
                ru: 'Традиционное моти с зеленым чаем матча', 
                en: 'Traditional mochi with matcha green tea' 
            },
            price: 14.50,
            img: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: 3,
            name: { pl: 'Mochi Czekoladowe', ru: 'Шоколадное моти', en: 'Chocolate Mochi' },
            description: { 
                pl: 'Mochi z bogatym nadzieniem czekoladowym', 
                ru: 'Моти с насыщенной шоколадной начинкой', 
                en: 'Mochi with rich chocolate filling' 
            },
            price: 13.75,
            img: 'https://images.unsplash.com/photo-1511381939415-e44015466834?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: 4,
            name: { pl: 'Mochi Kokosowe', ru: 'Кокосовое моти', en: 'Coconut Mochi' },
            description: { 
                pl: 'Egzotyczne mochi z kokosem', 
                ru: 'Экзотическое моти с кокосом', 
                en: 'Exotic mochi with coconut' 
            },
            price: 11.99,
            img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        }
    ];

    // Регистрация
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        
        if (!username || !email) {
            showRegisterError('Wypełnij wszystkie pola / Заполните все поля');
            return;
        }
        
        // Проверка email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showRegisterError('Nieprawidłowy email / Неверный email');
            return;
        }
        
        // Сохраняем пользователя
        user = { username, email };
        localStorage.setItem('mochiUser', JSON.stringify(user));
        
        // Переключаем на основной сайт
        registerModal.classList.add('hidden');
        mainSite.classList.remove('hidden');
        
        // Загружаем данные пользователя
        loadUserData();
        loadProducts();
        updateCart();
    });

    // Проверка, есть ли сохраненный пользователь
    const savedUser = localStorage.getItem('mochiUser');
    if (savedUser) {
        user = JSON.parse(savedUser);
        registerModal.classList.add('hidden');
        mainSite.classList.remove('hidden');
        loadUserData();
        loadProducts();
        updateCart();
    }

    // Загрузка данных пользователя
    function loadUserData() {
        profileEmail.textContent = user.email;
        profileUsername.textContent = user.username;
    }

    // Показ ошибки регистрации
    function showRegisterError(message) {
        registerError.textContent = message;
        setTimeout(() => {
            registerError.textContent = '';
        }, 3000);
    }

    // Управление музыкой
    musicToggle.addEventListener('click', function() {
        if (bgMusic.paused) {
            bgMusic.play();
            musicToggle.innerHTML = '<i class="fas fa-pause"></i> MOCHIBASS';
        } else {
            bgMusic.pause();
            musicToggle.innerHTML = '<i class="fas fa-play"></i> MOCHIBASS';
        }
    });

    // Смена языка
    languageSelect.addEventListener('change', function() {
        currentLanguage = this.value;
        updateLanguage();
    });

    function updateLanguage() {
        // Обновляем тексты на кнопках
        document.querySelectorAll('[data-tab="shop"]').forEach(btn => {
            btn.textContent = translations[currentLanguage].shop;
        });
        document.querySelectorAll('[data-tab="profile"]').forEach(btn => {
            btn.textContent = translations[currentLanguage].profile;
        });
        
        // Обновляем заголовки
        document.querySelector('#shopTab h2').textContent = translations[currentLanguage].ourMochi;
        document.querySelector('#profileTab h2').textContent = translations[currentLanguage].yourProfile;
        document.querySelector('.cart-section h3').textContent = translations[currentLanguage].yourCart;
        document.querySelector('.cart-total p').innerHTML = `${translations[currentLanguage].total}: <span id="totalPrice">0</span> ${translations[currentLanguage].currency}`;
        checkoutBtn.textContent = translations[currentLanguage].checkout;
        checkoutTitle.textContent = translations[currentLanguage].payment;
        checkoutMessage.textContent = translations[currentLanguage].thanks;
        
        // Обновляем товары
        loadProducts();
        updateCart();
    }

    // Переключение вкладок
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Обновляем активные кнопки
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Обновляем активный контент
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId + 'Tab') {
                    content.classList.add('active');
                }
            });
        });
    });

    // Загрузка товаров
    function loadProducts() {
        productsContainer.innerHTML = '';
        
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.img}" alt="${product.name[currentLanguage]}" class="product-img">
                <div class="product-info">
                    <h3>${product.name[currentLanguage]}</h3>
                    <p>${product.description[currentLanguage]}</p>
                    <p class="price">${translations[currentLanguage].price}: ${product.price.toFixed(2)} ${translations[currentLanguage].currency}</p>
                    <button class="add-to-cart" data-id="${product.id}">${translations[currentLanguage].addToCart}</button>
                </div>
            `;
            productsContainer.appendChild(productCard);
        });
        
        // Добавляем обработчики для кнопок "Добавить в корзину"
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                addToCart(productId);
            });
        });
    }

    // Функции корзины
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        updateCart();
        // Показать уведомление
        alert(`${product.name[currentLanguage]} ${translations[currentLanguage].addToCart.toLowerCase()}!`);
    }

    function updateCart() {
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            cartItems.innerHTML = `<p>${translations[currentLanguage].emptyCart}</p>`;
            totalPrice.textContent = '0';
            return;
        }
        
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name[currentLanguage]}</h4>
                    <p>${item.price.toFixed(2)} ${translations[currentLanguage].currency} × ${item.quantity}</p>
                </div>
                <div class="cart-item-total">
                    <strong>${itemTotal.toFixed(2)} ${translations[currentLanguage].currency}</strong>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
        
        totalPrice.textContent = total.toFixed(2);
    }

    // Оформление заказа
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            alert(translations[currentLanguage].emptyCart);
            return;
        }
        
        checkoutModal.classList.remove('hidden');
    });

    closeCheckout.addEventListener('click', function() {
        checkoutModal.classList.add('hidden');
        cart = [];
        updateCart();
    });
});