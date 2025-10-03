import "./filter.scss";

document.addEventListener('DOMContentLoaded', () => {
	const searchInput = document.querySelector('.search__input');
	const checkboxes = document.querySelectorAll('.search__checkbox');

	// Функция фильтрации брендов
	function filterBrands() {
		const searchTerm = searchInput.value.toLowerCase();
		checkboxes.forEach(label => {
			const text = label.querySelector('.checkbox-search__text').textContent.toLowerCase();
			label.style.display = text.includes(searchTerm) ? '' : 'none';
		});
		window.dispatchEvent(new Event('resize')); // Триггер для showMore
	}

	// Слушатели событий
	searchInput.addEventListener('input', () => {
		filterBrands();

	});

	// Инициализация
	filterBrands();
});