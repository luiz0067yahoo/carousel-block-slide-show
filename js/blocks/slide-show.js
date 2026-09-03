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
		if
		(
			((props.attributes.id===undefined)||(props.attributes.id.length==0))
			||
			((props.attributes.url===undefined)||(props.attributes.url.length==0))
			||
			((props.attributes.title===undefined)||(props.attributes.title.length==0))
		)
		{	
			var acc_title=Array();
			var acc_url=Array();
			var acc_description=Array();
		
				
			props.attributes.id=getNewIdCarousel();
			props.attributes.url=Array(1);
			props.attributes.title=Array(1);
			props.attributes.description=Array(1);
			
			
			gallery_items_frame = wp.media.frames.gallery_items = wp.media({
				// Set the title of the modal.
				title:"Selecione seu anexo",
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
			position=0;
			count=0;
			// Select the attachment when the frame opens
			gallery_items_frame.on('close',function() {
				var selection = gallery_items_frame.state().get('selection');
				selection.each(function(attachment) {
					acc_title.splice(position+count, 0, attachment.attributes.title);
					acc_url.splice(position+count, 0, attachment.attributes.url);
					var description_value=attachment.attributes.caption;
					if(description_value==undefined)
						description_value="";
					acc_description.splice(position+count, 0, description_value);
					count++;
				});
				if(selection.length>0){
					props.attributes.url=Array(selection.length);
					props.attributes.title=Array(selection.length);
					props.setAttributes( { title: acc_title } );
					props.setAttributes( { url: acc_url } );
					props.setAttributes( { description: acc_description } );
					
				}
			});
			gallery_items_frame.open();
		}
 
		var sizelines=Math.round((props.attributes.url.length+props.attributes.title.length)/2);

      	
		function updateURl( event ) {
			var item=jQuery(event.target).closest(".carousel-item");
			var All_items=item.closest(".carousel-inner").find(".carousel-item");
			var position=All_items.index(item);
			var acc_url= [...props.attributes.url];
			var acc_title= [...props.attributes.title];
			var acc_description= [...props.attributes.description];
			gallery_items_frame = wp.media.frames.gallery_items = wp.media({
				// Set the title of the modal.
				title:"Selecione seu anexo",
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
			//position=0;
			count=0;
			// Select the attachment when the frame opens
			gallery_items_frame.on('close',function() {
				var selection = gallery_items_frame.state().get('selection');
				selection.each(function(attachment) {
					acc_title[position]=attachment.attributes.title;
					acc_url[position]= attachment.attributes.url;
					var description_value=attachment.attributes.caption;
					if(description_value==undefined)
						description_value="";
					acc_description[position]=description_value;
					count++;
				});
				if(selection.length>0){
					props.attributes.url=Array(selection.length);
					props.attributes.title=Array(selection.length);
					props.setAttributes( { title: acc_title } );
					props.setAttributes( { url: acc_url } );
					props.setAttributes( { description: acc_description } );
					
				}
			});
			gallery_items_frame.open();
		}
		
		function updateTitle( event ) {
			if(event.target.value.length<=50){
				var item=jQuery(event.target).closest(".carousel-item");
				var All_items=item.closest(".carousel-inner").find(".carousel-item");
				var position=All_items.index(item);
				var acc_title= [...props.attributes.title];
				acc_title[position]=event.target.value;
				props.setAttributes( { title: acc_title } );
			}
		}
		
		function updateDescription( newdata ) {
			var newdatastr=newdata.toString();
			var index=newdatastr.indexOf("<p>");
			newdatastr=newdatastr.substr(index);
			newdatastr=newdatastr.replace(/<\/?[^>]+(>|$)/g, "")
			var item=jQuery(event.target.closest(".rich-text")).closest(".carousel-item");
			var All_items=item.closest(".carousel-inner").find(".carousel-item");
			var position=All_items.index(item);
			var acc_description= [...props.attributes.description];
			
			if(newdatastr.length<=100){
				acc_description[position]=newdata;
				props.setAttributes( { description: acc_description } );
				jQuery(event.target.closest(".rich-text")).attr("backup",jQuery(event.target.closest(".rich-text")).html());
				console.log(jQuery(event.target.closest(".rich-text")).attr("backup"));
			}
			else
				jQuery(event.target.closest(".rich-text")).html(jQuery(event.target.closest(".rich-text")).attr("backup"));
		}
		
		if(jQuery(".slide-show-block").find(".carousel").find(".carousel-inner").find(".carousel-item").find(".rich-text").attr("bindPaste")!=true)
		jQuery(".slide-show-block").find(".carousel").find(".carousel-inner").find(".carousel-item").find(".rich-text").bind("paste", function(e){
				
				var newdata=jQuery(this).html();
				var pastedData = e.originalEvent.clipboardData.getData('text');
				var newdatastr=newdata.toString();
				
				var index=newdatastr.indexOf("<p>");
				//newdatastr=newdatastr.substr(index);
				console.log("aaaaaaaaaaaaaaa: "+index+"  "+newdatastr);
				newdatastr=newdatastr.replace(/<\/?[^>]+(>|$)/g, "")
				var item=jQuery(this).closest(".carousel-item");
				var All_items=item.closest(".carousel-inner").find(".carousel-item");
				var position=All_items.index(item);
				var acc_description= [...props.attributes.description];
				if(newdatastr.length<=100){
					acc_description[position]=newdata;
					props.setAttributes( { description: acc_description } );
					jQuery(this).attr("backup",jQuery(this).html());
				}
				else
					jQuery(event.target).html(jQuery(event.target).attr("backup"));
				console.log("copia: "+pastedData);
		});
		jQuery(".slide-show-block").find(".carousel").find(".carousel-inner").find(".carousel-item").find(".rich-text").attr("bindPaste",true);
		function addlinkdata( event ) {
			var item=jQuery(event.target).closest(".carousel-item");
			var All_items=item.closest(".carousel-inner").find(".carousel-item");
			var position=All_items.index(item);
			var acc_url= [...props.attributes.url];
			var acc_title= [...props.attributes.title];
			var acc_description= [...props.attributes.description];
			gallery_items_frame = wp.media.frames.gallery_items = wp.media({
					// Set the title of the modal.
					title:"Selecione seu anexo",
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
				//position=0;
				count=1;
				// Select the attachment when the frame opens
				gallery_items_frame.on('close',function() {
					var selection = gallery_items_frame.state().get('selection');
					selection.each(function(attachment) {
						acc_title.splice(position+count, 0, attachment.attributes.title);
						acc_url.splice(position+count, 0, attachment.attributes.url);
						var description_value=attachment.attributes.caption;
						if(description_value==undefined)
							description_value="";
						acc_description.splice(position+count, 0, description_value);
						count++;	
					});
					if(selection.length>0){
						props.attributes.url=Array(selection.length);
						props.attributes.title=Array(selection.length);
						props.setAttributes( { title: acc_title } );
						props.setAttributes( { url: acc_url } );
						props.setAttributes( { description: acc_description } );
						
					}
				});
				gallery_items_frame.open();
			
		}
			
		
		function removelinkdata( event ) {
			var item=jQuery(event.target);
			var All_items=item.closest(".slide-show-block").find("input[type='button'][value='-']");
			if(All_items.length>1){
				var position=All_items.index(item);
				var back_button=item.closest(".slide-show-block").find(".carousel-control-prev-icon");
				back_button.click();
				
				var acc_description= [...props.attributes.description];
				acc_description.splice( position, 1);
				props.setAttributes( { acc_description: acc_description } );
				
				var acc_title= [...props.attributes.title];
				acc_title.splice( position, 1);
				props.setAttributes( { title: acc_title } );
				
				var acc_url= [...props.attributes.url];
				acc_url.splice( position, 1);
				props.setAttributes( { url: acc_url } );
				
			}
		}
		var sizelines=Math.round((props.attributes.url.length+props.attributes.title.length)/2)
		var photos_editor=Array();
		
		
		richTextDescription=el(wp.editor.RichText,
			{
				tagName: 'div',
				className: 'color-1 w-100 text-end text-break',
				multiline:true,
				onChange: updateDescription,
				onkeypress: updateDescription,
				value: props.attributes.description[index],
				placeholder: 'Coloque seu texto aqui 100 caracteres...',
				style:{color:"white",textShadow:" 2px 2px 10px #000000", backgroundColor:"inherit"}
			}							
		)
		
		for(index=0;index<sizelines;index++){  
			var active="";
			if (index==0)
				active="active";
			var _backgroundImage=("url("+props.attributes.url[index]+")");
			photos_editor.push(
				el( 'div',
					{ 
						className: 'carousel-item rounded '+active,
						style:{width:"100%",height:"100%","background-image":_backgroundImage,"background-size":"Cover","background-position": "center center"}
					},
					el('button',
						{
							href:"#",
							style:{position:'absolute',marginTop:'40px',marginLeft:'10px',width:"30px",cursor:'hand',color:'white',backgroundColor:'#0d6efd',zIndex:10000	},
							onClick:updateURl,
							className:"link"
						},
						el('i',
							{
								className:"fas fa-camera",
								'aria-hidden':'true',
							},
							""
						)
					),
					el(
						'input', 
						{
							type: 'button', 							
							ariaLabel:"Remover Linha",
							value: '-',
							onClick: removelinkdata,
							style: { position:'absolute',marginTop:'10px',marginLeft:'10px',minWidth: '15px',minHeight:'15px',backgroundColor:'red',color:'white', paddingLeft:'0px',paddingRight:'0px',paddingTop:'0px',paddingBottom:'0px',zIndex:10000}
						}
					),
					el(
						'input', 
						{
							type: 'button', 							
							ariaLabel:"Adiciona Linha",
							value: '+',
							onClick: addlinkdata,
							style: { position:'absolute',marginTop:'10px',marginLeft:'25px',minWidth: '15px',minHeight:'15px',backgroundColor:'black',color:'white', paddingLeft:'0px',paddingRight:'0px',paddingTop:'0px',paddingBottom:'0px',zIndex:10000}
						}
					)
					,
					el( 
						'div', 
						{ 
							className: 'carousel-caption color-1 w-100',
							style:{"top":"calc(100% - 40px)",right:"10px",left:"auto"}
						},
						el('h4', 
							
							{
								className: 'color-1 w-100 text-break',
								style:{textShadow:" 2px 2px 10px #000000"}
							},
							el('input',
								{	className: 'color-1 w-100 text-end ',
									onChange: updateTitle,
									style:{color:"inherit", backgroundColor:"inherit"},
									value:props.attributes.title[index],
									placeholder: 'Coloque seu título aqui até 50 caracteres...'
								}
							)
						),
						richTextDescription
					)
				)
			)
		}
		
		var buttons_editor=Array();
		for(index=0;index<sizelines;index++){  
			var active="";
			if (index==0)				
				buttons_editor.push(
					el( 'button',
						{ 
							type:'button',
							'data-bs-target':'#'+props.attributes.id,
							//'data-bs-target':'#carouselExampleInterval'+jQuery('.slide_show').length,
							'data-bs-slide-to':index,
							className: "active",
							'aria-current':'true',
							'aria-label':props.attributes.title[index]+" "
						}
					)
				)
			else			
				buttons_editor.push(
					el( 'button',
						{ 
							type:'button',
							//'data-bs-target':'#carouselExampleInterval'+jQuery('.slide_show').length,
							'data-bs-target':'#'+props.attributes.id,
							'data-bs-slide-to':index,
							'aria-label':props.attributes.title[index]+" "
							
						}
					)
				)
		}
		
		return el( 'div', {className:"w-100 slide-show-block "},
			el( 'div', {className:"rounded",style:{width:"80%",overflowX:"hidden",marginLeft:"auto",marginRight:"auto"}},
				el( 'div', 
					{ 
						//id:'carouselExampleInterval'+jQuery('.slide_show').length,
						id:props.attributes.id,
						className: 'carousel slide mx-auto',
						style:{width:"100%",paddingTop:"50%",minWidth:"280px", "margin-bottom":"calc(170px - 6vw)"},
						'data-bs-ride':'carousel'
						
					},
					
					el( 'div', 
						{ className: 'carousel-indicators'},
						buttons_editor	
					),
					el( 'div', 
						{ 
							className: 'carousel-inner',					
							style:{height: '100%',width:"100%",position:"absolute",top:"0px",overflow:"visible"}
						},
						
						photos_editor
					),
					el('button',
						{
							className:'carousel-control-prev',
							//'data-bs-target':'#carouselExampleInterval'+jQuery('.slide_show').length,
							'data-bs-target':'#'+props.attributes.id,
							'data-bs-slide':'prev'
						},
						el('span',
							{
								className:'carousel-control-prev-icon',
								'aria-hidden':'true'
							}
						)
					)
					,el('button',
						{
							className:'carousel-control-next',
							//'data-bs-target':'#carouselExampleInterval'+jQuery('.slide_show').length,
							'data-bs-target':'#'+props.attributes.id,
							'data-bs-slide':'next'
						},
						el('span',
							{
								className:'carousel-control-next-icon',
								'aria-hidden':'true'
							}
						)
					)
				)
			)
		); 

	},	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	save: function(props) {
		
		
		
		
		
		
		var sizelines=Math.round((props.attributes.url.length+props.attributes.title.length)/2)
		var photos_editor=Array();
		for(index=0;index<sizelines;index++){  
			var active="";
			if (index==0)
				active="active";
			var _backgroundImage=("url("+props.attributes.url[index]+")");
			photos_editor.push(
				el( 'div',
					{ 
						className: 'carousel-item rounded '+active,
						style:{width:"100%",height:"100%","background-image":_backgroundImage,"background-size":"Cover","background-position": "center center"}
					}
					
					,
					el( 
						'div', 
						{ 
							className: 'carousel-caption color-1 w-100',
							style:{"top":"calc(100% - 25px)",right:"10px",left:"auto"}
						},
						el('h4', 
							
							{
								className: 'color-1 w-100 text-end text-break',
								style:{textShadow:" 2px 2px 10px #000000"}
							},
							props.attributes.title[index]
							
						),
						el('div',
							{
								className: 'color-1 w-100 text-end text-break',
								style:{color:"white",textShadow:" 2px 2px 10px #000000", backgroundColor:"inherit"}
							},
							(typeof window.HTMLReactParser === 'function') 
								? window.HTMLReactParser(props.attributes.description[index] || '') 
								: el(wp.element.RawHTML, {}, props.attributes.description[index] || '')
						)
					)
				)
			)
		}
		
		var buttons_editor=Array();
		for(index=0;index<sizelines;index++){  
			var active="";
			if (index==0)				
				buttons_editor.push(
					el( 'button',
						{ 
							type:'button',
							//'data-bs-target':'#carouselExampleInterval'+jQuery('.slide_show').length,
							'data-bs-target':'#'+props.attributes.id,
							'data-bs-slide-to':index,
							className: "active",
							'aria-current':'true',
							'aria-label':props.attributes.title[index]+" "
						}
					)
				)
			else			
				buttons_editor.push(
					el( 'button',
						{ 
							type:'button',
							//'data-bs-target':'#carouselExampleInterval'+jQuery('.slide_show').length,
							'data-bs-target':'#'+props.attributes.id,
							'data-bs-slide-to':index,
							'aria-label':props.attributes.title[index]+" "
						}
					)
				)
		}
		
		
		return el( 'div', {className:"w-100 slide-show-block "},
			el( 'div', {className:"rounded",style:{width:"80%",overflowX:"hidden",marginLeft:"auto",marginRight:"auto"}},
				el( 'div', 
					{ 
						//id:'carouselExampleInterval'+jQuery('.slide_show').length,
						id:props.attributes.id,
						className: 'carousel slide mx-auto',
						style:{width:"100%",paddingTop:"50%",minWidth:"280px", "margin-bottom":"calc(170px - 6vw)"},
						'data-bs-ride':'carousel'
						
					},
					
					el( 'div', 
						{ className: 'carousel-indicators'},
						buttons_editor	
					),
					el( 'div', 
						{ 
							className: 'carousel-inner',					
							style:{height: '100%',width:"100%",position:"absolute",top:"0px",overflow:"visible"}
						},
						
						photos_editor
					),
					el('button',
						{
							className:'carousel-control-prev',
							//'data-bs-target':'#carouselExampleInterval'+jQuery('.slide_show').length,
							'data-bs-target':'#'+props.attributes.id,
							'data-bs-slide':'prev'
						},
						el('span',
							{
								className:'carousel-control-prev-icon',
								'aria-hidden':'true'
							}
						)
					)
					,el('button',
						{
							className:'carousel-control-next',
							//'data-bs-target':'#carouselExampleInterval'+jQuery('.slide_show').length,
							'data-bs-target':'#'+props.attributes.id,
							'data-bs-slide':'next'
						},
						el('span',
							{
								className:'carousel-control-next-icon',
								'aria-hidden':'true'
							}
						)
					)
				)
			)
		);  
	}	
});


