import { gotoBlock, FLS } from "@js/common/functions.js";
import { formValidate } from "../_functions.js";

let currentStep = 0;
let steps = null;
let showStep = null;
let updateButtons = null;

document.addEventListener('DOMContentLoaded', () => {
	const form = document.querySelector('#form-step');
	if (!form) return;
	steps = form.querySelectorAll('.form-step__body');
	const prevButtons = form.querySelectorAll('.left-step__prev');
	const nextButtons = form.querySelectorAll('.left-step__next');
	const navigationItems = form.querySelectorAll('.navigation-step__item');
	let isProcessing = false;

	showStep = function () {
		steps.forEach((step, index) => {
			if (index === currentStep) {
				step.classList.add('active');
			} else {
				step.classList.remove('active');
			}
		});
		updateButtons();
	};

	updateButtons = function () {
		prevButtons.forEach(button => {
			button.disabled = currentStep === 0;
		});
		nextButtons.forEach(button => {
			button.disabled = currentStep === steps.length - 1;
		});
	};

	showStep();

	prevButtons.forEach(button => {
		button.addEventListener('click', (event) => {
			event.preventDefault();
			event.stopPropagation();
			if (currentStep > 0 && !isProcessing) {
				isProcessing = true;
				currentStep--;
				showStep();
				updateButtons();
				setTimeout(() => { isProcessing = false; }, 300);
			}
		});
	});

	nextButtons.forEach(button => {
		button.addEventListener('click', (event) => {
			event.preventDefault();
			event.stopPropagation();
			if (validateCurrentStep() && currentStep < steps.length - 1 && !isProcessing) {
				isProcessing = true;
				currentStep++;
				showStep();
				updateButtons();
				setTimeout(() => { isProcessing = false; }, 300);
			}
		});
	});

	function validateCurrentStep() {
		const currentStepElement = steps[currentStep];
		const errorCount = formValidate.getErrors(currentStepElement);
		return errorCount === 0;
	}
});

function formInit() {
	function formSubmit() {
		const forms = document.forms;
		if (forms.length) {
			for (const form of forms) {
				!form.hasAttribute('data-fls-form-novalidate') ? form.setAttribute('novalidate', true) : null;
				form.addEventListener('submit', function (e) {
					const form = e.target;
					formSubmitAction(form, e);
				});
				form.addEventListener('reset', function (e) {
					const form = e.target;
					formValidate.formClean(form);
					if (form.id === 'form-step') {
						currentStep = 0;
						showStep();
					}
				});
			}
		}
		async function formSubmitAction(form, e) {
			const error = formValidate.getErrors(form);
			if (error === 0) {
				if (form.dataset.flsForm === 'ajax') {
					e.preventDefault();
					const formAction = form.getAttribute('action') ? form.getAttribute('action').trim() : '#';
					const formMethod = form.getAttribute('method') ? form.getAttribute('method').trim() : 'GET';
					const formData = new FormData(form);
					form.classList.add('--sending');
					const response = await fetch(formAction, {
						method: formMethod,
						body: formData
					});
					if (response.ok) {
						let responseResult = await response.json();
						form.classList.remove('--sending');
						formSent(form, responseResult);
					} else {
						FLS("_FLS_FORM_AJAX_ERR");
						form.classList.remove('--sending');
					}
				} else if (form.dataset.flsForm === 'dev') {
					e.preventDefault();
					formSent(form);
				}
			} else {
				e.preventDefault();
				if (form.querySelector('.--form-error') && form.hasAttribute('data-fls-form-gotoerr')) {
					const formGoToErrorClass = form.dataset.flsFormGotoerr ? form.dataset.flsFormGotoerr : '.--form-error';
					gotoBlock(formGoToErrorClass);
				}
			}
		}
		function formSent(form, responseResult = ``) {
			document.dispatchEvent(new CustomEvent("formSent", {
				detail: { form: form }
			}));
			// Очищаем форму
			formValidate.formClean(form);
			// Показ финального шага для формы с id="form-step"
			if (form.id === 'form-step' && steps && showStep) {
				currentStep = steps.length - 1;
				showStep();
			}
			setTimeout(() => {
				if (window.flsPopup) {
					const popup = form.dataset.flsFormPopup;
					popup ? window.flsPopup.open(popup) : null;
				}
			}, 0);
			FLS(`_FLS_FORM_SEND`);
		}
	}
	function formFieldsInit() {
		document.body.addEventListener("focusin", function (e) {
			const targetElement = e.target;
			if ((targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA')) {
				if (!targetElement.hasAttribute('data-fls-form-nofocus')) {
					targetElement.classList.add('--form-focus');
					targetElement.parentElement.classList.add('--form-focus');
				}
				if (!targetElement.dataset.originalPlaceholder) {
					targetElement.dataset.originalPlaceholder = targetElement.placeholder;
				}
				formValidate.removeError(targetElement);
				targetElement.hasAttribute('data-fls-form-validatenow') ? formValidate.validateInput(targetElement) : null;
			}
		});
		document.body.addEventListener("focusout", function (e) {
			const targetElement = e.target;
			if ((targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA')) {
				if (!targetElement.hasAttribute('data-fls-form-nofocus')) {
					targetElement.classList.remove('--form-focus');
					targetElement.parentElement.classList.remove('--form-focus');
				}
				targetElement.hasAttribute('data-fls-form-validatenow') ? formValidate.validateInput(targetElement) : null;
			}
		});
	}
	formSubmit();
	formFieldsInit();
}
document.querySelector('[data-fls-form]') ? window.addEventListener('load', formInit) : null;