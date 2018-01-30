	
	// WPForms AJAX Submission JS
	
	// this variable will record that a form was submitted through ajax
	// or that the form was submitted at all
	// this value is provided for a way to test to see if a form was submitted
	var wpforms_ajax_submit_done = false;
	
	// this viable will hold the last form id submitted
	// another variable that can be tested from another script
	var wpforms_last_submitted_form = false;
	
	jQuery(document).ready(function($) {
		
		var trigger = location.hash;
		if (!trigger.match(/^#wpforms-/)) {
			trigger = false;
		}
		
		if (typeof(FormData) == 'undefined') {
			if (trigger && trigger.match(/^#wpforms-/)) {
				var triggerEl = $($('[data-trigger="'+trigger+'"]')[0]);
				var triggerType = triggerEl.attr('data-trigger-type');
				if (typeof(triggerType) == 'undefined') {
					triggerType = 'click';
				}
				triggerEl.trigger(triggerType);
				wpforms_ajax_submit_done = true;
				wpforms_last_submitted_form = trigger;
			}
			return;
		}
		$('.wpforms-ajax-submit form').each(function(index, element) {
			var form_id = $(element).attr('id');
			$(element).attr('action', 'javascript: wpforms_ajax_submit("'+form_id+'");');
			$(element).append('<input type="hidden" name="action" value="wpforms_ajax_submit" />');
		});
	});
	
	function wpforms_ajax_submit(form_id) {	
		$ = jQuery;
		// disable form
		var container = $('#'+form_id).parent();
		container.css('position', 'relative');
		container.prepend('<div id="'+form_id+'-disabler" style="background-image:url('+wpforms_ajax_submit_data.disimage+');background-position:left bottom;background-repeat:no-repeat;width:100%;height:100%;position:absolute;background-color:rgba(0,0,0,0.25);z-index:9999;"></div>');
		var ajaxurl = wpforms_ajax_submit_data.ajaxurl;
		var form = $('#'+form_id).get(0);
		ajaxdata = new FormData(form);
		var ajaxobject = {
			type: 'post',
			dataType: 'json',
			url: ajaxurl,
			data: ajaxdata,
			cache: false,
			contentType: false,
			processData: false,
			success: function(json) {
				// enable form
				$('#'+form_id+'-disabler').remove();
				if (!json) {
					return;
				}
				if (json['redirect_url']) {
					window.location = json['redirect_url'];
					return;
				}
				if (json['content']) {
					container.empty();
					container.append(json['content']);
					// make changes to the form that was just inserted
					// so it keeps working
					// thanks @caleb-smith-capstorm
					form = $('#'+form_id).get(0);
					$(form).attr('action', 'javascript: wpforms_ajax_submit("'+form_id+'");');
					$(form).append('<input type="hidden" name="action" value="wpforms_ajax_submit" />');
				}
				wpforms_ajax_submit_done = true;
				wpforms_last_submitted_form = '#'+form_id;				
      },
			error: function(jqHXR, textStatus, error) {
				console.log('error');
				console.log(jqHXR);
				console.log(textStatus);
				console.log(error);
			},
			complete: function(jqHXR, textStatus) {
				//console.log('complete');
				//console.log(jqHXR);
				//console.log(textStatus);
			},
		};
		
		$.ajax(ajaxobject);
	}