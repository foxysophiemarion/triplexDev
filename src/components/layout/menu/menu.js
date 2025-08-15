// Подключение функционала "Чертоги Фрилансера"
import { addTouchAttr, bodyLockStatus, bodyLockToggle, FLS } from "@js/common/functions.js"

import './menu.scss'

export function menuInit() {
	document.addEventListener("click", function (e) {
		if (bodyLockStatus && e.target.closest('[data-fls-menu]')) {
			bodyLockToggle();
			document.documentElement.toggleAttribute("data-fls-menu-open");
		}
	});
}
document.querySelector('[data-fls-menu]') ?
	window.addEventListener('load', menuInit) : null;

export function menuOpen() {
	bodyLock();
	document.documentElement.setAttribute("data-fls-menu-open", "");
}

export function menuClose() {
	bodyUnlock();
	document.documentElement.removeAttribute("data-fls-menu-open");
}

export function catalogInit() {
	document.addEventListener("click", function (e) {
		if (bodyLockStatus && e.target.closest('[data-fls-catalog]')) {
			bodyLockToggle();
			document.documentElement.toggleAttribute("data-fls-catalog-open");
			// Опционально: закрыть меню, если открыто
			if (document.documentElement.hasAttribute("data-fls-menu-open")) {
				menuClose();
			}
		}
	});
}
document.querySelector('[data-fls-catalog]') ?
	window.addEventListener('load', catalogInit) : null;

export function catalogOpen() {
	bodyLock();
	document.documentElement.setAttribute("data-fls-catalog-open", "");
}

export function catalogClose() {
	bodyUnlock();
	document.documentElement.removeAttribute("data-fls-catalog-open");
}
document.querySelector('[data-fls-menu]') ?
	window.addEventListener('load', menuInit) : null