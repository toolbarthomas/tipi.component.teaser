function setTeaser() {
	var teaserElements = {
		root 			: 'teaser',
		introduction 	: 'teaser-introduction',
		main 			: 'teaser-main',
		mainWrapper 	: 'teaser-main-wrapper',
		actions 		: 'teaser-actions',
		action 			: 'teaser-action',
		actionOpen 		: 'teaser-action--open',
		actionClose 	: 'teaser-action--close'
	};

	var teaserStates = {
		ready 	: '__teaser--ready',
		active 	: '__teaser--active'
	};

	var teaser = $('.' + teaserElements.root).not('.' + teaserElements.ready);
	if(teaser.length > 0) {
		teaser.each(function() {
			var teaser = $(this);
			var teaserIntroduction = getTeaserElement(teaser, 'introduction', teaserElements);
			var teaserMain = getTeaserElement(teaser, 'main', teaserElements);
			var teaserMainWrapper = getTeaserElement(teaser, 'mainWrapper', teaserElements);
			var teaserActions = getTeaserElement(teaser, 'actions', teaserElements);
			var teaserAction = getTeaserElement(teaser, 'action', teaserElements);

			//Activate teaser if the height of the main content is higher then the introduction
			var teaserIntroduction_height = teaserIntroduction.outerHeight();
			var teaserMainWrapper_height = teaserMainWrapper.outerHeight();

			if(teaserIntroduction_height <= teaserMainWrapper_height ) {
				teaser.addClass(teaserStates.ready);
			} else {
				teaser.removeClass(teaserStates.ready + ' ' +  teaserStates.active);
			}

			teaser.on({
				'tipi.teaser.open' : function(event) {
					openTeaser($(this), teaserStates);
				},
				'tipi.teaser.close' : function(event) {
					closeTeaser($(this), teaserStates);
				},
				'tipi.teaser.toggleActions' : function(event) {
					hideTeaserAction($(this), teaserElements, teaserStates);
				},
				'tipi.teaser.resize' : function(event) {
					resizeTeaser($(this), teaserElements, teaserStates);
				}
			});

			teaserAction.on({
				click : function(event) {
					event.preventDefault();
					var teaserAction = $(this);
					var teaser = getTeaserElement(teaserAction, 'root', teaserElements);


					if(teaserAction.hasClass(teaserElements.actionOpen)) {
						teaser.trigger('tipi.teaser.open');
					} else if(teaserAction.hasClass(teaserElements.actionClose)) {
						teaser.trigger('tipi.teaser.close');
					} else {
						if(teaser.hasClass(teaserStates.active)) {
							teaser.trigger('tipi.teaser.close');
						} else {
							teaser.trigger('tipi.teaser.open');
						}
					}

					teaser.trigger('tipi.teaser.toggleActions');
					teaser.trigger('tipi.teaser.resize');
				}
			});

			teaser.trigger('tipi.teaser.toggleActions');
			teaser.trigger('tipi.teaser.resize');
		});

		var updateEvent;
		$(window).on({
			resize : function() {
				clearTimeout(updateEvent);
				updateEvent = setTimeout(function() {
					teaser.trigger('tipi.teaser.resize');
				}, 100);

			}
		});
	}
}

function openTeaser(teaser, teaserStates) {
	teaser.addClass(teaserStates.active);
}

function closeTeaser(teaser, teaserStates) {
	teaser.removeClass(teaserStates.active);
}

function hideTeaserAction(teaser, teaserElements, teaserStates) {
	var teaserActionOpen = getTeaserElement(teaser, 'actionOpen', teaserElements);
	var teaserActionClose = getTeaserElement(teaser, 'actionClose', teaserElements);

	if(teaser.hasClass(teaserStates.active)) {
		teaserActionOpen.css({
			'display' : 'none'
		});

		teaserActionClose.css({
			'display' : ''
		});
	} else {
		teaserActionOpen.css({
			'display' : ''
		});
		teaserActionClose.css({
			'display' : 'none'
		});
	}
}

function resizeTeaser(teaser, teaserElements, teaserStates) {
	var teaserIntroduction = getTeaserElement(teaser, 'introduction', teaserElements);
	var teaserMain = getTeaserElement(teaser, 'main', teaserElements);
	var teaserMainWrapper = getTeaserElement(teaser, 'mainWrapper', teaserElements);

	if(teaserIntroduction.length > 0 && teaserMain.length > 0 && teaserMainWrapper.length > 0) {
		var teaserIntroduction_height = teaserIntroduction.outerHeight();
		var teaserMain_Height = '';
		var teaserMainWrapper_height = teaserMainWrapper.outerHeight();

		if(teaser.hasClass(teaserStates.active)) {
			teaserMain_Height = teaserMainWrapper_height;
		} else {
			if(teaserIntroduction_height > teaserMainWrapper_height / 2) {
				teaserMain_Height = teaserMainWrapper_height / 2;
			} else {
				teaserMain_Height = teaserIntroduction_height;
			}
		}

		teaserMain.css({
			'height' : teaserMain_Height
		});
	}
}

function getTeaserElement(origin, teaserElement, teaserElements) {
	if(typeof origin != 'undefined' && typeof teaserElement != 'undefined') {
		var element;

		switch(teaserElement) {
			case 'root':
				element = origin.parents('.' + teaserElements.root).first();
			break;
			case 'introduction':
				element = origin.find('.' + teaserElements.introduction).first();
			break;
			case 'main':
				element = origin.find('.' + teaserElements.main).first();
			break;
			case 'mainWrapper':
				element = origin.find('.' + teaserElements.mainWrapper).first();
			break;
			case 'actions':
				element = origin.find('.' + teaserElements.actions);
			break;
			case 'action':
				element = origin.find('.' + teaserElements.action);
			break;
			case 'actionOpen':
				element = origin.find('.' + teaserElements.action).filter('.' + teaserElements.actionOpen);
			break;
			case 'actionClose':
				element = origin.find('.' + teaserElements.action).filter('.' + teaserElements.actionClose);
			break;
			default:
				element = undefined;
		}

		return element;
	}
}