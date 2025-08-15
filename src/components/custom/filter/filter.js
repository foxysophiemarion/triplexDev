import "./filter.scss"

document.addEventListener('DOMContentLoaded', () => {
	const searchInput = document.querySelector('.search__input');
	const checkboxes = document.querySelectorAll('.search__checkbox');

	searchInput.addEventListener('input', () => {
		const searchTerm = searchInput.value.toLowerCase();
		checkboxes.forEach(label => {
			const text = label.querySelector('.checkbox-search__text').textContent.toLowerCase();
			label.style.display = text.includes(searchTerm) ? '' : 'none';
		});

		// Триггерим пересчет showMore
		window.dispatchEvent(new Event('resize'));
	});
});
