/**
 * Some deliciously procedural code
**/
$(document).ready(function() {
	// Divide by stages
	var increment = parseInt($('#status-bar').css('width')) / 17;

	// Moves progress bar relative to current position
	var progress = function() {
		$('#status-bar .progress-bar').css({
			'width': '+=' + increment
		});
	}

	// Stores results
	var saveState = function(occurrance) {
		var postsObj = {
			"desc": $('#explanation').val()
		};

		$.each($('.pep'), function(i, obj) {
			var id = $(obj).attr('id');
			var position = $(obj).position()
			var post = {
				x: parseInt(position.left),
				y: parseInt(position.top)
			}

			postsObj[id] = post;
		});

		var strung = JSON.stringify(postsObj);

		$.ajax({
			type: "POST",
			url: "save.php",
			data: { entry: strung },
			success: function (data) {
               console.log(data)
            },
            error: function (xhr, ajaxOptions, thrownError) {
            	alert(xhr.status);
            	alert(thrownError);
            }
		});
	}

	$('.pep').pep({
        shouldEase: false,
        allowDragEventPropagation: false,
        place: false,
        constrainTo: 'parent',
        start: function(e, obj) {
        	$(obj.el).appendTo('#wall');
        }
	});

	// Step 1 - Welcome Box
	$('#welcome-box .continue').click(function() {
		progress();

		$('#welcome-box').animate({
			'left': '-100%'
		}, function() {
			$(this).remove();
		});

		$('#qu').animate({
			'left': '44%'
		});

		$('#status-text').animate({
			'left': '50%'
		});

		$('#next').animate({
			'right': '20px'
		});
	});

	// Step 2 - Moving the queen
	$('#next').click(function() {
		var stage = parseInt($(this).attr('data-stage'));
		var id;
		progress();

		// Sets stage +1
		$(this).attr('data-stage', (stage + 1));

		switch (stage) {
			case 1:
				id = "mi";
				$('#status-text p').text('She looks nice and comfortable. Now here Ed Miliband, move him and make him feel at home');
				break;
			case 2:
				id = "bl";
				$('#status-text p').text("It's JB. Put him somewhere click next to proceed");
				break;
			case 3:
				id = "dx";
				$('#status-text p').text("Dorkster's Laboratory. Place him somewhere and let's move on");
				break;
			case 4:
				id = "mp";
				$('#status-text p').text("A different Perry. Move him and let's get going");
				break;
			case 5:
				id = "br";
				$('#status-text p').text("The actor and comedian, Russell Brand. Drag that guy and hit next");
				break;
			case 6:
				id = "wi";
				$('#status-text p').text("A popular author. Where will she go?");
				break;
			case 7:
				id = "ma";
				$('#status-text p').text("Running with shells is dangerous. Stick him somewhere and hit next");
				break;
			case 8:
				id = "th";
				$('#status-text p').text('Here is another well known politician. Where are you going to put her?');
				break;
			case 9:
				id = "pe";
				$('#status-text p').text("Katy Perry. Click next when you've moved her");
				break;
			case 10:
				id = "de";
				$('#status-text p').text("Do you know who this is? Hit next when you've moved him");
				break;
			case 11:
				id = "wa";
				$('#status-text p').text("Emma Watson. Put her somewhere and let us proceed.");
				break;
			case 12:
				id = "ke";
				$('#status-text p').text("A lesser known musician. Helios. Drag him ");
				break;
			case 13:
				id = "pa";
				$('#status-text p').text("The guy who plays Sheldon Cooper. Hit next when you've moved him");
				break;
			case 14:
				id = "ma";
				$('#status-text p').text("Last one. Hit next when you're done.");
				break;
			case 15:
				$('#final-box').animate({
					'left': '50%'
				});
				$('.pep').data('plugin_pep').toggle(false);
				$('#next').remove();
				$('#status-text').remove();
		}

		$('#' + id).animate({
			'left': '44%'
		}).appendTo('#wall');
	});

	$('#amendments-box .continue').click(function() {
		$('#amendments-box').animate({
			'left': '-100%'
		}, function() {
			$(this).remove();
		});
	});

	$('#final-box .continue').one('click', function() {
		saveState();
		progress();

		$(this).attr('disabled', 'disabled');
		$(this).children().text('All Done');
	});
});