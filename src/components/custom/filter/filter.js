import "./filter.scss";

document.addEventListener('DOMContentLoaded', () => {
	const searchInput = document.querySelector('.search__input');
	const checkboxes = document.querySelectorAll('.search__checkbox');
	const products = document.querySelectorAll('.product-card');
	const filterForm = document.querySelector('#filter-form');
	const select = document.querySelector('select[name="filter-form[select]"]');
	const priceMinInput = document.querySelector('input[name="filter-form[price_min]"]');
	const priceMaxInput = document.querySelector('input[name="filter-form[price_max]"]');
	const optionRadios = document.querySelectorAll('input[name="filter-form[option]"]');
	const timeCheckboxes = document.querySelectorAll('input[name="filter-form[time]"]');
	const qualityCheckboxes = document.querySelectorAll('input[name="filter-form[quality]"]');
	const batteryCheckboxes = document.querySelectorAll('input[name="filter-form[battery]"]');
	const additionallyCheckboxes = document.querySelectorAll('input[name="filter-form[additionally]"]');

	// Функция фильтрации брендов
	function filterBrands() {
		const searchTerm = searchInput.value.toLowerCase();
		checkboxes.forEach(label => {
			const text = label.querySelector('.checkbox-search__text').textContent.toLowerCase();
			label.style.display = text.includes(searchTerm) ? '' : 'none';
		});
		window.dispatchEvent(new Event('resize')); // Триггер для showMore
	}

	// Функция фильтрации продуктов
	function filterProducts() {
		const selectedBrands = Array.from(checkboxes)
			.filter(checkbox => checkbox.querySelector('input').checked)
			.map(checkbox => checkbox.querySelector('input').value.toLowerCase());
		const priceMin = parseFloat(priceMinInput.value) || 0;
		const priceMax = parseFloat(priceMaxInput.value) || Infinity;
		const selectedOption = Array.from(optionRadios).find(radio => radio.checked)?.value;
		const selectedTimes = Array.from(timeCheckboxes)
			.filter(cb => cb.checked)
			.map(cb => cb.value);
		const selectedQualities = Array.from(qualityCheckboxes)
			.filter(cb => cb.checked)
			.map(cb => cb.value);
		const selectedBatteries = Array.from(batteryCheckboxes)
			.filter(cb => cb.checked)
			.map(cb => cb.value);
		const selectedAdditionally = Array.from(additionallyCheckboxes)
			.filter(cb => cb.checked)
			.map(cb => cb.value);

		products.forEach(product => {
			const priceText = product.querySelector('.product-card__description span:last-child').textContent.replace(/\s/g, '');
			const price = parseFloat(priceText) || 0;
			const brand = product.dataset.brand?.toLowerCase() || '';
			const time = product.dataset.time || '';
			const quality = product.dataset.quality || '';
			const battery = product.dataset.battery || '';
			const additionally = product.dataset.additionally?.split(',') || [];

			let priceMatch = price >= priceMin && price <= priceMax;
			if (selectedOption) {
				switch (selectedOption) {
					case '1': priceMatch = price <= 3000; break;
					case '2': priceMatch = price >= 3000 && price <= 10000; break;
					case '3': priceMatch = price >= 10000 && price <= 50000; break;
					case '4': priceMatch = price > 50000; break;
				}
			}

			const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(brand);
			const timeMatch = selectedTimes.length === 0 || selectedTimes.includes(time);
			const qualityMatch = selectedQualities.length === 0 || selectedQualities.includes(quality);
			const batteryMatch = selectedBatteries.length === 0 || selectedBatteries.includes(battery);
			const additionallyMatch = selectedAdditionally.length === 0 || selectedAdditionally.some(opt => additionally.includes(opt));

			product.style.display = priceMatch && brandMatch && timeMatch && qualityMatch && batteryMatch && additionallyMatch ? '' : 'none';
		});
	}

	// Функция сортировки продуктов
	function sortProducts() {
		const sortValue = select.value;
		const productArray = Array.from(products);
		productArray.sort((a, b) => {
			const priceA = parseFloat(a.querySelector('.product-card__description span:last-child').textContent.replace(/\s/g, '')) || 0;
			const priceB = parseFloat(b.querySelector('.product-card__description span:last-child').textContent.replace(/\s/g, '')) || 0;
			const popularityA = parseInt(a.dataset.popularity) || 0;
			const popularityB = parseInt(b.dataset.popularity) || 0;

			switch (sortValue) {
				case '1': return popularityB - popularityA; // По популярности
				case '2': return priceA - priceB; // Сначала дешевые
				case '3': return priceB - priceA; // Сначала дорогие
			}
		});

		const productsContainer = document.querySelector('.products__body');
		productsContainer.innerHTML = '';
		productArray.forEach(product => productsContainer.appendChild(product));
	}

	// Слушатели событий
	searchInput.addEventListener('input', () => {
		filterBrands();
		filterProducts();
	});

	filterForm.addEventListener('input', filterProducts);
	select.addEventListener('change', () => {
		filterProducts();
		sortProducts();
	});

	// Инициализация
	filterBrands();
	filterProducts();
	sortProducts();
});