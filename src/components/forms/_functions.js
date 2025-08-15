// Подключение функционала "Чертоги Фрилансера"
import { FLS } from "@js/common/functions.js"

// Валидация форм
export let formValidate = {
	getErrors(form) {
		FLS(`_FLS_FORM_VALIDATE`);
		let error = 0;
		let formRequiredItems = form.querySelectorAll('[required]');
		if (formRequiredItems.length) {
			formRequiredItems.forEach(formRequiredItem => {
				if ((formRequiredItem.offsetParent !== null || formRequiredItem.tagName === "SELECT") && !formRequiredItem.disabled) {
					error += this.validateInput(formRequiredItem);
				}
			});
		}
		return error;
	},
	validateInput(formRequiredItem) {
		let error = 0;
		if (formRequiredItem.type === "email") {
			formRequiredItem.value = formRequiredItem.value.replace(" ", "");
			if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formRequiredItem.value)) {
				this.addError(formRequiredItem);
				this.removeSuccess(formRequiredItem);
				error++;
			} else {
				this.removeError(formRequiredItem);
				this.addSuccess(formRequiredItem);
			}
		} else if (formRequiredItem.type === "checkbox" && !formRequiredItem.checked) {
			this.addError(formRequiredItem);
			this.removeSuccess(formRequiredItem);
			error++;
		} else if (formRequiredItem.type === "tel") {
			const digits = formRequiredItem.value.replace(/[^\d]/g, '').slice(1);
			if (digits.length !== 10) {
				this.addError(formRequiredItem);
				this.removeSuccess(formRequiredItem);
				error++;
			} else {
				this.removeError(formRequiredItem);
				this.addSuccess(formRequiredItem);
			}
		} else {
			if (!formRequiredItem.value.trim()) {
				this.addError(formRequiredItem);
				this.removeSuccess(formRequiredItem);
				error++;
			} else {
				this.removeError(formRequiredItem);
				this.addSuccess(formRequiredItem);
			}
		}
		return error;
	},
	addError(formRequiredItem) {
		formRequiredItem.classList.add('--form-error');
		formRequiredItem.parentElement.classList.add('--form-error');
		// Удаляем старое сообщение об ошибке, если есть
		let inputError = formRequiredItem.parentElement.querySelector('[data-fls-form-error]');
		if (inputError) formRequiredItem.parentElement.removeChild(inputError);
		// Для инпутов и textarea показываем ошибку в placeholder
		if (formRequiredItem.tagName === "INPUT" || formRequiredItem.tagName === "TEXTAREA") {
			const errorText = formRequiredItem.dataset.flsFormErrtext || "Поле обязательно";
			formRequiredItem.placeholder = errorText;
		}
		// Для чекбокса добавляем ошибку как раньше (если нужно, можно доработать)
		if (formRequiredItem.type === "checkbox" && formRequiredItem.dataset.flsFormErrtext) {
			formRequiredItem.parentElement.insertAdjacentHTML('beforeend', `<div data-fls-form-error>${formRequiredItem.dataset.flsFormErrtext}</div>`);
		}
	},
	removeError(formRequiredItem) {
		formRequiredItem.classList.remove('--form-error');
		formRequiredItem.parentElement.classList.remove('--form-error');
		// Удаляем сообщение об ошибке
		let inputError = formRequiredItem.parentElement.querySelector('[data-fls-form-error]');
		if (inputError) formRequiredItem.parentElement.removeChild(inputError);
		// Восстанавливаем исходный placeholder для инпутов и textarea
		if (formRequiredItem.tagName === "INPUT" || formRequiredItem.tagName === "TEXTAREA") {
			const originalPlaceholder = formRequiredItem.dataset.originalPlaceholder || formRequiredItem.placeholder;
			if (!formRequiredItem.dataset.originalPlaceholder) {
				formRequiredItem.dataset.originalPlaceholder = originalPlaceholder; // Сохраняем исходный placeholder
			}
			formRequiredItem.placeholder = originalPlaceholder;
		}
	},
	addSuccess(formRequiredItem) {
		formRequiredItem.classList.add('--form-success');
		formRequiredItem.parentElement.classList.add('--form-success');
	},
	removeSuccess(formRequiredItem) {
		formRequiredItem.classList.remove('--form-success');
		formRequiredItem.parentElement.classList.remove('--form-success');
	},
	formClean(form) {
		form.reset();
		setTimeout(() => {
			let inputs = form.querySelectorAll('input,textarea');
			for (let index = 0; index < inputs.length; index++) {
				const el = inputs[index];
				el.parentElement.classList.remove('--form-focus');
				el.classList.remove('--form-focus');
				// Восстанавливаем исходный placeholder при очистке
				if (el.dataset.originalPlaceholder) {
					el.placeholder = el.dataset.originalPlaceholder;
				}
				formValidate.removeError(el);
			}
			let checkboxes = form.querySelectorAll('input[type="checkbox"]');
			if (checkboxes.length) {
				checkboxes.forEach(checkbox => {
					checkbox.checked = false;
				});
			}
			if (window['flsSelect']) {
				let selects = form.querySelectorAll('select[data-fls-select]');
				if (selects.length) {
					selects.forEach(select => {
						window['flsSelect'].selectBuild(select);
					});
				}
			}
		}, 0);
	},
	emailTest(formRequiredItem) {
		return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
	}
};