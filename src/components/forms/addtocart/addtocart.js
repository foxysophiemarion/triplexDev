// Подключение функционала "Чертоги Фрилансера"
import { FLS } from "@js/common/functions.js";
import "./addtocart.scss"

function addToCart() {
	const CART_KEY = 'cart';
	const cartCounter = document.querySelector('[data-fls-addtocart]');
	const cartIcon = document.querySelector('.top-header__cart .cart-icon__button');

	// ==== helpers (localStorage) ====
	function getCart() {
		try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
		catch { return []; }
	}
	function setCart(cart) {
		localStorage.setItem(CART_KEY, JSON.stringify(cart));
	}
	function getCartCount() {
		return getCart().reduce((sum, i) => sum + (i.qty || 0), 0);
	}
	function updateCartCounter() {
		if (cartCounter) cartCounter.textContent = getCartCount();
	}
	function saveToCart(product) {
		const cart = getCart();
		const existing = cart.find(i => i.id === product.id);
		if (existing) {
			existing.qty += product.qty;
			// цена/название/изображение на случай, если обновились
			existing.title = product.title || existing.title;
			existing.img = product.img || existing.img;
			existing.price = product.price || existing.price;
		} else {
			cart.push({
				id: product.id,
				title: product.title,
				img: product.img,
				price: product.price,
				qty: product.qty
			});
		}
		setCart(cart);
		updateCartCounter();
	}

	// ==== page detection ====
	function detectCartPage() {
		if (document.querySelector('[data-fls-cart]')) return true;
		if (document.body.classList.contains('cart') || document.body.classList.contains('page-cart')) return true;
		if (/\/cart(\/|$)|\/корзина(\/|$)/i.test(location.pathname)) return true;
		return false;
	}
	const isCart = detectCartPage();

	// Скрываем количество на карточке, если мы НЕ в корзине (твой подход)
	if (!isCart) {
		document.querySelectorAll('[data-fls-addtocart-product]').forEach(prod => {
			const q = prod.querySelector('[data-fls-quantity]');
			if (q) q.classList.add('_hidden');
		});
	}

	// При загрузке — синхронизируем счётчик в шапке с localStorage
	updateCartCounter();

	// Извлекаем данные товара из DOM (можешь задать data-атрибуты, см. ниже)
	function getProductMeta(prodEl) {
		// 1) приоритет — data-атрибуты
		const id = prodEl?.dataset.flsProductId || 'mavic-3t';
		const title = prodEl?.dataset.flsProductTitle
			|| document.querySelector('.breadcrumbs__title')?.textContent?.trim()
			|| 'DJI Mavic 3T';
		const priceAttr = prodEl?.dataset.flsProductPrice;
		let price = priceAttr ? parseInt(priceAttr, 10) : null;

		if (!price) {
			const priceText = document.querySelector('.price-product__title')?.textContent || '690 000 ₽';
			price = parseInt(priceText.replace(/\D+/g, ''), 10) || 690000;
		}

		// Картинка — активный слайд или первая
		const gallery = prodEl?.closest('.gallery-product');
		let img = gallery?.querySelector('.swiper-slide-active img')?.getAttribute('src')
			|| gallery?.querySelector('.swiper-slide img')?.getAttribute('src')
			|| prodEl?.dataset.flsProductImg
			|| '@img/product/01.png';

		return { id, title, price, img };
	}

	document.addEventListener('click', (e) => {
		const addBtn = e.target.closest('[data-fls-addtocart-button]');
		if (!addBtn) return;

		const prod = addBtn.closest('[data-fls-addtocart-product]');
		const qBlock = prod ? prod.querySelector('[data-fls-quantity]') : null;
		const input = prod ? prod.querySelector('[data-fls-addtocart-quantity], [data-fls-quantity-value]') : null;

		// Картинка для анимации
		const gallery = prod?.closest('.gallery-product');
		let imgEl = null;
		if (gallery) {
			const activeSlide = gallery.querySelector('.swiper-slide-active img');
			if (activeSlide) imgEl = activeSlide;
		}
		if (imgEl && cartIcon) {
			flyToCart(imgEl, cartIcon);
		}

		// Первый клик — показать количество, выставить 1 и добавить 1 в корзину
		if (qBlock && qBlock.classList.contains('_hidden')) {
			qBlock.classList.remove('_hidden');
			qBlock.classList.add('_active');
			if (input) input.value = 1;

			// Обновляем localStorage
			const meta = getProductMeta(prod);
			saveToCart({ ...meta, qty: 1 });

			addBtn.textContent = 'Добавить ещё';
			return;
		}

		// Повторный клик — добавить столько, сколько в инпуте
		const qty = input ? (parseInt(input.value, 10) || 1) : 1;

		const meta = getProductMeta(prod);
		saveToCart({ ...meta, qty });

		addBtn.textContent = 'Добавить ещё';
	});

	function flyToCart(productImg, cartIcon) {
		const imgClone = productImg.cloneNode(true);
		const imgRect = productImg.getBoundingClientRect();
		const cartRect = cartIcon.getBoundingClientRect();

		imgClone.style.position = 'fixed';
		imgClone.style.left = imgRect.left + 'px';
		imgClone.style.top = imgRect.top + 'px';
		imgClone.style.width = imgRect.width + 'px';
		imgClone.style.height = imgRect.height + 'px';
		imgClone.style.transition = 'all 0.7s ease-in-out';
		imgClone.style.zIndex = 1000;
		imgClone.style.borderRadius = '8px';
		imgClone.style.pointerEvents = 'none';

		document.body.appendChild(imgClone);

		requestAnimationFrame(() => {
			imgClone.style.left = cartRect.left + 'px';
			imgClone.style.top = cartRect.top + 'px';
			imgClone.style.width = '20px';
			imgClone.style.height = '20px';
			imgClone.style.opacity = '0.3';
			imgClone.style.transform = 'rotate(360deg)';
		});

		setTimeout(() => {
			imgClone.remove();
			cartIcon.classList.add('shake-cart');
			setTimeout(() => cartIcon.classList.remove('shake-cart'), 300);
		}, 700);
	}
}

document.querySelector('[data-fls-addtocart]')
	? window.addEventListener('load', addToCart)
	: null;
