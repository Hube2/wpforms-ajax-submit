	
	// WPForms AJAX Submission
	
	jQuery(document).ready(function($) {
		$('.wpforms-ajax-submit form').each(function(index, element) {
			var form_id = $(element).attr('id');
			$(element).attr('action', 'javascript: wpforms_ajax_submit("'+form_id+'");');
			$(element).append('<input type="hidden" name="action" value="wpforms_ajax_submit" />');
		});
	});
	
	function wpforms_ajax_submit(form_id) {
		$ = jQuery;
		var ajaxurl = wpforms_ajax_submit_data.ajaxurl;
		var ajaxdata = $('#'+form_id).serialize();
		//ajaxdata.action = 'wpforms_ajax_submit';
		$.ajax({
			type: 'post',
			dataType: 'json',
      url: ajaxurl,
      data: ajaxdata,
      success: function(json) {
				//console.log(json);
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
		});
	}