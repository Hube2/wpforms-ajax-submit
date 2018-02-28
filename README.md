# wpforms-ajax-submit

AJAX submission for WPForms
(This is an add on for WPForms https://wordpress.org/plugins/wpforms-lite/ or http://wpforms.com/)

Install like any other plugin

If you want to get updates install https://github.com/afragen/github-updater

To enable AJAX form submission for a form add the class "wpforms-ajax-submit"
to the form settings of that form.

This plugin will enable AJAX form submission only when the browser supports the FormData object.
Most modern browswers do support FormData, however, older browsers do not and mobile devices
may or may not support this feature.

***Browsers not supporting this feature will revert to the standard WPForms submission process and will not use AJAX.***

**As far as I can tell, using the FormData object allows all field types and all WPForms features to
work as they're supposed to. If you find something that does not work please let me know in the issues.**


### using with modal forms

In the case of browsers that do not support FormData and you're putting the form in a modal you can
force the reopening of the modal window after the form is submitted. This is done by adding an extra
attibute to the element that triggers the modal to open. For example, in bootstrap the trigger looks
something like this:
```
<a href="#" data-toggle="modal" data-target="#myModal">Open Modal</a>
```
After normal submission, WP forms will add a hash to the URL and it will look something like this:
```
http://www.mysite.com/#wpforms-8
```
We can force the modal to open back up by adding this hash value to a new data attibute
of the trigger element like this:
```
<a href="#" data-toggle="modal" data-target="#myModal" data-trigger="#wpforms-8">Open Modal</a>
```
This will cause this plugin to trigger the "click" action of this link.

The default action is "click". If necessary you can also cause a different action to be triggerd.
I don't know what under conditions this would be needed, but if you need a different action triggered
then add the following attibute to your trigger element.
```
 data-trigger-action="some-javascirpt-action-here"
```
#### ajax time limit
The time limit for ajax requests is 30 seconds. To change:
```
add_filter('wpforms/ajax-submit/time-limit', 'change_wpforms_ajax_submit_time_limit');
function change_wpforms_ajax_submit_time_limit($limit) {
  $limit = 45; // php time limit in seconds
	return $limit;
}
```
