var el = wp.element.createElement;
function getRandomArbitrary(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}
function getNewIdCarousel(){
	var id='carousel'+getRandomArbitrary(0,1000);	
	while(jQuery("#"+id).length==1)
		id='carousel'+getRandomArbitrary(0,1000);	
	return id;
}

wp.blocks.registerBlockType('cms-adm/slide-show', {
	title: 'Slide Show',		// Block name visible to user
	icon: 'slides',	// Toolbar icon can be either using WP Dashicons or custom SVG
	category: 'media',	// Under which category the block would appear
	description : 'Inserir as imagens para apresentação do slide show' ,
	
	supports: {
		multiple: true,
	},
	example: {
		attributes: {
			id: 'carousel-template',
			url: [
				'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1000&q=80',
				'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1000&q=80'
			],
			title: [
				'Slide 1',
				'Slide 2'
			],
			description: [
				'<p>Descrição do Slide 1</p>',
				'<p>Descrição do Slide 2</p>'
			]
		}
	},
	attributes: {			// The data this block will be storing
		id: { 
			type: 'string',
			default: ''
		},
		url: { 
			type: 'array',
			default: []
		},
		title: { 
			type: 'array',
			default: []
		},
		description: { 
			type: 'array',
			default: []
		}
	},
	edit: function(props) {
		var useState = (window.wp && wp.element && wp.element.useState) ? wp.element.useState : null;
		var activeState = useState ? useState(0) : [0, function(){}];
		var currentActiveSlide = activeState[0];
		var setCurrentActiveSlide = activeState[1];

		var acc_url = props.attributes.url || [];
		var acc_title = props.attributes.title || [];
		var acc_description = props.attributes.description || [];

		if (!props.attributes.id || acc_url.length === 0 || acc_title.length === 0) {	
			var initial_title = [];
			var initial_url = [];
			var initial_description = [];

			if (!props.attributes.id) {
				props.setAttributes({ id: getNewIdCarousel() });
			}

			var gallery_items_frame = wp.media.frames.gallery_items = wp.media({
				title: "Selecione seu anexo",
				button: {
					text: "linkar anexo"
				},
				states: [
					new wp.media.controller.Library({
						title: "linkar anexo",
						filterable: 'all',
						multiple: true
					})
				]
			});

			gallery_items_frame.on('close', function() {
				var selection = gallery_items_frame.state().get('selection');
				selection.each(function(attachment) {
					initial_title.push(attachment.attributes.title || '');
					initial_url.push(attachment.attributes.url || '');
					initial_description.push(attachment.attributes.caption || '');
				});
				if (selection.length > 0) {
					props.setAttributes({
						title: initial_title,
						url: initial_url,
						description: initial_description
					});
				}
			});
			gallery_items_frame.open();
		}

		function updateURl(position) {
			var frame = wp.media({
				title: "Selecione seu anexo",
				button: {
					text: "linkar anexo"
				},
				states: [
					new wp.media.controller.Library({
						title: "linkar anexo",
						filterable: 'all',
						multiple: false
					})
				]
			});

			frame.on('close', function() {
				var selection = frame.state().get('selection');
				if (selection.length > 0) {
					var attachment = selection.first();
					var new_title = [...(props.attributes.title || [])];
					var new_url = [...(props.attributes.url || [])];
					var new_description = [...(props.attributes.description || [])];

					new_title[position] = attachment.attributes.title || '';
					new_url[position] = attachment.attributes.url || '';
					new_description[position] = attachment.attributes.caption || '';

					props.setAttributes({
						title: new_title,
						url: new_url,
						description: new_description
					});
				}
			});
			frame.open();
		}
		
		function updateTitle(position, value) {
			if (value.length <= 50) {
				var new_title = [...(props.attributes.title || [])];
				new_title[position] = value;
				props.setAttributes({ title: new_title });
			}
		}
		
		function updateDescription(position, newdata) {
			var newdatastr = (newdata || '').toString();
			var plainText = newdatastr.replace(/<\/?[^>]+(>|$)/g, "");
			if (plainText.length <= 100) {
				var new_description = [...(props.attributes.description || [])];
				new_description[position] = newdata;
				props.setAttributes({ description: new_description });
			}
		}
		
		function addlinkdata(position) {
			var frame = wp.media({
				title: "Selecione seu anexo",
				button: {
					text: "linkar anexo"
				},
				states: [
					new wp.media.controller.Library({
						title: "linkar anexo",
						filterable: 'all',
						multiple: true
					})
				]
			});

			frame.on('close', function() {
				var selection = frame.state().get('selection');
				if (selection.length > 0) {
					var new_title = [...(props.attributes.title || [])];
					var new_url = [...(props.attributes.url || [])];
					var new_description = [...(props.attributes.description || [])];
					var insertIndex = position + 1;

					selection.each(function(attachment) {
						new_title.splice(insertIndex, 0, attachment.attributes.title || '');
						new_url.splice(insertIndex, 0, attachment.attributes.url || '');
						new_description.splice(insertIndex, 0, attachment.attributes.caption || '');
						insertIndex++;
					});

					if (setCurrentActiveSlide) {
						setCurrentActiveSlide(insertIndex - 1);
					}

					props.setAttributes({
						title: new_title,
						url: new_url,
						description: new_description
					});
				}
			});
			frame.open();
		}
			
		function removelinkdata(position) {
			var new_url = [...(props.attributes.url || [])];
			var new_title = [...(props.attributes.title || [])];
			var new_description = [...(props.attributes.description || [])];

			if (new_url.length > 1) {
				new_url.splice(position, 1);
				new_title.splice(position, 1);
				new_description.splice(position, 1);

				if (setCurrentActiveSlide && currentActiveSlide >= new_url.length) {
					setCurrentActiveSlide(new_url.length - 1);
				}

				props.setAttributes({
					url: new_url,
					title: new_title,
					description: new_description
				});
			}
		}

		var RichTextComponent = (window.wp && wp.blockEditor && wp.blockEditor.RichText) 
			? wp.blockEditor.RichText 
			: (window.wp && wp.editor && wp.editor.RichText ? wp.editor.RichText : 'div');

		var urls = props.attributes.url || [];
		var titles = props.attributes.title || [];
		var descriptions = props.attributes.description || [];
		var sizelines = urls.length;

		if (currentActiveSlide >= sizelines && sizelines > 0) {
			currentActiveSlide = sizelines - 1;
		}

		var currIdx = currentActiveSlide;
		var _backgroundImage = (urls[currIdx]) ? ("url(" + urls[currIdx] + ")") : "none";

		var descField = el('textarea', {
			key: 'desc-field-' + currIdx,
			className: 'color-1 w-100 text-center text-break',
			rows: 2,
			maxLength: 100,
			value: descriptions[currIdx] || '',
			onChange: function(e) {
				updateDescription(currIdx, e.target.value);
			},
			placeholder: 'Coloque seu texto aqui até 100 caracteres...',
			style: { 
				color: "white", 
				textShadow: "2px 2px 10px #000000", 
				backgroundColor: "transparent",
				border: "none",
				outline: "none",
				resize: "none",
				width: "100%",
				textAlign: "center",
				fontFamily: "inherit",
				fontSize: "14px",
				lineHeight: "1.4",
				padding: "0",
				margin: "0 auto"
			}
		});

		var photos_editor = [
			el('div',
				{ 
					key: 'slide-item-' + currIdx,
					className: 'carousel-item rounded active',
					style: { 
						width: "100%", 
						height: "100%", 
						"background-image": _backgroundImage, 
						"background-size": "cover", 
						"background-position": "center center",
						display: "block"
					}
				},
				el('div', {
					className: 'btn-group shadow-sm',
					style: { position: 'absolute', top: '15px', left: '15px', zIndex: 10000, borderRadius: '6px', overflow: 'hidden' }
				},
					el('button',
						{
							key: 'btn-img-' + currIdx,
							type: 'button',
							className: 'btn btn-success btn-sm',
							title: 'Editar Imagem do Slide',
							style: { padding: '6px 12px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', cursor: 'pointer', gap: '5px' },
							onClick: function() { updateURl(currIdx); }
						},
						el('i', { className: "fas fa-pencil-alt", 'aria-hidden': 'true' }),
						el('span', { style: { fontWeight: '500' } }, 'Editar')
					),
					el('button', {
						key: 'btn-add-' + currIdx,
						type: 'button', 							
						className: 'btn btn-primary btn-sm',
						title: "Adicionar Novo Slide",
						onClick: function() { addlinkdata(currIdx); },
						style: { padding: '6px 12px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', cursor: 'pointer', gap: '5px' }
					}, 
						el('i', { className: "fas fa-plus", 'aria-hidden': 'true' }),
						el('span', { style: { fontWeight: '500' } }, 'Adicionar')
					),
					el('button', {
						key: 'btn-remove-' + currIdx,
						type: 'button', 							
						className: 'btn btn-danger btn-sm',
						title: "Excluir Slide Atual",
						onClick: function() { removelinkdata(currIdx); },
						style: { padding: '6px 12px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', cursor: 'pointer', gap: '5px' }
					}, 
						el('i', { className: "fas fa-times", 'aria-hidden': 'true' }),
						el('span', { style: { fontWeight: '500' } }, 'Excluir')
					)
				),
				el('div', {
					className: 'badge bg-dark bg-opacity-75 shadow-sm',
					style: { 
						position: 'absolute', 
						top: '15px', 
						right: '15px', 
						zIndex: 10000, 
						padding: '7px 12px', 
						fontSize: '13px', 
						borderRadius: '6px',
						display: 'inline-flex',
						alignItems: 'center',
						gap: '6px'
					}
				}, 
					el('i', { className: 'fas fa-images', 'aria-hidden': 'true' }),
					el('span', {}, 'Slide ' + (currIdx + 1) + ' de ' + (sizelines || 1))
				),
				el('div', 
					{ 
						key: 'caption-' + currIdx,
						className: 'carousel-caption w-100 text-center',
						style: { 
							bottom: "0px", 
							left: "0px", 
							right: "0px", 
							width: "100%", 
							background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 35%, rgba(0,0,0,0.88) 100%)", 
							padding: "30px 25px 12px 25px", 
							borderRadius: "0 0 8px 8px",
							zIndex: 1000
						}
					},
					el('h4', 
						{
							key: 'h4-title-' + currIdx,
							className: 'color-1 w-100 text-center text-break',
							style: { textShadow: "2px 2px 10px #000000", margin: "0 auto 6px auto" }
						},
						el('input', {
							key: 'input-title-' + currIdx,
							type: 'text',
							className: 'color-1 w-100 text-center',
							onChange: function(e) { updateTitle(currIdx, e.target.value); },
							style: { 
								color: "#ffffff", 
								backgroundColor: "transparent", 
								border: "none", 
								outline: "none", 
								textAlign: "center",
								fontFamily: "inherit",
								fontSize: "inherit",
								fontWeight: "bold",
								textShadow: "inherit",
								padding: "0",
								width: "100%"
							},
							value: titles[currIdx] || '',
							placeholder: 'Coloque seu título aqui até 50 caracteres...'
						})
					),
					descField
				)
			)
		];

		var buttons_editor = [];
		for (var b = 0; b < sizelines; b++) {
			(function(bIdx) {
				buttons_editor.push(
					el('button', { 
						key: 'indicator-btn-' + bIdx,
						type: 'button',
						onClick: function(e) {
							e.preventDefault();
							if (setCurrentActiveSlide) {
								setCurrentActiveSlide(bIdx);
							}
						},
						className: (bIdx === currIdx) ? "active" : "",
						'aria-current': (bIdx === currIdx) ? 'true' : undefined,
						'aria-label': (titles[bIdx] ? titles[bIdx] : 'Slide ' + (bIdx + 1)) + " "
					})
				);
			})(b);
		}
		
		return el('div', { className: "w-100 slide-show-block" },
			el('div', { className: "rounded", style: { width: "80%", overflowX: "hidden", marginLeft: "auto", marginRight: "auto" } },
				el('div', 
					{ 
						id: props.attributes.id,
						className: 'carousel slide mx-auto',
						style: { width: "100%", paddingTop: "50%", minWidth: "280px", "margin-bottom": "calc(170px - 6vw)", position: "relative" }
					},
					el('div', { className: 'carousel-indicators', style: { zIndex: 10002 } }, buttons_editor),
					el('div', 
						{ 
							className: 'carousel-inner',					
							style: { height: '100%', width: "100%", position: "absolute", top: "0px", overflow: "visible" }
						},
						photos_editor
					),
					el('button',
						{
							type: 'button',
							className: 'carousel-control-prev',
							title: 'Slide Anterior',
							style: {
								position: 'absolute',
								top: '50%',
								left: '15px',
								transform: 'translateY(-50%)',
								width: '42px',
								height: '42px',
								borderRadius: '50%',
								backgroundColor: 'rgba(0, 0, 0, 0.65)',
								border: '1px solid rgba(255, 255, 255, 0.3)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								cursor: 'pointer',
								zIndex: 10005,
								opacity: 1
							},
							onClick: function(e) {
								e.preventDefault();
								if (setCurrentActiveSlide && sizelines > 0) {
									setCurrentActiveSlide((currentActiveSlide - 1 + sizelines) % sizelines);
								}
							}
						},
						el('i', { className: 'fas fa-chevron-left text-white', style: { fontSize: '18px', color: '#ffffff' }, 'aria-hidden': 'true' })
					),
					el('button',
						{
							type: 'button',
							className: 'carousel-control-next',
							title: 'Próximo Slide',
							style: {
								position: 'absolute',
								top: '50%',
								right: '15px',
								transform: 'translateY(-50%)',
								width: '42px',
								height: '42px',
								borderRadius: '50%',
								backgroundColor: 'rgba(0, 0, 0, 0.65)',
								border: '1px solid rgba(255, 255, 255, 0.3)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								cursor: 'pointer',
								zIndex: 10005,
								opacity: 1
							},
							onClick: function(e) {
								e.preventDefault();
								if (setCurrentActiveSlide && sizelines > 0) {
									setCurrentActiveSlide((currentActiveSlide + 1) % sizelines);
								}
							}
						},
						el('i', { className: 'fas fa-chevron-right text-white', style: { fontSize: '18px', color: '#ffffff' }, 'aria-hidden': 'true' })
					)
				)
			)
		); 
	},	
	
	save: function(props) {
		var urls = props.attributes.url || [];
		var titles = props.attributes.title || [];
		var descriptions = props.attributes.description || [];
		var sizelines = urls.length;
		var photos_editor = [];

		for (var index = 0; index < sizelines; index++) {  
			var active = (index === 0) ? "active" : "";
			var _backgroundImage = "url(" + (urls[index] || "") + ")";
			var descHtml = descriptions[index] || '';

			photos_editor.push(
				el('div',
					{ 
						className: 'carousel-item rounded ' + active,
						style: { width: "100%", height: "100%", "background-image": _backgroundImage, "background-size": "cover", "background-position": "center center" }
					},
					el('div', 
						{ 
							className: 'carousel-caption w-100 text-center',
							style: { 
								bottom: "0px", 
								left: "0px", 
								right: "0px", 
								width: "100%", 
								background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 35%, rgba(0,0,0,0.88) 100%)", 
								padding: "30px 25px 12px 25px", 
								borderRadius: "0 0 8px 8px"
							}
						},
						el('h4', 
							{
								className: 'color-1 w-100 text-center text-break',
								style: { color: "#ffffff", textShadow: "2px 2px 10px #000000", margin: "0 auto 6px auto", fontWeight: "bold" }
							},
							titles[index] || ''
						),
						el('div',
							{
								className: 'color-1 w-100 text-center text-break',
								style: { color: "white", textShadow: "2px 2px 10px #000000", backgroundColor: "transparent", fontSize: "14px", lineHeight: "1.4", textAlign: "center" }
							},
							(typeof window.HTMLReactParser === 'function') 
								? window.HTMLReactParser(descHtml) 
								: el(wp.element.RawHTML, {}, descHtml)
						)
					)
				)
			);
		}
		
		var buttons_editor = [];
		for (var bIdx = 0; bIdx < sizelines; bIdx++) {  
			buttons_editor.push(
				el('button',
					{ 
						type: 'button',
						'data-bs-target': '#' + (props.attributes.id || ''),
						'data-bs-slide-to': bIdx,
						className: (bIdx === 0) ? "active" : "",
						'aria-current': (bIdx === 0) ? 'true' : undefined,
						'aria-label': (titles[bIdx] ? titles[bIdx] : 'Slide ' + (bIdx + 1)) + " "
					}
				)
			);
		}
		
		return el('div', { className: "w-100 slide-show-block " },
			el('div', { className: "rounded", style: { width: "80%", overflowX: "hidden", marginLeft: "auto", marginRight: "auto" } },
				el('div', 
					{ 
						id: props.attributes.id,
						className: 'carousel slide mx-auto',
						style: { width: "100%", paddingTop: "50%", minWidth: "280px", "margin-bottom": "calc(170px - 6vw)" },
						'data-bs-ride': 'carousel'
					},
					el('div', { className: 'carousel-indicators' }, buttons_editor),
					el('div', 
						{ 
							className: 'carousel-inner',					
							style: { height: '100%', width: "100%", position: "absolute", top: "0px", overflow: "visible" }
						},
						photos_editor
					),
					el('button',
						{
							type: 'button',
							className: 'carousel-control-prev',
							'data-bs-target': '#' + props.attributes.id,
							'data-bs-slide': 'prev'
						},
						el('span', { className: 'carousel-control-prev-icon', 'aria-hidden': 'true' })
					),
					el('button',
						{
							type: 'button',
							className: 'carousel-control-next',
							'data-bs-target': '#' + props.attributes.id,
							'data-bs-slide': 'next'
						},
						el('span', { className: 'carousel-control-next-icon', 'aria-hidden': 'true' })
					)
				)
			)
		);  
	}	
});


