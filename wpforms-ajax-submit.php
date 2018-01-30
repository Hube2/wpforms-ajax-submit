<?php 

	/*
		Plugin Name: WPForms AJAX Submit
		Plugin URI: https://github.com/Hube2/wpforms-ajax-submit
		GitHub Plugin URI: https://github.com/Hube2/wpforms-ajax-submit
		Description: AJAX Submission for WPForms
		Version: 1.2.1
		Author: John A. Huebner II
		Author URI: https://github.com/Hube2
	*/
	
	// If this file is called directly, abort.
	if (!defined('WPINC')) {die;}
	
	new WPForms_AJAX_submit();
	
	class WPForms_AJAX_submit {
		
		private $version = '1.2.1';
		private $form_id = 0;
		private $redirect_url = '';
		
		public function __construct() {
			add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'), 0);
			add_action('wp_ajax_wpforms_ajax_submit', array($this, 'submit'));
			add_action('wp_ajax_nopriv_wpforms_ajax_submit', array($this, 'submit'));
		} // end public function __construct
		
		public function submit() {
			set_time_limit(apply_filters('wpforms/ajax-submit/time-limit', 30));
			if (!isset($_POST['wpforms']) || !isset($_POST['wpforms']['id'])) {
				echo json_encode(false);
				exit;
			}
			$this->form_id = intval($_POST['wpforms']['id']);
			add_filter('wp_redirect', array($this, 'process_complete'), 9999, 2);
			$wpforms = wpforms();
			$wpforms->process->listen();
			// this will not be called if wpforms does a redirect
			$this->process_complete(false, false);
		} // end public function submit
		
		public function process_complete($location, $status) {
			$return_data = array(
				'form_id' => $this->form_id
			);
			if ($location === false) {
				$return_data['content'] = do_shortcode('[wpforms id="'.$this->form_id.'"]');
			} else {
				$return_data['redirect_url'] = $location;
			}
			echo json_encode($return_data);
			exit;
		} // end public function process_complete
		
		public function enqueue_scripts() {
			$handle = 'wpforms-ajax-submit';
			$src = plugin_dir_url(__FILE__).'wpforms-ajax-submit.js';
			$dep = array('jquery');
			wp_register_script($handle, $src, $dep, $this->version, true);
			
			$object = 'wpforms_ajax_submit_data';
			$data = array(
				'ajaxurl' => admin_url('admin-ajax.php'),
				'disimage' => plugin_dir_url(__FILE__).'loading.gif'
			);
			wp_localize_script($handle, $object, $data);
			
			wp_enqueue_script($handle);
		} // end public function enqueue_scripts
		
	} // end class WPForms_AJAX_submit
	
?>