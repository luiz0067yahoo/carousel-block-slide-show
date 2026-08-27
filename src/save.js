import { useBlockProps } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const {
		slides = [],
		autoplay,
		interval,
		pauseOnHover,
		fadeTransition,
		showControls,
		showIndicators,
		darkVariant,
		aspectRatio,
		customHeight,
		keyboardNavigation,
		touchSwipe,
		uniqueId
	} = attributes;

	if (!slides || slides.length === 0) {
		return null;
	}

	const carouselId = uniqueId || 'bootstrap-carousel-' + Math.random().toString(36).substring(2, 9);

	// Determine classes
	const carouselClasses = [
		'carousel',
		'slide',
		'wp-bootstrap-carousel',
		fadeTransition ? 'carousel-fade' : '',
		darkVariant ? 'carousel-dark' : '',
		aspectRatio && aspectRatio !== 'auto' && aspectRatio !== 'custom' ? `ratio-${aspectRatio}` : ''
	]
		.filter(Boolean)
		.join(' ');

	const blockProps = useBlockProps.save({
		id: carouselId,
		className: carouselClasses,
		'data-bs-ride': autoplay ? 'carousel' : 'false',
		'data-bs-interval': autoplay ? interval.toString() : 'false',
		'data-bs-pause': pauseOnHover ? 'hover' : 'false',
		'data-bs-keyboard': keyboardNavigation ? 'true' : 'false',
		'data-bs-touch': touchSwipe ? 'true' : 'false',
		style: aspectRatio === 'custom' && customHeight ? { '--carousel-custom-height': customHeight } : undefined
	});

	return (
		<div {...blockProps}>
			{/* Indicators */}
			{showIndicators && slides.length > 1 && (
				<div className="carousel-indicators">
					{slides.map((_, index) => (
						<button
							key={index}
							type="button"
							data-bs-target={`#${carouselId}`}
							data-bs-slide-to={index}
							className={index === 0 ? 'active' : ''}
							aria-current={index === 0 ? 'true' : undefined}
							aria-label={`Slide ${index + 1}`}
						/>
					))}
				</div>
			)}

			{/* Slides (Carousel Inner) */}
			<div className="carousel-inner">
				{slides.map((slide, index) => {
					const hasContent = slide.title || slide.caption || (slide.buttonText && slide.buttonUrl);

					return (
						<div
							key={slide.id || index}
							className={`carousel-item ${index === 0 ? 'active' : ''}`}
							data-bs-interval={autoplay ? interval : undefined}
						>
							{slide.url ? (
								<img
									src={slide.url}
									className="d-block w-100 carousel-img"
									alt={slide.alt || slide.title || `Slide ${index + 1}`}
									loading={index === 0 ? 'eager' : 'lazy'}
								/>
							) : (
								<div className="carousel-item-placeholder d-block w-100 bg-secondary" />
							)}

							{hasContent && (
								<div className="carousel-caption">
									{slide.title && <h5 className="carousel-caption-title">{slide.title}</h5>}
									{slide.caption && <p className="carousel-caption-text">{slide.caption}</p>}
									{slide.buttonText && slide.buttonUrl && (
										<div className="carousel-caption-btn-wrap">
											<a
												href={slide.buttonUrl}
												className={`btn btn-${slide.buttonStyle || 'primary'}`}
												target={slide.buttonTarget || '_self'}
												rel={slide.buttonTarget === '_blank' ? 'noopener noreferrer' : undefined}
											>
												{slide.buttonText}
											</a>
										</div>
									)}
								</div>
							)}
						</div>
					);
				})}
			</div>

			{/* Controls (Previous / Next Arrows) */}
			{showControls && slides.length > 1 && (
				<>
					<button
						className="carousel-control-prev"
						type="button"
						data-bs-target={`#${carouselId}`}
						data-bs-slide="prev"
					>
						<span className="carousel-control-prev-icon" aria-hidden="true" />
						<span className="visually-hidden">Previous</span>
					</button>
					<button
						className="carousel-control-next"
						type="button"
						data-bs-target={`#${carouselId}`}
						data-bs-slide="next"
					>
						<span className="carousel-control-next-icon" aria-hidden="true" />
						<span className="visually-hidden">Next</span>
					</button>
				</>
			)}
		</div>
	);
}
