/**
 * Code for getting results
**/
$(document).ready(function() {
	var getResult = function(type, resultInt) {
		var results;

		$.ajax({
			type: "GET",
			url: "functions.php",
			async: false,
			data: {
				request: type,
				value: resultInt
			},
			success: function(data) {
				results = data;
			} 
		});
		return results;
	};

	var processResults = function(Results) {
		var objects = {
			bl : {left: [], top:[]},
			br : {left: [], top:[]},
			de : {left: [], top:[]},
			bl : {left: [], top:[]},
			br : {left: [], top:[]},
			de : {left: [], top:[]},
			dx : {left: [], top:[]},
			ke : {left: [], top:[]},
			ma : {left: [], top:[]},
			mi : {left: [], top:[]},
			mp : {left: [], top:[]},
			pa : {left: [], top:[]},
			pe : {left: [], top:[]},
			qu : {left: [], top:[]},
			th : {left: [], top:[]},
			wa : {left: [], top:[]},
			wi : {left: [], top:[]}
		}

		$.each(Results, function(i, Result) {
			var Result = JSON.parse(Result);

			delete Result['desc'];

			$.each(Result, function(j, ObjPiece) {
				objects[j].left.push(ObjPiece.x);
				objects[j].top.push(ObjPiece.y);
			});
		});

		$.each(objects, function(i, obj) {
			var lsum = tsum = 0;
			for(var i = 0; i < obj.left.length; i++){
			    lsum += parseInt(obj.left[i]);
			    tsum += parseInt(obj.top[i]);
			}

			var lavg = lsum/obj.left.length;
			var tavg = tsum/obj.top.length;

			obj.left = lavg;
			obj.top = tavg;
		});

		drawResults(objects);
	};

	var drawResults = function(Objects) {
		$.each(Objects, function(i, obj) {
			$(window[i]).css({
				left: obj.left,
				top: obj.top
			});
		});
	}

	var setCurrentResult = function(amount) {
		$('#currentResult').val(amount);
	};

	var setResultAmount = function() {
		var amount = getResult('resultAmount');

		console.log(amount)

		$('#resultAmount').val(amount);
	};

	var getAllResults = function() {
		return getResult('average');
	};

	// Gets one random result
	$('#random').click(function() {
		var result = getResult('singleRandom');
		// Splits result into result number and result contents
		var json = JSON.parse(result);

		// Gets result number, which is the value given plus 1
		var amount = parseInt(json[0]) + 1;

		// Sends result contents to be processed
		// Adds result to array, so the processing function can handle it
		processResults([json[1]]);

		// Show description

		// Sets which result we're currently on
		setCurrentResult(amount);
	});

	$('#average').click(function() {
		var Results = getAllResults();

		// Splits result into result number and result contents
		var json = JSON.parse(Results);

		processResults(json)
	});

	$('#currentResult').change(function() {
		var val = $(this).val();
		if(val > $('#resultAmount').val()) {
			$(this).val($('#resultAmount').val());
		} else if (val < 1) {
			$(this).val(1);
		}

		var result = getResult('specific', $(this).val() - 1);

		processResults([result]);

	});

	setResultAmount();
});