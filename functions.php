<?php

	$dir = './results';
	$files = glob($dir . '/*');

	function getRandomResult() {
		global $files;

	    $file = array_rand($files);

	    $array = array($file, file_get_contents($files[$file]));

	    return $array;
	};

	function getResult($result) {
		global $files;

	    return file_get_contents($files[$result]);
	};

	function getRandomResults($int) {
		global $files;

		$array = array();

		// If int is bigger than amount of files, set int to amount of files
		if(sizeof($files) < $int) {
			$int = sizeof($files);
		}

		for($i = 0; $i < $int; $i++) {
			$file = getRandomResult();
			if(in_array($file, $array)) {
				$i--;
			} else {
				array_push($array, $file);
			}
		}

		return $array;
	};

	function getAllResults() {
		global $files;

		$array = array();

		$int = sizeof($files);

		for($i = 0; $i < $int; $i++) {
			$file = getResult($i);

			array_push($array, $file);
		}

		return $array;
	};

	function getAmountOfResults() {
		global $files;

		return sizeof($files);
	};

	if($_GET['request'] == 'singleRandom') {
		echo json_encode(getRandomResult());
		exit;
	};

	if($_GET['request'] == 'resultAmount') {
		echo getAmountOfResults();
		exit;
	};

	if($_GET['request'] == 'specific') {
		echo getResult($_GET['value']);
		exit;
	};

	if($_GET['request'] == 'average') {
		echo json_encode(getAllResults());
		exit;
	};
?>