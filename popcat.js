// Pikto popup modal
// https://github.com/piktochart/piktodev/wiki/New-popup-modal-plugin-:-pikto-popup

var popcat;

(function(){
	var keyboard;

	var modal_dom_class;
	var default_button;
	var MODAL_CREATED = 0;

	var modal_dom;
	var modal_body_dom;
	var modal_footer_dom;

	// store callbacks in an array
	var modal_cb = [];

	var init = function(custom){
		// default classes
		modal_dom_class = {
			modal 			: 'pikto-popup-modal fade',
			dialog			: 'pikto-popup-dialog',
			content			: 'pikto-popup-content',
			body			: '',
			footer			: '',

			btn				: 'pikto-popup-btn pikto-popup-btn-sm',
			btn_primary		: 'pikto-popup-btn-primary',
			btn_secondary	: 'pikto-popup-btn-secondary',
			btn_extra 		: 'pikto-popup-btn-orange',

			backdrop		: 'pikto-popup-backdrop fade'
		};

		// combine default classes and custom classes(if any)
		$.extend(modal_dom_class, modal_dom_class, custom);

		modal_dom_class.btn += " pikto-popup-btn-spacing";

		// default popup modal buttons
		default_button = {
			ok : {
				anchor_class    : 'modal-ok-link',
				button_class    : 'modal-ok-btn ' + modal_dom_class.btn + " " + modal_dom_class.btn_primary,
				inner_text      : 'Ok'
			},
			cancel : {
				anchor_class    : 'modal-cancel-link',
				button_class    : 'modal-cancel-btn ' + modal_dom_class.btn + " " + modal_dom_class.btn_secondary,
				inner_text      : 'Cancel'
			}
		};
	}

	var createModal = function(){
		// increment of amount of popup modal
		addRemoveModal('add');

		// create the html for popup modal
		var create_div = document.createElement('div');

		var div_modal = document.createElement('div');
		div_modal.id = 'pikto-popup-modal-'+MODAL_CREATED;
		div_modal.className = modal_dom_class.modal;

		var div_dialog = document.createElement('div');
		div_dialog.className = modal_dom_class.dialog + " pikto-popup-small";

		var div_content = document.createElement('div');
		div_content.className = modal_dom_class.content;

		var div_body = document.createElement('div');
		div_body.className = 'pikto-popup-body ' + modal_dom_class.body;

		var div_footer = document.createElement('div');
		div_footer.className = 'pikto-popup-footer ' + modal_dom_class.footer;

		$(div_modal).append(div_dialog);
		$(div_dialog).append(div_content);
		$(div_content).append(div_body);
		$(div_content).append(div_footer);

		$('body').append(div_modal);
	}

	// Popup modal function call
	var reveal = function(content, callback, options){
		// create modal
		createModal();

		// initialize default options
		var popup_type = 'alert';
		var popup_placeholder = "";
		var input_length = 99;
		keyboard = true;

		var custom_button_size;

		// push callback in modal_cb array
		if(callback !== undefined){
			modal_cb.push(callback);
		} else {
			modal_cb.push(null);
		}

		// replace the default option if user declare options on their own
		if(options){
			if(options.type){
				popup_type = options.type;
			}

			if(options.keyboard){
				keyboard = options.keyboard; 
			}

			if(options.placeholder){
				popup_placeholder = options.placeholder;
			}

			if(options.buttons){
				custom_button_size = Object.keys(options.buttons).length;
			}

			if(options.input_length){
				input_length = options.input_length;
			}
		} 
		
		if( custom_button_size > 0 ){		// load custom buttons
			loadButtons(popup_type, callback, options.buttons);
		} else {							// load default buttons
			loadButtons(popup_type, callback);
		}

		// attach keydown event listener if keyboard is enabled
		if(keyboard){
			attachKeyboardEvent();
		}

		$(modal_body_dom).html(content);

		// create input box if popup type is prompt
		if(popup_type == 'prompt'){
			var input = document.createElement('input');
			input.type = 'text';
			input.className = 'pikto-popup-input';
			input.value = popup_placeholder;
			input.maxLength = input_length;
			input.style.width = '100%';
			$(modal_body_dom).append(input);
		}
		// reveal the modal 
		showModal(popup_type);

		// rearrange the popup modal's backdrop
		var modalDOMElement = document.getElementById('pikto-popup-modal-'+MODAL_CREATED);
		rearrangeBackdrop(modalDOMElement);
	}

	var loadButtons = function(popup_type, callback, custom_button){
		// empty the footer before continue
		$(modal_footer_dom).empty();

		var buttons = default_button;
		if(custom_button){
			buttons = custom_button;
		}

		// preload the button to the popup modal
		for (var keys in buttons){
			var modal_btn = buttons[keys];

			var anchor_class = custom_button? 'modal-' + modal_btn.class_name + '-link' : modal_btn.anchor_class;
			var button_class = custom_button? 'modal-' + modal_btn.class_name + '-btn' : modal_btn.button_class;

			var anchor_html = document.createElement("a");
			anchor_html.className = anchor_class;
			anchor_html.href = '#';

			var button_html = document.createElement('button');
			button_html.type = 'button';
			button_html.className = button_class;
			button_html.innerHTML = modal_btn.inner_text;

			if(custom_button){
				if( modal_btn.primary ){
					button_html.className += " " + modal_dom_class.btn + " " + modal_dom_class.btn_primary;
				} else if (modal_btn.secondary){
					button_html.className += " " + modal_dom_class.btn + " " + modal_dom_class.btn_secondary;
				} else {
					button_html.className += " " + modal_dom_class.btn + " " + modal_dom_class.btn_extra;
				}
			}

			anchor_html.appendChild(button_html);
			$(modal_footer_dom).append(anchor_html);

			// attach click event listener to each button
			// get only the first class / (regex method : .replace(/^(\S*).*/, '$1'))
			$(modal_dom + ' .'+button_class.split(" ")[0]).on('click', function(e){
				loadCallback(e, callback);

				// hide popup modal before start callback
				hideModal();

				// detach keydown event listener
				$(document).off('keydown.piktoPopup');

				modal_cb.pop();
			});	

			// only loop once if popup type is 'alert' (just to get the 'Ok' button)
			if(popup_type == 'alert'){
				break;		
			}
		}
	}

	var loadCallback = function (e, callback){
		var modal_obj = {};
		modal_obj.e = e;
		modal_obj.proceed = false;

		// check whether to proceed based on button clicked or key entered
		if(e.type == 'click'){
	        if ( $(e.currentTarget).hasClass(modal_dom_class.btn_primary) ){
	            modal_obj.proceed = true;
	            console.log("Click proceed : true");
	        } else {
	        	console.log("Click proceed : false");
	        }
		} else if( e.type == 'keydown' ){
			if ( e.keyCode == 13 ){
				modal_obj.proceed = true;
				console.log("Keydown proceed : true");
			} else {
				console.log("Keydown proceed : false");
			}
	    }

	    // start calling callback function
		if(callback){
			var input_id = $(modal_dom + ' .pikto-popup-input');
			if(input_id){
				modal_obj.input_value = input_id.val();
				callback(modal_obj);
			} else {
				callback(modal_obj);	
			}
		} else {
			return;
		}
	}

	var rearrangeBackdrop = function(elem){
		// rearrange popup modal backdrop's z-index if there is more than 1 backdrop elements in the editor
		var backdrop_list = document.getElementsByClassName('modal-backdrop');
        var last_backdrop = backdrop_list[backdrop_list.length - 1];

        if (backdrop_list.length > 1) {
            last_backdrop.style.zIndex = 1040 + backdrop_list.length - 1;
            if (elem) {
                elem.style.zIndex = parseInt(last_backdrop.style.zIndex) + 1;
            }
        }
	}

	var showModal = function(popup_type){
		// create backdrop for the popup modal
		var backdropDiv = document.createElement('div');
		backdropDiv.id = 'pikto-popup-backdrop';
		backdropDiv.className = modal_dom_class.backdrop + " modal-backdrop";

		$(modal_dom).css('display', 'block');

		if(MODAL_CREATED <= 1){
			$('body').append(backdropDiv);
		}

		if(MODAL_CREATED > 1){
			$('#pikto-popup-modal-'+(MODAL_CREATED-1)).removeClass('in');
		}

		// animation when reveal popup modal
		setTimeout(function(){
			$('#pikto-popup-backdrop').last().addClass('in');

			setTimeout(function(){
				$(modal_dom).addClass('in');
				$(modal_dom).attr('aria-hidden', 'false');
			},150);
		},150);

		// focus on input box if there is an input box
		$(modal_dom + ' .pikto-popup-input').focus();

		console.log("Popup modal : shown");
	}

	var hideModal = function(){
		$(modal_dom).removeClass('in');
		$(modal_dom).attr('aria-hidden', 'true');

		// animation when hide popup modal
		setTimeout(function(){
			$(modal_dom).css('display', 'none');

			if(MODAL_CREATED <= 1){
				$('#pikto-popup-backdrop').last().removeClass('in');
			}
			setTimeout(function(){
				if(MODAL_CREATED <= 1){
					$('#pikto-popup-backdrop').last().remove();
				}

				if(MODAL_CREATED > 1){
					$('#pikto-popup-modal-'+(MODAL_CREATED-1)).addClass('in');

					$('#pikto-popup-modal-'+(MODAL_CREATED-1) + ' .pikto-popup-input').focus();

					if(keyboard){
						attachKeyboardEvent();
					}
				}

				// destroy modal
				$(modal_dom).remove();

				// decrement of amount of popup modal
				addRemoveModal('remove');
			},150);
		},150);

		console.log("Popup modal : hidden");
	}

	var attachKeyboardEvent = function(){
		$(document).off('keydown.piktoPopup').on('keydown.piktoPopup', function(e){
			if(e.keyCode == 13 || e.keyCode == 27){
				loadCallback(e, modal_cb[modal_cb.length - 1]);
				
				// hide popup modal before start callback
				hideModal();

				// detach keydown event listener
				$(document).off('keydown.piktoPopup');

				modal_cb.pop();
				e.preventDefault();
			}
		});
	}

	var addRemoveModal = function(config){
		if(config == 'add'){
			++MODAL_CREATED;
		} else {
			--MODAL_CREATED;
		}
		
		modal_dom = '#pikto-popup-modal-'+MODAL_CREATED;
		modal_body_dom = modal_dom + ' .pikto-popup-body';
		modal_footer_dom = modal_dom + ' .pikto-popup-footer';
	}

	popcat = {
		init 	: init,
		reveal 	: reveal
	};
})();