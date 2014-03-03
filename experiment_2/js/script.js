/**
 * Some deliciously procedural code
**/
$(document).ready(function() {
	$('#welcome-box').hide();

	var getRandomObjects = function(redditObjects, array) {
		var arr;

		// Keeps current array if passed in
		if(array) {
			arr = array;
		} else {
			arr = [];
		}

	 	// Gets random numbers based on amount size
		while(arr.length < 15){
			var randomnumber=Math.ceil(Math.random()*99);
			var thisObj = redditObjects.children[randomnumber];
			var found=false;
			for(var i=0;i<arr.length;i++){
				if(arr[i]==randomnumber) {
					found=true;
					break;
				}
			}
			// Ensures that item is from imgur
			if((thisObj.data.domain == 'imgur.com' || thisObj.data.domain == 'i.imgur.com') && !found) {
				arr[arr.length]=randomnumber;
			}
		}

		return arr;
	}

	var init = function() {
		$.getJSON( "http://www.reddit.com/r/pics/top.json?limit=200", function( data ) {
			var redditObjects = data.data;

			var arr = getRandomObjects(redditObjects);

			// Gets urls for numbers
			for(var i=0;i<15;i++) {
				var thisObj = data.data.children[arr[i]];
				var url = thisObj.data.url;
				var splitUrl = url.split('/');
				var id;

				if(thisObj.data.domain == 'imgur.com') {
					id = splitUrl[splitUrl.length - 1];

					url = 'http://i.imgur.com/' + id + '.jpg';
				} else {
					var splitId = splitUrl[splitUrl.length - 1].split('.')
					id = splitId[0];

					// Adds a file extention if it's missing
					if(splitId[1] == undefined) {
						url = url + '.jpg';
					}
				}

				// Removes item and gets a new one if anything goes wrong
				$.ajax({
					url: url,
					async:false,
					error: function() {
						arr.splice(i, 1);

						getRandomObjects(redditObjects, arr);

						i--;
					}
				})

				$('#wall').append('<img data-url="' + id + '" id="image_' + (i + 1) + '"  class="image green pep" src="' + url + '"/>')
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

			$('#welcome-box').show();
		});
		
	}
	
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
				url: $(obj).attr('data-url'),
				x: parseInt(position.left) / $('#wall').width() * 100,
				y: parseInt(position.top) / $('#wall').height() * 100
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

	// Step 1 - Welcome Box
	$('#welcome-box .continue').click(function() {
		progress();

		$('#welcome-box').animate({
			'left': '-100%'
		}, function() {
			$(this).remove();
		});

		$('#image_1').animate({
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

		if(stage == 15) {
			$('#final-box').animate({
				'left': '50%'
			});
			$('.pep').data('plugin_pep').toggle(false);
			$('#next').remove();
			$('#status-text').remove();
		}

		$('#image_' + (stage + 1)).animate({
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

	init();
});