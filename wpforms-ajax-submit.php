<?php 

	/*
		Plugin Name: WPForms AJAX Submit
		Plugin URI: https://github.com/Hube2/wpforms-ajax-submit
		GitHub Plugin URI: https://github.com/Hube2/wpforms-ajax-submit
		Description: AJAX Submission for WPForms
		Version: 1.2.4
		Author: John A. Huebner II
		Author URI: https://github.com/Hube2
	*/
	
	// If this file is called directly, abort.
	if (!defined('WPINC')) {die;}
	
	new WPForms_AJAX_submit();
	
	class WPForms_AJAX_submit {
		
		private $version = '1.2.4';
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
			
			// filer for 3rd party filering of form submission
			// allows passing the form ID value to something else
			do_action('wpforms/ajax-submit/form-submitted', $this->form_id);
			
			// wpforms function that causes processing of the form
			// this is added to the 'wp; hook by wp forms
			// in the file wpforms/include/class-process.php
			// 'wp' hook is not run/called during AJAX request
			// ***this will need to be watched for any changes by wpforms
			$wpforms = wpforms();
			$wpforms->process->listen();
			
			// if the form is set to redirect after submission
			// we won't get here we, call the function directly
			$this->process_complete(false, false);
		} // end public function submit
		
		public function process_complete($location, $status) {
			// this function will run on the wp_redirect
			// if wp forms attempts to redirect
			// and is called directly it dows not
			$return_data = array(
				'form_id' => $this->form_id
			);
			if ($location === false) {
				// wpforms is not doing a redirect
				// we need to do what it would nomally be done
				// after a successful form submit
				$return_data['content'] = do_shortcode('[wpforms id="'.$this->form_id.'"]');
			} else {
				// wpforms is doing a redirect, set the url to load
				$return_data['redirect_url'] = $location;
			}
			
			// third party action before returning data
			do_action('wpforms/ajax-submit/process-complete', $return_data);
			
			// output json and exit
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
				'parent_positioning' => 'relative',
				'overlay_positioning' => 'absolute',
				'overlay_bg_color' => 'rgba(0,0,0,0.25)',
				'overlay_z_index' => '9999',
				'loading_image' => plugin_dir_url(__FILE__).'loading.gif',
				'loading_image_position' => 'left bottom',
				'loading_image_size' => 'auto',
				'loading_image_repeat' => 'no-repeat'
			);
			$data = apply_filters('wpforms/ajax-submit/js-data', $data);
			
			$data['ajaxurl'] = admin_url('admin-ajax.php');
			
			wp_localize_script($handle, $object, $data);
			
			wp_enqueue_script($handle);
		} // end public function enqueue_scripts
		
	} // end class WPForms_AJAX_submit
	
?>