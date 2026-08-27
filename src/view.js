/**
 * Frontend script for Bootstrap Carousel Gutenberg Block.
 * Ensures the carousel initializes reliably across any WordPress theme.
 */
(function () {
	'use strict';

	function initCarousels() {
		const carousels = document.querySelectorAll('.wp-bootstrap-carousel.carousel');

		if (!carousels.length) return;

		carousels.forEach(function (carouselEl) {
			// Check if already initialized
			if (carouselEl.dataset.carouselInitialized === 'true') return;

			// Extract options from data attributes
			const ride = carouselEl.getAttribute('data-bs-ride') === 'carousel';
			const intervalAttr = carouselEl.getAttribute('data-bs-interval');
			const interval = intervalAttr && intervalAttr !== 'false' ? parseInt(intervalAttr, 10) : 5000;
			const pause = carouselEl.getAttribute('data-bs-pause') === 'hover' ? 'hover' : false;
			const keyboard = carouselEl.getAttribute('data-bs-keyboard') !== 'false';
			const touch = carouselEl.getAttribute('data-bs-touch') !== 'false';

			// If Bootstrap 5 Carousel object is present in window
			if (typeof window.bootstrap !== 'undefined' && typeof window.bootstrap.Carousel !== 'undefined') {
				try {
					const bsCarousel = window.bootstrap.Carousel.getOrCreateInstance(carouselEl, {
						interval: ride ? interval : false,
						ride: ride ? 'carousel' : false,
						pause: pause,
						keyboard: keyboard,
						touch: touch,
						wrap: true
					});

					if (ride) {
						bsCarousel.cycle();
					}
				} catch (e) {
					console.warn('Bootstrap Carousel initialization notice:', e);
				}
			}

			// Touch swipe fallback if Bootstrap touch is not active or needed
			if (touch) {
				let touchStartX = 0;
				let touchEndX = 0;

				carouselEl.addEventListener('touchstart', function (e) {
					touchStartX = e.changedTouches[0].screenX;
				}, { passive: true });

				carouselEl.addEventListener('touchend', function (e) {
					touchEndX = e.changedTouches[0].screenX;
					handleSwipe();
				}, { passive: true });

				function handleSwipe() {
					const diff = touchEndX - touchStartX;
					const threshold = 50; // Minimum swipe distance in px

					if (Math.abs(diff) > threshold) {
						if (diff < 0) {
							// Swipe Left -> Next
							const nextBtn = carouselEl.querySelector('.carousel-control-next');
							if (nextBtn) nextBtn.click();
						} else {
							// Swipe Right -> Prev
							const prevBtn = carouselEl.querySelector('.carousel-control-prev');
							if (prevBtn) prevBtn.click();
						}
					}
				}
			}

			carouselEl.dataset.carouselInitialized = 'true';
		});
	}

	// Run on DOM ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initCarousels);
	} else {
		initCarousels();
	}

	// Also re-check when window is fully loaded (in case Bootstrap JS was deferred)
	window.addEventListener('load', initCarousels);
})();
