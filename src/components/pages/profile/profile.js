(function initDynamicTitle() {
	const dynamicTitleEls = document.querySelectorAll('.dynamic-title');
	const tabButtons = document.querySelectorAll('.tabs-profile__title');

	const tabTitles = [
		'Контактные данные',
		'Заказы',
		'Платежные данные'
	];

	// Функция обновления заголовков
	function updateTitle(index) {
		dynamicTitleEls.forEach(el => {
			el.textContent = tabTitles[index];
		});
	}

	// Установка заголовка при загрузке
	tabButtons.forEach((btn, index) => {
		if (btn.classList.contains('--tab-active')) {
			updateTitle(index);
		}
	});

	// Обработка кликов по табам
	tabButtons.forEach((btn, index) => {
		btn.addEventListener('click', () => {
			if (btn.classList.contains('tabs-profile__quit')) return;
			updateTitle(index);
		});
	});
})();
// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 

export const viewPass = () => {
	document.addEventListener("click", function (e) {
		let targetElement = e.target;
		if (targetElement.closest('[data-fls-input-viewpass]')) {
			let button = targetElement.closest('[data-fls-input-viewpass]');
			let container = button.closest('.tab-contact__fields'); // Ищем контейнер полей
			let inputs = container.querySelectorAll('input[type="password"], input[type="text"]');
			let isActive = button.classList.contains('--viewpass-active');
			let inputType = isActive ? "password" : "text";
			let buttonTextShow = "Показать пароль"; // Текст при скрытом пароле
			let buttonTextHide = "Скрыть пароль";  // Текст при видимом пароле

			inputs.forEach(input => {
				input.setAttribute("type", inputType);
			});

			button.classList.toggle('--viewpass-active');
			button.textContent = isActive ? buttonTextShow : buttonTextHide; // Меняем текст
		}
	});
}
document.querySelector('[data-fls-input-viewpass]') ?
	window.addEventListener('load', viewPass) : null;