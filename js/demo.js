document.getElementById('simple_alert').addEventListener('click', function(){
	popup.alert(
		{
			content : 'Hello. Is me.'
		}
	);
});

document.getElementById('simple_confirm').addEventListener('click', function(){
	popup.confirm(
		{
			content : 'Hello. Can you hear me?.'
		}
	);
});

document.getElementById('simple_prompt').addEventListener('click', function(){
	popup.prompt(
		{
			content : 'Hello. What is your name?'
		},
		function(config){
			if(config.input_value && config.proceed){
				popup.alert({
						content: 'Hi, ' + config.input_value
				});
			} else if(!config.proceed){
				popup.alert({
						content: 'You clicked cancel.'
				});
			}
		}
	);
});

document.getElementById('option_demo').addEventListener('click', function(){
	popup.alert({ 
	  content: 'Hello from the other side...',
	  keyboard : false,
	  btn_align : 'right',
	  modal_size : 'medium',
	  effect : 'none',
	  default_btns : {
	    ok : 'the name you wanted to change'
	  },
	  custom_btns : {
	  	hello : 'Hello, is me...'
	  }
	});
});

document.getElementById('callback_demo').addEventListener('click', function(){
	popup.confirm(
		{ 
		  content: 'Do you like me?',
		  default_btns : {
		    ok : 'Yes',
		    cancel : 'No'
		  },
		  custom_btns : {
		  	maybe : 'Maybe'
		  }
		},
		function(config){
			var e = config.e;

			if(e.target.id == 'btn_extra_1_1'){
				popup.alert({content : 'Is ok, take your time :)'});
			} else if(config.proceed){
				popup.alert({content : 'Yay!'});
			} else if (!config.proceed){
				popup.alert({content : 'So sad...'});
			}
		}
	);
});

// document.getElementById('key_false').addEventListener('click', function(){
// 	popup.confirm(
// 		{
// 			content : 'Try pressing "enter" / "esc" key',
// 			keyboard: false
// 		}
// 	);
// });

// document.getElementById('input_length_10').addEventListener('click', function(){
// 	popup.prompt(
// 		{
// 			content : 'Try input more than 10 character',
// 			input_length: 10
// 		}
// 	);
// });

// document.getElementById('placeholder').addEventListener('click', function(){
// 	popup.prompt(
// 		{
// 			content : 'Enter your name : ',
// 			placeholder : 'Name'
// 		}
// 	);
// });

// document.getElementById('def_btn').addEventListener('click', function(){
// 	popup.confirm(
// 		{
// 			content : 'Ok >> Yes, Cancel >> No',
// 			default_btns : {
// 				ok : 'yes',
// 				cancel : 'no'
// 			}
// 		}
// 	);
// });

// document.getElementById('cus_btn').addEventListener('click', function(){
// 	popup.alert(
// 		{
// 			content : 'New button : btn_1, btn_2',
// 			custom_btns : {
// 				btn1 : 'btn_1',
// 				btn2 : 'btn_2'
// 			}
// 		}
// 	);
// });

// document.getElementById('btn_right').addEventListener('click', function(){
// 	popup.alert(
// 		{
// 			content : 'Buttons are on the right side.',
// 			btn_align : 'right'
// 		}
// 	);
// });

// document.getElementById('modal_md').addEventListener('click', function(){
// 	popup.alert(
// 		{
// 			content : 'Medium sized popup modal.',
// 			modal_size : 'medium'
// 		}
// 	);
// });

// document.getElementById('modal_200').addEventListener('click', function(){
// 	popup.alert(
// 		{
// 			content : 'Popup modal width : 200px',
// 			modal_size : 200
// 		}
// 	);
// });

// document.getElementById('bg_red').addEventListener('click', function(){
// 	popup.alert(
// 		{
// 			content : 'Background overlay color : red',
// 			bg_overlay_color : 'red'
// 		}
// 	);
// });

// document.getElementById('eff_btm').addEventListener('click', function(){
// 	popup.alert(
// 		{
// 			content : 'Slide from bottom',
// 			effect : 'bottom'
// 		}
// 	);
// });

// document.getElementById('eff_right').addEventListener('click', function(){
// 	popup.alert(
// 		{
// 			content : 'Slide from right',
// 			effect : 'right'
// 		}
// 	);
// });

// document.getElementById('eff_left').addEventListener('click', function(){
// 	popup.alert(
// 		{
// 			content : 'Slide from left',
// 			effect : 'left'
// 		}
// 	);
// });

// document.getElementById('eff_none').addEventListener('click', function(){
// 	popup.alert(
// 		{
// 			content : 'No effect',
// 			effect : 'none'
// 		}
// 	);
// });

// document.getElementById('alert').addEventListener('click', function(e){
// 	popup.alert(
// 		{
// 			content : 'Hello alert!',
// 			bg_overlay_color : 'green'
// 		}, 
// 		function(){
// 			popup.alert(
// 				{ 
// 					content: 'you have clicked ok',
// 					bg_overlay_color : 'brown' 
// 				}
// 			);
// 		}
// 	);
// });

// document.getElementById('confirm').addEventListener('click', function(){
// 	popup.confirm(
// 		{
// 			content : 'Hello confirm!'
// 		}, 
// 		function(config){
// 			if(config.proceed){
// 				console.log('confirm true');
// 			} else{
// 				console.log('confirm false');
// 			}
// 		}
// 	);
// });

// document.getElementById('prompt').addEventListener('click', function(){
// 	popup.prompt(
// 		{
// 			content : 'Hello prompt!',
// 			placeholder : 'Name',
// 			input_length : 10,
// 			keyboard : false,
// 			def_buttons : {
// 				ok : 'YES',
// 				cancel : 'NO' 
// 			},
// 			cus_buttons : {
// 				btn1 : 'btn1',
// 				btn2 : 'btn2'
// 			},
// 			btn_align : 'right',
// 			modal_size : 'medium',
// 			bg_overlay_color : 'blue',
// 			effect: 'none'
// 		}, 
// 		function(config){
// 			if(config.input_value && config.proceed){
// 				console.log(config.input_value);
// 			} else if(!config.proceed){
// 				console.log('prompt cancel');
// 			} else {
// 				console.log('rollback');
// 			}
// 		}
// 	);
// });