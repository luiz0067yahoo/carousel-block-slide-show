import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	RangeControl,
	SelectControl,
	TextControl,
	TextareaControl,
	Button,
	ButtonGroup,
	Notice,
	Dashicon
} from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';

export default function Edit({ attributes, setAttributes, clientId }) {
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

	const [activeSlideIndex, setActiveSlideIndex] = useState(0);

	// Generate a unique ID for carousel data targets if not already present
	useEffect(() => {
		if (!uniqueId) {
			const cleanId = 'carousel-' + clientId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8);
			setAttributes({ uniqueId: cleanId });
		}
	}, [clientId, uniqueId, setAttributes]);

	// Keep active slide in range
	useEffect(() => {
		if (slides.length > 0 && activeSlideIndex >= slides.length) {
			setActiveSlideIndex(slides.length - 1);
		}
	}, [slides.length, activeSlideIndex]);

	const blockProps = useBlockProps({
		className: `wp-bootstrap-carousel-editor ${darkVariant ? 'carousel-dark' : ''}`
	});

	// Slide operations
	const addSlide = () => {
		const newSlide = {
			id: Date.now(),
			url: '',
			alt: '',
			title: '',
			caption: '',
			buttonText: '',
			buttonUrl: '',
			buttonTarget: '_self',
			buttonStyle: 'primary'
		};
		const updatedSlides = [...slides, newSlide];
		setAttributes({ slides: updatedSlides });
		setActiveSlideIndex(updatedSlides.length - 1);
	};

	const removeSlide = (indexToRemove) => {
		const updatedSlides = slides.filter((_, index) => index !== indexToRemove);
		setAttributes({ slides: updatedSlides });
		if (activeSlideIndex >= updatedSlides.length) {
			setActiveSlideIndex(Math.max(0, updatedSlides.length - 1));
		}
	};

	const moveSlide = (currentIndex, direction) => {
		const targetIndex = currentIndex + direction;
		if (targetIndex < 0 || targetIndex >= slides.length) return;

		const updatedSlides = [...slides];
		const temp = updatedSlides[currentIndex];
		updatedSlides[currentIndex] = updatedSlides[targetIndex];
		updatedSlides[targetIndex] = temp;

		setAttributes({ slides: updatedSlides });
		setActiveSlideIndex(targetIndex);
	};

	const updateSlide = (field, value) => {
		const updatedSlides = [...slides];
		if (!updatedSlides[activeSlideIndex]) return;

		updatedSlides[activeSlideIndex] = {
			...updatedSlides[activeSlideIndex],
			[field]: value
		};
		setAttributes({ slides: updatedSlides });
	};

	const onSelectImage = (media) => {
		const updatedSlides = [...slides];
		if (!updatedSlides[activeSlideIndex]) return;

		updatedSlides[activeSlideIndex] = {
			...updatedSlides[activeSlideIndex],
			mediaId: media.id,
			url: media.url,
			alt: media.alt || updatedSlides[activeSlideIndex].alt || ''
		};
		setAttributes({ slides: updatedSlides });
	};

	const onSelectMultipleImages = (mediaArray) => {
		const newSlides = mediaArray.map((media) => ({
			id: Date.now() + Math.random(),
			mediaId: media.id,
			url: media.url,
			alt: media.alt || '',
			title: media.title || '',
			caption: media.caption || '',
			buttonText: '',
			buttonUrl: '',
			buttonTarget: '_self',
			buttonStyle: 'primary'
		}));

		const updatedSlides = [...slides, ...newSlides];
		setAttributes({ slides: updatedSlides });
		setActiveSlideIndex(updatedSlides.length - 1);
	};

	const currentSlide = slides[activeSlideIndex] || null;

	// Calculate aspect ratio styling
	const getAspectRatioClass = () => {
		switch (aspectRatio) {
			case '21-9':
				return 'ratio ratio-21x9';
			case '16-9':
				return 'ratio ratio-16x9';
			case '4-3':
				return 'ratio ratio-4x3';
			case '1-1':
				return 'ratio ratio-1x1';
			case 'custom':
				return 'custom-ratio';
			default:
				return '';
		}
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Slider Settings', 'wordpress-plugin-gutenberg-block-bootstrap-carousel')} initialOpen={true}>
					<ToggleControl
						label={__('Autoplay', 'wordpress-plugin-gutenberg-block-bootstrap-carousel')}
						checked={autoplay}
						onChange={(val) => setAttributes({ autoplay: val })}
						help={__('Automatically cycle through slides.', 'wordpress-plugin-gutenberg-block-bootstrap-carousel')}
					/>
					{autoplay && (
						<RangeControl
							label={__('Slide Interval (ms)', 'wordpress-plugin-gutenberg-block-bootstrap-carousel')}
							value={interval}
							onChange={(val) => setAttributes({ interval: val })}
							min={1000}
							max={15000}
							step={500}
							help={__('Time to display each slide in milliseconds (e.g., 5000 = 5 seconds).', 'wordpress-plugin-gutenberg-block-bootstrap-carousel')}
						/>
					)}
					<ToggleControl
						label={__('Pause on Hover', 'wordpress-plugin-gutenberg-block-bootstrap-carousel')}
						checked={pauseOnHover}
						onChange={(val) => setAttributes({ pauseOnHover: val })}
					/>
					<ToggleControl
						label={__('Fade Transition', 'wordpress-plugin-gutenberg-block-bootstrap-carousel')}
						checked={fadeTransition}
						onChange={(val) => setAttributes({ fadeTransition: val })}
						help={__('Animate slides with a fade transition instead of a slide.', 'wordpress-plugin-gutenberg-block-bootstrap-carousel')}
					/>
					<ToggleControl
						label={__('Keyboard Navigation', 'wordpress-plugin-gutenberg-block-bootstrap-carousel')}
						checked={keyboardNavigation}
						onChange={(val) => setAttributes({ keyboardNavigation: val })}
					/>
					<ToggleControl
						label={__('Touch / Swipe Gestures', 'wordpress-plugin-gutenberg-block-bootstrap-carousel')}
						checked={touchSwipe}
						onChange={(val) => setAttributes({ touchSwipe: val })}
					/>
				</PanelBody>

				<PanelBody title={__('Controls & Indicators', 'wordpress-plugin-gutenberg-block-bootstrap-carousel')} initialOpen={false}>
					<ToggleControl
						label={__('Show Navigation Arrows', 'wordpress-plugin-gutenberg-block-bootstrap-carousel')}
						checked={showControls}
						onChange={(val) => setAttributes({ showControls: val })}
					/>
					<ToggleControl
						label={__('Show Indicators (Dots)', 'wordpress-plugin-gutenberg-block-bootstrap-carousel')}
						checked={showIndicators}
						onChange={(val) => setAttributes({ showIndicators: val })}
					/>
					<ToggleControl
						label={__('Dark Controls Variant', 'wordpress-plugin-gutenberg-block-bootstrap-carousel')}
						checked={darkVariant}
						onChange={(val) => setAttributes({ darkVariant: val })}
						help={__('Use darker controls, indicators, and captions for light backgrounds.', 'wordpress-plugin-gutenberg-block-bootstrap-carousel')}
					/>
				</PanelBody>

				<PanelBody title={__('Dimensions & Sizing', 'wordpress-plugin-gutenberg-block-bootstrap-carousel')} initialOpen={false}>
					<SelectControl
						label={__('Aspect Ratio', 'wordpress-plugin-gutenberg-block-bootstrap-carousel')}
						value={aspectRatio}
						options={[
							{ label: __('Auto (Natural Image Height)', 'wordpress-plugin-gutenberg-block-bootstrap-carousel'), value: 'auto' },
							{ label: __('16:9 Standard Widescreen', 'wordpress-plugin-gutenberg-block-bootstrap-carousel'), value: '16-9' },
							{ label: __('21:9 Ultra-Wide Banner', 'wordpress-plugin-gutenberg-block-bootstrap-carousel'), value: '21-9' },
							{ label: __('4:3 Classic', 'wordpress-plugin-gutenberg-block-bootstrap-carousel'), value: '4-3' },
							{ label: __('1:1 Square', 'wordpress-plugin-gutenberg-block-bootstrap-carousel'), value: '1-1' },
							{ label: __('Custom Fixed Height', 'wordpress-plugin-gutenberg-block-bootstrap-carousel'), value: 'custom' },
						]}
						onChange={(val) => setAttributes({ aspectRatio: val })}
					/>
					{aspectRatio === 'custom' && (
						<TextControl
							label={__('Custom Height (e.g. 500px, 60vh)', 'wordpress-plugin-gutenberg-block-bootstrap-carousel')}
							value={customHeight}
							onChange={(val) => setAttributes({ customHeight: val })}
						/>
					)}
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				{slides.length === 0 ? (
					<div className="carousel-placeholder-box">
						<div className="carousel-placeholder-icon">
							<Dashicon icon="images-alt2" size={48} />
						</div>
						<h3>{__('Bootstrap 5 Carousel', 'wordpress-plugin-gutenberg-block-bootstrap-carousel')}</h3>
						<p>{__('Create an interactive image slider compatible with any WordPress theme.', 'wordpress-plugin-gutenberg-block-bootstrap-carousel')}</p>
						<div className="carousel-placeholder-actions">
							<MediaUploadCheck>
								<MediaUpload
									onSelect={onSelectMultipleImages}
									allowedTypes={['image']}
									multiple={true}
									gallery={true}
									render={({ open }) => (
										<Button variant="primary" onClick={open} icon="format-gallery">
											{__('Upload / Select Multiple Images', 'wordpress-plugin-gutenberg-block-bootstrap-carousel')}
										</Button>
									)}
								/>
							</MediaUploadCheck>
							<Button variant="secondary" onClick={addSlide} icon="plus">
								{__('Add Slide Manually', 'wordpress-plugin-gutenberg-block-bootstrap-carousel')}
							</Button>
						</div>
					</div>
				) : (
					<div className="carousel-editor-wrapper">
						{/* Top Slide Navigation Bar */}
						<div className="carousel-slide-tabs-bar">
							<div className="carousel-slide-tabs">
								{slides.map((slide, index) => (
									<button
										key={slide.id || index}
										type="button"
										className={`carousel-slide-tab ${index === activeSlideIndex ? 'is-active' : ''}`}
										onClick={() => setActiveSlideIndex(index)}
									>
										{slide.url ? (
											<img src={slide.url} alt="" className="tab-thumb" />
										) : (
											<span className="tab-thumb tab-empty-thumb"><Dashicon icon="image" /></span>
										)}
										<span className="tab-label">
											{__('Slide', 'wordpress-plugin-gutenberg-block-bootstrap-carousel')} {index + 1}
										</span>
									</button>
								))}
							</div>
							<div className="carousel-tab-actions">
								<MediaUploadCheck>
									<MediaUpload
										onSelect={onSelectMultipleImages}
										allowedTypes={['image']}
										multiple={true}
										gallery={true}
										render={({ open }) => (
											<Button variant="tertiary" onClick={open} isSmall icon="upload">
												{__('Bulk Add', 'wordpress-plugin-gutenberg-block-bootstrap-carousel')}
											</Button>
										)}
									/>
								</MediaUploadCheck>
								<Button variant="secondary" onClick={addSlide} isSmall icon="plus">
									{__('Add Slide', 'wordpress-plugin-gutenberg-block-bootstrap-carousel')}
								</Button>
							</div>
						</div>

						{/* Live Preview of the Active Slide */}
						<div
							className={`carousel-preview-container ${getAspectRatioClass()} ${fadeTransition ? 'is-fade' : ''}`}
							style={aspectRatio === 'custom' && customHeight ? { height: customHeight } : {}}
						>
							<div className="carousel-preview-slide">
								{currentSlide && currentSlide.url ? (
									<img
										src={currentSlide.url}
										alt={currentSlide.alt || ''}
										className="carousel-preview-img"
									/>
								) : (
									<div className="carousel-preview-no-image">
										<MediaUploadCheck>
											<MediaUpload
												onSelect={onSelectImage}
												allowedTypes={['image']}
												value={currentSlide?.mediaId}
												render={({ open }) => (
													<Button variant="primary" onClick={open} icon="upload">
														{__('Select Image for this Slide', 'wordpress-plugin-gutenberg-block-bootstrap-carousel')}
													</Button>
												)}
											/>
										</MediaUploadCheck>
									</div>
								)}

								{/* Slide Caption Overlay */}
								{currentSlide && (currentSlide.title || currentSlide.caption || currentSlide.buttonText) && (
									<div className="carousel-preview-caption">
										{currentSlide.title && <h5 className="carousel-caption-title">{currentSlide.title}</h5>}
										{currentSlide.caption && <p className="carousel-caption-text">{currentSlide.caption}</p>}
										{currentSlide.buttonText && (
											<span className={`btn btn-${currentSlide.buttonStyle || 'primary'} btn-sm preview-btn`}>
												{currentSlide.buttonText}
											</span>
										)}
									</div>
								)}

								{/* Navigation arrows preview */}
								{showControls && slides.length > 1 && (
									<>
										<button
											type="button"
											className="carousel-preview-control prev"
											onClick={() => setActiveSlideIndex((prev) => (prev > 0 ? prev - 1 : slides.length - 1))}
											aria-label={__('Previous Slide', 'wordpress-plugin-gutenberg-block-bootstrap-carousel')}
										>
											<span className="carousel-control-prev-icon"></span>
										</button>
										<button
											type="button"
											className="carousel-preview-control next"
											onClick={() => setActiveSlideIndex((prev) => (prev < slides.length - 1 ? prev + 1 : 0))}
											aria-label={__('Next Slide', 'wordpress-plugin-gutenberg-block-bootstrap-carousel')}
										>
											<span className="carousel-control-next-icon"></span>
										</button>
									</>
								)}

								{/* Indicators preview */}
								{showIndicators && slides.length > 1 && (
									<div className="carousel-preview-indicators">
										{slides.map((_, idx) => (
											<button
												key={idx}
												type="button"
												className={`indicator-dot ${idx === activeSlideIndex ? 'active' : ''}`}
												onClick={() => setActiveSlideIndex(idx)}
											/>
										))}
									</div>
								)}
							</div>
						</div>

						{/* Active Slide Form & Configuration Card */}
						{currentSlide && (
							<div className="carousel-slide-editor-card">
								<div className="slide-editor-header">
									<h4>
										{__('Editing Slide', 'wordpress-plugin-gutenberg-block-bootstrap-carousel')} #{activeSlideIndex + 1}
									</h4>
									<div className="slide-order-actions">
										<ButtonGroup>
											<Button
												icon="arrow-left-alt2"
												isSmall
												disabled={activeSlideIndex === 0}
												onClick={() => moveSlide(activeSlideIndex, -1)}
												label={__('Move slide left/up', 'wordpress-plugin-gutenberg-block-bootstrap-carousel')}
											/>
											<Button
												icon="arrow-right-alt2"
												isSmall
												disabled={activeSlideIndex === slides.length - 1}
												onClick={() => moveSlide(activeSlideIndex, 1)}
												label={__('Move slide right/down', 'wordpress-plugin-gutenberg-block-bootstrap-carousel')}
											/>
											<Button
												icon="trash"
												isSmall
												isDestructive
												onClick={() => removeSlide(activeSlideIndex)}
												label={__('Delete this slide', 'wordpress-plugin-gutenberg-block-bootstrap-carousel')}
											/>
										</ButtonGroup>
									</div>
								</div>

								<div className="slide-editor-fields">
									<div className="slide-field-group image-field-group">
										<MediaUploadCheck>
											<MediaUpload
												onSelect={onSelectImage}
												allowedTypes={['image']}
												value={currentSlide.mediaId}
												render={({ open }) => (
													<Button variant="secondary" onClick={open} icon="edit" isSmall>
														{currentSlide.url
															? __('Replace Image', 'wordpress-plugin-gutenberg-block-bootstrap-carousel')
															: __('Choose Image', 'wordpress-plugin-gutenberg-block-bootstrap-carousel')}
													</Button>
												)}
											/>
										</MediaUploadCheck>
										<TextControl
											label={__('Image Alt Text', 'wordpress-plugin-gutenberg-block-bootstrap-carousel')}
											value={currentSlide.alt || ''}
											onChange={(val) => updateSlide('alt', val)}
											placeholder={__('Describe image for SEO and screen readers', 'wordpress-plugin-gutenberg-block-bootstrap-carousel')}
										/>
									</div>

									<div className="slide-field-group">
										<TextControl
											label={__('Slide Title (Optional)', 'wordpress-plugin-gutenberg-block-bootstrap-carousel')}
											value={currentSlide.title || ''}
											onChange={(val) => updateSlide('title', val)}
											placeholder={__('e.g. Welcome to our website', 'wordpress-plugin-gutenberg-block-bootstrap-carousel')}
										/>
									</div>

									<div className="slide-field-group">
										<TextareaControl
											label={__('Slide Caption / Description (Optional)', 'wordpress-plugin-gutenberg-block-bootstrap-carousel')}
											value={currentSlide.caption || ''}
											onChange={(val) => updateSlide('caption', val)}
											rows={2}
											placeholder={__('e.g. Discover our latest collections and exclusive offers.', 'wordpress-plugin-gutenberg-block-bootstrap-carousel')}
										/>
									</div>

									<div className="slide-field-row">
										<TextControl
											label={__('Button Text (Optional)', 'wordpress-plugin-gutenberg-block-bootstrap-carousel')}
											value={currentSlide.buttonText || ''}
											onChange={(val) => updateSlide('buttonText', val)}
											placeholder={__('e.g. Learn More', 'wordpress-plugin-gutenberg-block-bootstrap-carousel')}
										/>
										<TextControl
											label={__('Button Link URL', 'wordpress-plugin-gutenberg-block-bootstrap-carousel')}
											value={currentSlide.buttonUrl || ''}
											onChange={(val) => updateSlide('buttonUrl', val)}
											placeholder={__('https://example.com/page', 'wordpress-plugin-gutenberg-block-bootstrap-carousel')}
										/>
									</div>

									{currentSlide.buttonText && (
										<div className="slide-field-row">
											<SelectControl
												label={__('Button Style', 'wordpress-plugin-gutenberg-block-bootstrap-carousel')}
												value={currentSlide.buttonStyle || 'primary'}
												options={[
													{ label: 'Primary (Solid)', value: 'primary' },
													{ label: 'Secondary (Solid)', value: 'secondary' },
													{ label: 'Success (Green)', value: 'success' },
													{ label: 'Danger (Red)', value: 'danger' },
													{ label: 'Warning (Yellow)', value: 'warning' },
													{ label: 'Info (Cyan)', value: 'info' },
													{ label: 'Light', value: 'light' },
													{ label: 'Dark', value: 'dark' },
													{ label: 'Outline Light', value: 'outline-light' },
													{ label: 'Outline Dark', value: 'outline-dark' },
													{ label: 'Outline Primary', value: 'outline-primary' },
												]}
												onChange={(val) => updateSlide('buttonStyle', val)}
											/>
											<SelectControl
												label={__('Link Target', 'wordpress-plugin-gutenberg-block-bootstrap-carousel')}
												value={currentSlide.buttonTarget || '_self'}
												options={[
													{ label: __('Same Window (_self)', 'wordpress-plugin-gutenberg-block-bootstrap-carousel'), value: '_self' },
													{ label: __('New Tab (_blank)', 'wordpress-plugin-gutenberg-block-bootstrap-carousel'), value: '_blank' },
												]}
												onChange={(val) => updateSlide('buttonTarget', val)}
											/>
										</div>
									)}
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</>
	);
}
