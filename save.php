<?php
	// Writes new file with submitted contents
	if(isset($_POST['entry']) && !empty($_POST['entry'])) {
	    $entry = $_POST['entry'];

		$filename = uniqid();

		$handle = fopen('./results/' . $filename, 'w');

		fwrite($handle, stripslashes($entry));
	}

?>