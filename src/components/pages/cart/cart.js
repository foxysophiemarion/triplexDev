(function initCartPage() {
	const CART_KEY = 'cart';
	const SELECTED_KEY = 'cart_selected';

	const cartRoot = document.querySelector('[data-fls-cart]');
	if (!cartRoot) return;

	const itemsRoot = cartRoot.querySelector('.cart-items');
	const totalEl = cartRoot.querySelector('.cart-total');
	const promoInput = cartRoot.querySelector('.promo input');
	const promoBtn = cartRoot.querySelector('.promo__apply');
	const cartCounter = document.querySelector('[data-fls-addtocart]');
	const checkoutBtn = document.querySelector('.checkout');

	if (checkoutBtn) {
		checkoutBtn.addEventListener('click', () => {
			const cart = getCart();
			const selected = getSelected();

			const selectedItems = cart.filter((_, i) => selected[i]);
			if (!selectedItems.length) {
				alert('Вы не выбрали ни одного товара для оформления.');
				return;
			}

			// Сохраняем выбранные товары отдельно, если нужно
			localStorage.setItem('checkout_items', JSON.stringify(selectedItems));

			// Сохраняем промокод
			if (appliedPromo) {
				localStorage.setItem('checkout_promo', appliedPromo);
			}

			// Переход на страницу оформления
			window.location.href = '/pay-page.html';
		});
	}

	let appliedPromo = null; // пример: 'SALE10'

	function getCart() {
		try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
		catch { return []; }
	}
	function setCart(cart) {
		localStorage.setItem(CART_KEY, JSON.stringify(cart));
	}

	function getSelected() {
		try { return JSON.parse(localStorage.getItem(SELECTED_KEY)) || []; }
		catch { return []; }
	}
	function setSelected(arr) {
		localStorage.setItem(SELECTED_KEY, JSON.stringify(arr));
	}

	function updateHeaderCounter() {
		const count = getCart().reduce((s, i) => s + i.qty, 0);
		if (cartCounter) cartCounter.textContent = count;
	}

	function formatRub(num) {
		return (num || 0).toLocaleString('ru-RU') + ' ₽';
	}

	function render() {
		const cart = getCart();
		const selected = getSelected();
		itemsRoot.innerHTML = '<button class="cart-item__remove-all --icon-trash" aria-label="remove">Удалить все выбранные товары</button>';

		if (!cart.length) {
			itemsRoot.innerHTML = '<p class="cart-message">Ваша корзина пуста</p>';
			totalEl.textContent = formatRub(0);
			updateHeaderCounter();
			return;
		}

		cart.forEach((item, index) => {
			const isChecked = selected[index] !== false;
			const row = document.createElement('div');
			row.className = 'cart-item';
			row.innerHTML = `
                <div class="cart-item__absolute">
                    <label data-fls-checkbox class="cart-item__checkbox checkbox">
                        <input class="checkbox__input" type="checkbox" name="form-cart[check]" data-index="${index}" ${isChecked ? 'checked' : ''}>
                        <span class="checkbox__text --icon-check"></span>
                    </label>
                </div>
                <div class="cart-item__image">
                    <img class="cart-item__img" src="${item.img}" alt="${item.title}">
                    <span class="cart-item__title">${item.title}</span>
                </div>
                <div data-fls-quantity class="quantity">
                    <button data-fls-quantity-minus type="button" class="quantity__button quantity__button--minus" data-index="${index}" aria-label="minus"></button>
                    <div class="quantity__input">
                        <input data-fls-quantity-value autocomplete="off" type="text" name="form-cart[quantity]" value="${item.qty}">
                    </div>
                    <button data-fls-quantity-plus type="button" class="quantity__button quantity__button--plus" data-index="${index}" aria-label="plus"></button>
                </div>
                <div class="cart-item__sum">${formatRub(item.qty * item.price)}</div>
                <button class="cart-item__remove --icon-trash" data-index="${index}" aria-label="remove"></button>
            `;
			itemsRoot.appendChild(row);
		});

		updateTotal();
		updateHeaderCounter();
	}

	function selectedIndexes() {
		const selected = getSelected();
		return selected.map((val, idx) => val ? idx : null).filter(i => i !== null);
	}

	function updateTotal() {
		const cart = getCart();
		const idxs = selectedIndexes();
		let total = idxs.reduce((sum, i) => sum + cart[i].qty * cart[i].price, 0);
		if (appliedPromo === 'SALE10') total = Math.round(total * 0.9);
		totalEl.textContent = formatRub(total);
	}

	itemsRoot.addEventListener('click', (e) => {
		const cart = getCart();
		let selected = getSelected();

		if (e.target.classList.contains('quantity__button--plus')) {
			const i = +e.target.dataset.index;
			cart[i].qty++;
			setCart(cart);
			render();
		}

		if (e.target.classList.contains('quantity__button--minus')) {
			const i = +e.target.dataset.index;
			if (cart[i].qty > 1) {
				cart[i].qty--;
			} else {
				cart.splice(i, 1);
				selected.splice(i, 1);
			}
			setCart(cart);
			setSelected(selected);
			render();
		}

		if (e.target.classList.contains('cart-item__remove')) {
			const i = +e.target.dataset.index;
			cart.splice(i, 1);
			selected.splice(i, 1);
			setCart(cart);
			setSelected(selected);
			render();
		}

		if (e.target.classList.contains('cart-item__remove-all')) {
			const newCart = cart.filter((_, i) => !selected[i]);
			const newSelected = selected.filter((_, i) => !selected[i]);
			setCart(newCart);
			setSelected(newSelected);
			render();
		}
	});

	// Обработка изменений: чекбоксы и ручной ввод количества
	itemsRoot.addEventListener('change', (e) => {
		if (e.target.classList.contains('checkbox__input')) {
			const index = +e.target.dataset.index;
			const selected = getSelected();
			selected[index] = e.target.checked;
			setSelected(selected);
			updateTotal();
		}

		if (e.target.matches('[data-fls-quantity-value]')) {
			const index = +e.target.closest('.quantity').querySelector('[data-fls-quantity-plus]').dataset.index;
			const cart = getCart();
			let val = parseInt(e.target.value, 10);
			if (isNaN(val) || val < 1) val = 1;
			cart[index].qty = val;
			setCart(cart);
			render();
		}
	});

	// Промокод
	if (promoBtn) {
		promoBtn.addEventListener('click', () => {
			const code = (promoInput?.value || '').trim().toUpperCase();
			appliedPromo = code === 'SALE10' ? 'SALE10' : null;
			updateTotal();
		});
	}

	document.addEventListener('DOMContentLoaded', () => {
		const cart = getCart();
		let selected = getSelected();

		// Синхронизация: если selected меньше, дополняем true
		if (selected.length < cart.length) {
			selected = cart.map((_, i) => selected[i] !== false);
			setSelected(selected);
		}

		render();
	});
})();
