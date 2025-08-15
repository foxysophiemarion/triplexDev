(function initPayPage() {
	const CART_KEY = 'cart';
	const SELECTED_KEY = 'cart_selected';
	const DELIVERY_COST = 500;

	const cartTotalEl = document.querySelector('.cart-total');
	const productTotalEl = document.querySelector('.total-product .cart-total');
	const deliveryTotalEl = document.querySelector('.delivery-total');
	const promoInput = document.querySelector('.promo__input');
	const promoBtn = document.querySelector('.promo__apply');

	let appliedPromo = null;

	function getCart() {
		try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
		catch { return []; }
	}
	function getSelected() {
		try { return JSON.parse(localStorage.getItem(SELECTED_KEY)) || []; }
		catch { return []; }
	}

	function formatRub(num) {
		return (num || 0).toLocaleString('ru-RU') + ' ₽';
	}

	function updateTotals() {
		const cart = getCart();
		const selected = getSelected();

		const selectedItems = cart.filter((_, i) => selected[i]);
		let productTotal = selectedItems.reduce((sum, item) => sum + item.qty * item.price, 0);

		if (appliedPromo === 'SALE10') {
			productTotal = Math.round(productTotal * 0.9);
		}

		const total = productTotal + DELIVERY_COST;

		if (productTotalEl) productTotalEl.textContent = formatRub(productTotal);
		if (deliveryTotalEl) deliveryTotalEl.textContent = formatRub(DELIVERY_COST);
		if (cartTotalEl) cartTotalEl.textContent = formatRub(total);
	}

	if (promoBtn) {
		promoBtn.addEventListener('click', () => {
			const code = (promoInput?.value || '').trim().toUpperCase();
			appliedPromo = code === 'SALE10' ? 'SALE10' : null;
			updateTotals();
		});
	}

	document.addEventListener('DOMContentLoaded', updateTotals);
})();

