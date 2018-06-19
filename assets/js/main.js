"use strict";


jQuery(document).ready(function ($) {

	$(window).load(function () {
		$(".loaded").fadeOut();
		$(".preloader").delay(1000).fadeOut("slow");
	});
    /*---------------------------------------------*
     * Mobile menu
     ---------------------------------------------*/
    $('#navbar-collapse').find('a[href*=#]:not([href=#])').click(function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: (target.offset().top - 40)
                }, 1000);
                if ($('.navbar-toggle').css('display') != 'none') {
                    $(this).parents('.container').find(".navbar-toggle").trigger("click");
                }
                return false;
            }
        }
    });
	
	
	/*---------------------------------------------*
     * For Price Table
     ---------------------------------------------*/
	 
	checkScrolling($('.cd-pricing-body'));
	$(window).on('resize', function(){
		window.requestAnimationFrame(function(){checkScrolling($('.cd-pricing-body'))});
	});
	$('.cd-pricing-body').on('scroll', function(){ 
		var selected = $(this);
		window.requestAnimationFrame(function(){checkScrolling(selected)});
	});

	function checkScrolling(tables){
		tables.each(function(){
			var table= $(this),
				totalTableWidth = parseInt(table.children('.cd-pricing-features').width()),
		 		tableViewport = parseInt(table.width());
			if( table.scrollLeft() >= totalTableWidth - tableViewport -1 ) {
				table.parent('li').addClass('is-ended');
			} else {
				table.parent('li').removeClass('is-ended');
			}
		});
	}

	//switch from monthly to annual pricing tables
	bouncy_filter($('.cd-pricing-container'));

	function bouncy_filter(container) {
		container.each(function(){
			var pricing_table = $(this);
			var filter_list_container = pricing_table.children('.cd-pricing-switcher'),
				filter_radios = filter_list_container.find('input[type="radio"]'),
				pricing_table_wrapper = pricing_table.find('.cd-pricing-wrapper');

			//store pricing table items
			var table_elements = {};
			filter_radios.each(function(){
				var filter_type = $(this).val();
				table_elements[filter_type] = pricing_table_wrapper.find('li[data-type="'+filter_type+'"]');
			});

			//detect input change event
			filter_radios.on('change', function(event){
				event.preventDefault();
				//detect which radio input item was checked
				var selected_filter = $(event.target).val();

				//give higher z-index to the pricing table items selected by the radio input
				show_selected_items(table_elements[selected_filter]);

				//rotate each cd-pricing-wrapper 
				//at the end of the animation hide the not-selected pricing tables and rotate back the .cd-pricing-wrapper
				
				if( !Modernizr.cssanimations ) {
					hide_not_selected_items(table_elements, selected_filter);
					pricing_table_wrapper.removeClass('is-switched');
				} else {
					pricing_table_wrapper.addClass('is-switched').eq(0).one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function() {		
						hide_not_selected_items(table_elements, selected_filter);
						pricing_table_wrapper.removeClass('is-switched');
						//change rotation direction if .cd-pricing-list has the .cd-bounce-invert class
						if(pricing_table.find('.cd-pricing-list').hasClass('cd-bounce-invert')) pricing_table_wrapper.toggleClass('reverse-animation');
					});
				}
			});
		});
	}
	function show_selected_items(selected_elements) {
		selected_elements.addClass('is-selected');
	}

	function hide_not_selected_items(table_containers, filter) {
		$.each(table_containers, function(key, value){
	  		if ( key != filter ) {	
				$(this).removeClass('is-visible is-selected').addClass('is-hidden');

			} else {
				$(this).addClass('is-visible').removeClass('is-hidden is-selected');
			}
		});
	}



    /*---------------------------------------------*
     * STICKY scroll
     ---------------------------------------------*/

    $.localScroll();



    /*---------------------------------------------*
     * Counter 
     ---------------------------------------------*/

//    $('.statistic-counter').counterUp({
//        delay: 10,
//        time: 2000
//    });




    /*---------------------------------------------*
     * WOW
     ---------------------------------------------*/

//        var wow = new WOW({
//            mobile: false // trigger animations on mobile devices (default is true)
//        });
//        wow.init();


    /* ---------------------------------------------------------------------
     Carousel
     ---------------------------------------------------------------------= */

//    $('.testimonials').owlCarousel({
//        responsiveClass: true,
//        autoplay: false,
//        items: 1,
//        loop: true,
//        dots: true,
//        autoplayHoverPause: true
//
//    });



// scroll Up

    $(window).scroll(function(){
        if ($(this).scrollTop() > 600) {
            $('.scrollup').fadeIn('slow');
        } else {
            $('.scrollup').fadeOut('slow');
        }
    });
    $('.scrollup').click(function(){
        $("html, body").animate({ scrollTop: 0 }, 1000);
        return false;
    });	


    //End
});


new Typed('#logo-typed', {
	stringsElement: '#logo-strings',
	typeSpeed: 100,
	cursorChar: '',
	loop: true
});

if (document.getElementById('nodejs-code-output')) {
	new Typed('#nodejs-code-output', {
		stringsElement: '#nodejs-code',
		typeSpeed: 100,
		cursorChar: '\u2588',
		loop: true
	});
	new Typed('#html-code-output', {
		stringsElement: '#html-code',
		typeSpeed: 100,
		cursorChar: '\u2588',
		loop: true
	});
}

/*var golosTest = Object.assign({}, golos);
golosTest.config.set('websocket', 'wss://ws.testnet.golos.io');
setInterval(function() {
	golos.api.getConfig(function(err, result) {
		if ( ! err) {
			document.getElementById('mainnet-version').innerHTML = result.STEEMIT_BLOCKCHAIN_VERSION;
			document.getElementById('mainnet-status').innerHTML = 'ON';
		}
	});
	golosTest.api.getConfig(function(err, result) {
		if ( ! err) {
			document.getElementById('testnet-version').innerHTML = result.STEEMIT_BLOCKCHAIN_VERSION;
			document.getElementById('testnet-status').innerHTML = 'ON';
		}
	});
}, 3000);*/

let getBlockchainVersion = function(nodeAddress, callback) {
	let socket = new WebSocket(nodeAddress);
	socket.onopen = function(event) {
		socket.send(JSON.stringify({
			jsonrpc: '2.0',
			id: 1,
			method: 'call',
			params: ['database_api', 'get_config', [0], ]
		}));
		socket.onmessage = function(raw) {
			let data = JSON.parse(raw.data);
			socket.close();
			callback(null, data.result);
		};
	};
	/*socket.onclose = function(event) {
		if (event.code != 1000) {
			console.error('onclose', event.code);
			callback(event.code, null); // 1006
		}
	};*/
	socket.onerror = function(event) {
		console.error('onerror', event);
		callback(event.code, null);
	}
};

if (WebSocket) {
	setInterval(function() {
		getBlockchainVersion('wss://ws.golos.io', function(err, result) {
			if (result) {
				document.getElementById('mainnet-version').innerHTML = result.STEEMIT_BLOCKCHAIN_VERSION;
				document.getElementById('mainnet-status').innerHTML = 'ON';
				document.getElementById('mainnet-status').className = 'label label-success';
			}
			else if (err) {
				document.getElementById('mainnet-version').innerHTML = '';
				document.getElementById('mainnet-status').innerHTML = 'OFF';
				document.getElementById('mainnet-status').className = 'label label-danger';
			}
		});
	}, 3000);
	setInterval(function() {
		getBlockchainVersion('wss://ws.testnet.golos.io', function(err, result) {
			if (result) {
				document.getElementById('testnet-version').innerHTML = result.STEEMIT_BLOCKCHAIN_VERSION;
				document.getElementById('testnet-status').innerHTML = 'ON';
				document.getElementById('testnet-status').className = 'label label-success';
			}
			else if (err) {
				document.getElementById('testnet-version').innerHTML = '';
				document.getElementById('testnet-status').innerHTML = 'OFF';
				document.getElementById('testnet-status').className = 'label label-danger';
			}
		});
	}, 3000);
}

let $vacanciesList = document.getElementById('vacancies-list');
if ($vacanciesList) {
	fetch('https://api.hh.ru/vacancies?employer_id=2834910')
		.then(function(response) {
			return response.json();
		})
		.then(function(json) {
			if (json.items) {
				console.log(json.items);
				json.items.forEach(function(row) {
					let $newRow = document.createElement('li');
					//$newRow.className = 'cd-popular';
					$newRow.innerHTML = `
						<ul class="cd-pricing-wrapper">
							<li data-type="monthly" class="is-visible">
								<header class="cd-pricing-header">
									<h2>${row.name}</h2>
									<div class="cd-price">
										<span class="cd-value">${row.salary ? `от ${row.salary.from}${row.salary.to ? ` до ${row.salary.to}` : ``} ${row.salary.currency}` : `з/п не указана`}</span>
									</div>
								</header>
								<!--<div class="cd-pricing-body">
									<ul class="cd-pricing-features">
										<li><em><i class="fa fa-check-circle"></i></em>Уверенное владение С++</li>
									</ul>
								</div>-->
								<footer class="cd-pricing-footer">
									<a class="cd-select" target="_blank" href="${row.alternate_url}">Подробнее</a>
								</footer>
							</li>
						</ul>
					`;
					$vacanciesList.appendChild($newRow);
				});
			}
		})
		.catch(alert);
}

let $bountiesList = document.getElementById('bounties-list');
if ($bountiesList) {
	fetch('https://api.github.com/repos/GolosChain/advances/issues?state=open&labels=bounty')
		.then(function(response) {
			return response.json();
		})
		.then(function(json) {
			if (json) {
				//console.log(json);
				json.forEach(function(row) {
					let $newRow = document.createElement('li');
					//$newRow.className = 'cd-popular';
					$newRow.innerHTML = `
						<ul class="cd-pricing-wrapper">
							<li data-type="monthly" class="is-visible">
								<header class="cd-pricing-header">
									<h2>${row.title}</h2>
									<!--<div class="cd-price">
										<span class="cd-value">${row.salary ? `от ${row.salary.from}${row.salary.to ? ` до ${row.salary.to}` : ``} ${row.salary.currency}` : `з/п не указана`}</span>
									</div>-->
								</header>
								<!--<div class="cd-pricing-body">
									<ul class="cd-pricing-features">
										<li><em><i class="fa fa-check-circle"></i></em>Уверенное владение С++</li>
									</ul>
								</div>-->
								<footer class="cd-pricing-footer">
									<a class="cd-select" target="_blank" href="${row.html_url}">Подробнее</a>
								</footer>
							</li>
						</ul>
					`;
					$bountiesList.appendChild($newRow);
				});
			}
		})
		.catch(alert);
}

let $appsList = document.getElementById('apps-list');
if ($appsList) {
	let markdownConverter = new showdown.Converter({ noHeaderId: true, openLinksInNewWindow: true });
	let $appModal = document.querySelector('#app-modal'),
		$appModalTitle = $appModal.querySelector('.modal-title'),
		$appModalBody = $appModal.querySelector('.modal-body'),
		$appHtml = document.querySelector('#app-html');
	fetch('https://api.github.com/repos/GolosChain/apps/contents')
		.then(function(response) {
			return response.json();
		})
		.then(function(json) {
			json.forEach(function(dir) {
				if (dir.type == 'dir') {
					//console.log(dir.name);
					fetch(dir.url)
						.then(function(response) {
							return response.json();
						})
						.then(function(files) {
							files.forEach(function(file) {
								fetch(file.url)
									.then(function(response) {
										return response.json();
									})
									.then(function(fileDetail) {
										fileDetail.content = decodeURIComponent(escape(window.atob(fileDetail.content)));
										let $newRow = document.createElement('li');
										//$newRow.className = 'cd-popular';
										let htmlContent = markdownConverter.makeHtml(fileDetail.content);
										$appHtml.innerHTML = htmlContent;
										let appTitle = $appHtml.querySelector('h1').innerHTML;
										$newRow.innerHTML = `
											<ul class="cd-pricing-wrapper">
												<li data-type="monthly" class="is-visible">
													<header class="cd-pricing-header">
														<h2>${fileDetail.name.replace('-', ' ').replace('.md', '')}</h2>
														<div class="cd-price">
															<span class="cd-value">${appTitle}</span>
														</div>
													</header>
													<!--<div class="cd-pricing-body">
														<ul class="cd-pricing-features">
															<li><em><i class="fa fa-check-circle"></i></em>Уверенное владение С++</li>
														</ul>
													</div>-->
													<footer class="cd-pricing-footer">
														<a class="cd-select" target="_blank" href="${fileDetail.html_url}">Подробнее</a>
													</footer>
												</li>
											</ul>
										`;
										$appsList.appendChild($newRow);
										$newRow.querySelector('a').addEventListener('click', (e) => {
											e.preventDefault();
											$appModalBody.innerHTML = htmlContent;
											$appModalTitle.innerHTML = appTitle;
											$appModalBody.querySelector('h1').remove();
											$('#app-modal').modal('show');
										});
									})
									.catch(console.error);
							});
						})
						.catch(console.error);
				}
			});
		})
		.catch(alert);
}