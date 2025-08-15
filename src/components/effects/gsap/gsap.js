import { FLS } from "@js/common/functions.js";
import { gsap, ScrollTrigger } from "gsap/all";
import './gsap.scss';

console.log('GSAP script loaded');

function gsapInit() {

	if (!gsap || !ScrollTrigger) {
		return;
	}

	gsap.registerPlugin(ScrollTrigger);

	// Расширенный объект с типами анимации
	const animationTypes = {
		'fade-scale': {
			opacity: 0,
			y: 50,
			scale: 0.5,
			duration: 0.8,
			stagger: 0.1,
			ease: 'power3.out',
			start: 'top 40%'
		},
		'slide-left': {
			opacity: 0,
			x: -100,
			duration: 1,
			stagger: 0.15,
			ease: 'power2.out',
			start: 'top 40%'
		},
		'slide-right': {
			opacity: 0,
			x: 100,
			duration: 1,
			stagger: 0.15,
			ease: 'power2.out',
			start: 'top 40%'
		},
		'slide-up': {
			opacity: 0,
			y: -50,
			duration: 0.9,
			stagger: 0.1,
			ease: 'power3.inOut',
			start: 'top 40%'
		},
		'rotate': {
			opacity: 0,
			rotation: 90,
			y: 30,
			duration: 0.9,
			stagger: 0.2,
			ease: 'back.out(1.7)',
			start: 'top 40%'
		},
		'bounce': {
			opacity: 0,
			y: -100,
			scale: 0.8,
			duration: 1.2,
			stagger: 0.2,
			ease: 'elastic.out(1, 0.3)',
			start: 'top 40%'
		},
		'fade': {
			opacity: 0,
			duration: 0.6,
			stagger: 0.1,
			ease: 'power1.inOut',
			start: 'top 40%'
		},
		'flip-x': {
			opacity: 0,
			rotationX: 90,
			y: 20,
			duration: 1,
			stagger: 0.15,
			ease: 'power3.out',
			start: 'top 40%'
		},
		'flip-y': {
			opacity: 0,
			rotationY: 90,
			y: 20,
			duration: 1,
			stagger: 0.15,
			ease: 'power3.out',
			start: 'top 40%'
		},
		'zoom-in': {
			opacity: 0,
			scale: 2,
			duration: 0.7,
			stagger: 0.1,
			ease: 'power2.in',
			start: 'top 40%'
		},
		'zoom-out': {
			opacity: 0,
			scale: 0.3,
			duration: 0.7,
			stagger: 0.1,
			ease: 'power2.out',
			start: 'top 40%'
		},
		'skew': {
			opacity: 0,
			skewX: 30,
			x: 50,
			duration: 0.8,
			stagger: 0.15,
			ease: 'power3.out',
			start: 'top 40%'
		},
		'pop': {
			opacity: 0,
			scale: 0,
			duration: 0.5,
			stagger: 0.1,
			ease: 'back.out(2)',
			start: 'top 40%'
		},
		'fade-stagger': {
			opacity: 0,
			y: 20,
			duration: 0.8,
			stagger: { amount: 0.5, from: 'center' },
			ease: 'power2.inOut',
			start: 'top 40%'
		},
		'wave': {
			opacity: 0,
			y: 50,
			rotation: 10,
			duration: 1,
			stagger: { amount: 0.6, from: 'edges' },
			ease: 'sine.out',
			start: 'top 40%'
		}
	};

	const animatedSections = document.querySelectorAll('[data-fls-gsap]');


	if (animatedSections.length > 0) {
		animatedSections.forEach(section => {
			const animatedItems = section.querySelectorAll('[data-gsap-item]');


			if (animatedItems.length > 0) {
				const animationType = section.getAttribute('data-gsap-type') || 'fade-scale';
				const config = animationTypes[animationType] || animationTypes['fade-scale'];

				const duration = section.getAttribute('data-gsap-duration') ? parseFloat(section.getAttribute('data-gsap-duration')) : config.duration;
				const stagger = section.getAttribute('data-gsap-stagger') ? parseFloat(section.getAttribute('data-gsap-stagger')) : (typeof config.stagger === 'object' ? config.stagger : { amount: config.stagger });
				const ease = section.getAttribute('data-gsap-ease') || config.ease;
				const start = section.getAttribute('data-gsap-start') || config.start;

				const fromProps = { ...config };
				delete fromProps.duration;
				delete fromProps.stagger;
				delete fromProps.ease;
				delete fromProps.start;

				gsap.from(animatedItems, {
					...fromProps,
					duration,
					stagger,
					ease,
					scrollTrigger: {
						trigger: section,
						start,
						toggleActions: 'play none none none',
					}
				});
			}
		});
	}
}

document.addEventListener('DOMContentLoaded', () => {
	gsapInit();
});