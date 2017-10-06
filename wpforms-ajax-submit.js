	
	// WPForms AJAX Submission JS
	
	jQuery(document).ready(function($) {
		if (typeof(FormData) == 'undefined') {
			var trigger = location.hash;
			if (trigger && trigger.match(/^#wpforms-/)) {
				var triggerEl = $($('[data-trigger="'+trigger+'"]')[0]);
				var triggerType = triggerEl.attr('data-trigger-type');
				if (typeof(triggerType) == 'undefined') {
					triggerType = 'click';
				}
				triggerEl.trigger(triggerType);
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
				if (!json) {
					return;
				}
				if (json['redirect_url']) {
					window.location = json['redirect_url'];
					return;
				}
				if (json['content']) {
					var container = $('#'+form_id).parent();
					container.empty();
					container.append(json['content']);
				}
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