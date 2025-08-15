// Подключение функционала "Чертоги Фрилансера"
import { FLS, slideUp, slideDown, slideToggle, dataMediaQueries } from "@js/common/functions.js";

import './parallax.scss'

class Parallax {
	constructor(elements) {
		if (elements.length) {
			this.elements = Array.from(elements).map((el) => (
				new Parallax.Each(el, this.options)
			));
		}
	}
	destroyEvents() {
		this.elements.forEach(el => {
			el.destroyEvents();
		})
	}
	setEvents() {
		this.elements.forEach(el => {
			el.setEvents();
		})
	}
}
Parallax.Each = class {
	constructor(parent) {
		this.parent = parent;
		this.elements = this.parent.querySelectorAll('[data-fls-parallax]');
		this.animation = this.animationFrame.bind(this);
		this.offset = 0;
		this.value = 0;
		this.smooth = parent.dataset.flsParallaxSmooth ? Number(parent.dataset.flsParallaxSmooth) : 15;
		this.setEvents();
	}
	setEvents() {
		this.animationID = window.requestAnimationFrame(this.animation);
	}
	destroyEvents() {
		window.cancelAnimationFrame(this.animationID);
	}
	animationFrame() {
		const topToWindow = this.parent.getBoundingClientRect().top;
		const heightParent = this.parent.offsetHeight;
		const heightWindow = window.innerHeight;
		const positionParent = {
			top: topToWindow - heightWindow,
			bottom: topToWindow + heightParent,
		}
		const centerPoint = this.parent.dataset.flsParallaxCenter ?
			this.parent.dataset.flsParallaxCenter : 'center';

		if (positionParent.top < 30 && positionParent.bottom > -30) {
			// Элемент в начальном положении (0,0), когда родитель находится относительно экрана:
			switch (centerPoint) {
				// верхней точке (начало родителя касается верхнего края экрана)
				case 'top':
					this.offset = -1 * topToWindow;
					break;
				// центре экрана (середина родителя в середине экрана)
				case 'center':
					this.offset = (heightWindow / 2) - (topToWindow + (heightParent / 2));
					break;
				// начало: нижняя часть экрана = верхняя часть родителя
				case 'bottom':
					this.offset = heightWindow - (topToWindow + heightParent);
					break;
			}
		}
		this.value += (this.offset - this.value) / this.smooth;
		this.animationID = window.requestAnimationFrame(this.animation);

		this.elements.forEach(el => {
			const parameters = {
				axis: el.dataset.axis ? el.dataset.axis : 'v',
				direction: el.dataset.flsParallaxDirection ? el.dataset.flsParallaxDirection + '1' : '-1',
				coefficient: el.dataset.flsParallaxCoefficient ? Number(el.dataset.flsParallaxCoefficient) : 5,
				additionalProperties: el.dataset.flsParallaxProperties ? el.dataset.flsParallaxProperties : '',
			}
			this.parameters(el, parameters);
		})
	}
	parameters(el, parameters) {
		if (parameters.axis == 'v') {
			el.style.transform = `translate3D(0, ${(parameters.direction * (this.value / parameters.coefficient)).toFixed(2)}px,0) ${parameters.additionalProperties}`
		} else if (parameters.axis == 'h') {
			el.style.transform = `translate3D(${(parameters.direction * (this.value / parameters.coefficient)).toFixed(2)}px,0,0) ${parameters.additionalProperties}`
		}
	}
}
if (document.querySelector('[data-fls-parallax-parent]')) {
	new Parallax(document.querySelectorAll('[data-fls-parallax-parent]'));
}