// Подключение модуля
import datepicker from 'js-datepicker';

import langs from "./_lang.json"
import './datepicker.scss'

if (document.querySelector('[data-fls-datepicker]')) {
	const LANG = 'ru' // en
	const datePicker = datepicker('[data-fls-datepicker]', {
		customDays: langs[LANG].week,
		customMonths: langs[LANG].month,
		overlayButton: langs[LANG].button,
		overlayPlaceholder: langs[LANG].year,
		startDay: 1,
		formatter: (input, date, instance) => {
			const value = date.toLocaleDateString();
			input.value = value;
		},
		onShow: function (instance) {
			const popupContent = document.querySelector('[data-fls-popup-body]');
			if (popupContent) {
				popupContent.appendChild(instance.calendarContainer);
			}
		}
	});
	window.flsDatepicker = datePicker;
}
