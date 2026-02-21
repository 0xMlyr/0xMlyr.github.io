/*
	Dimension by HTML5 UP - jQuery removed, vanilla JS version
*/

(function() {

	var	body = document.body,
		wrapper = document.getElementById('wrapper'),
		header = document.getElementById('header'),
		footer = document.getElementById('footer'),
		main = document.getElementById('main'),
		main_articles = Array.from(main.querySelectorAll('article'));

	// Helper functions
	function hide(el) { el.style.display = 'none'; }
	function show(el) { el.style.display = ''; }

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		window.addEventListener('load', function() {
			window.setTimeout(function() {
				body.classList.remove('is-preload');
			}, 100);
		});

	// Fix: Flexbox min-height bug on IE.
		if (browser.name == 'ie') {
			var flexboxFixTimeoutId;
			var flexboxFix = function() {
				clearTimeout(flexboxFixTimeoutId);
				flexboxFixTimeoutId = setTimeout(function() {
					if (wrapper.scrollHeight > window.innerHeight)
						wrapper.style.height = 'auto';
					else
						wrapper.style.height = '100vh';
				}, 250);
			};
			window.addEventListener('resize', flexboxFix);
			flexboxFix();
		}

	// Nav.
		var navs = header.querySelectorAll('nav');
		navs.forEach(function(nav) {
			var nav_li = Array.from(nav.querySelectorAll('li'));
			if (nav_li.length % 2 == 0) {
				nav.classList.add('use-middle');
				if (nav_li[2]) nav_li[2].classList.add('is-middle');
				var midIndex = (nav_li.length - 4) / 2 + 4;
				if (nav_li[midIndex]) nav_li[midIndex].classList.add('is-middle');
			}
		});

	// Main.
		var	delay = 325,
			locked = false;

		main._show = function(id, initial) {
			var article = document.getElementById(id);
			if (!article) return;

			if (locked || (typeof initial != 'undefined' && initial === true)) {
				body.classList.add('is-switching');
				body.classList.add('is-article-visible');
				main_articles.forEach(function(a) { a.classList.remove('active'); });
				hide(header);
				hide(footer);
				show(main);
				show(article);
				article.classList.add('active');
				setTimeout(function() {
					locked = false;
					body.classList.remove('is-switching');
				}, (initial ? 1000 : 0));
				return;
			}

			locked = true;

			if (body.classList.contains('is-article-visible')) {
				var currentArticle = main.querySelector('article.active');
				currentArticle.classList.remove('active');
				setTimeout(function() {
					hide(currentArticle);
					show(article);
					setTimeout(function() {
						article.classList.add('active');
						window.scrollTo(0, 0);
						setTimeout(function() {
							locked = false;
						}, delay);
					}, 25);
				}, delay);
			} else {
				body.classList.add('is-article-visible');
				setTimeout(function() {
					hide(header);
					hide(footer);
					show(main);
					show(article);
					setTimeout(function() {
						article.classList.add('active');
						window.scrollTo(0, 0);
						setTimeout(function() {
							locked = false;
						}, delay);
					}, 25);
				}, delay);
			}
		};

		main._hide = function(addState) {
			var article = main.querySelector('article.active');
			if (!body.classList.contains('is-article-visible')) return;

			if (typeof addState != 'undefined' && addState === true)
				history.pushState(null, null, '#');

			if (locked) {
				body.classList.add('is-switching');
				article.classList.remove('active');
				hide(article);
				hide(main);
				show(footer);
				show(header);
				body.classList.remove('is-article-visible');
				locked = false;
				body.classList.remove('is-switching');
				window.scrollTo(0, 0);
				return;
			}

			locked = true;
			article.classList.remove('active');
			setTimeout(function() {
				hide(article);
				hide(main);
				show(footer);
				show(header);
				setTimeout(function() {
					body.classList.remove('is-article-visible');
					window.scrollTo(0, 0);
					setTimeout(function() {
						locked = false;
					}, delay);
				}, 25);
			}, delay);
		};

	// Articles.
		main_articles.forEach(function(article) {
			var closeDiv = document.createElement('div');
			closeDiv.className = 'close';
			closeDiv.textContent = 'Close';
			closeDiv.addEventListener('click', function() {
				location.hash = '';
			});
			article.appendChild(closeDiv);

			article.addEventListener('click', function(event) {
				event.stopPropagation();
			});
		});

	// Events.
		body.addEventListener('click', function(event) {
			if (body.classList.contains('is-article-visible'))
				main._hide(true);
		});

		window.addEventListener('keyup', function(event) {
			if (event.keyCode === 27) {
				if (body.classList.contains('is-article-visible'))
					main._hide(true);
			}
		});

		window.addEventListener('hashchange', function(event) {
			if (location.hash == '' || location.hash == '#') {
				event.preventDefault();
				event.stopPropagation();
				main._hide();
			} else if (document.querySelector(location.hash)) {
				event.preventDefault();
				event.stopPropagation();
				main._show(location.hash.substr(1));
			}
		});

	// Scroll restoration.
		if ('scrollRestoration' in history) {
			history.scrollRestoration = 'manual';
		} else {
			var	oldScrollPos = 0, scrollPos = 0;
			window.addEventListener('scroll', function() {
				oldScrollPos = scrollPos;
				scrollPos = window.pageYOffset;
			});
			window.addEventListener('hashchange', function() {
				window.scrollTo(0, oldScrollPos);
			});
		}

	// Initialize.
		hide(main);
		main_articles.forEach(function(a) { hide(a); });

		if (location.hash != '' && location.hash != '#')
			window.addEventListener('load', function() {
				main._show(location.hash.substr(1), true);
			});

})();
