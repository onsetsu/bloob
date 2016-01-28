define(['require', 'num'], function(require, num) {
    var Vector2 = require('num').Vector2;
	
	var Input = mini.Class.subclass({
		initialize: function(domElementId) {
			var that = this;
			
			this.bindings = {};
			this.actions = {};
			this.presses = {};
			this.locks = {};
			this.delayedKeyup = {};

			this.isUsingMouse = false;
			this.isUsingKeyboard = false;
			this.isUsingGamepad = false;
			this.isUsingAccelerometer = false;
			this.mouse = Vector2.Zero.copy();
			this.accel = {
				x: 0,
				y: 0,
				z: 0
			};
			this.domElementId = domElementId;
			this.domElement = document.getElementById(domElementId);

			this.supportsGamepad = 'getGamepads' in navigator;
			this.gamepadConnected = false;
			this.initGamepad();

			//helpers:
			//http://js-tut.aardon.de/js-tut/tutorial/position.html
			function getElementPosition(element) {
				var elem=element, tagname="", x=0, y=0;
				while((typeof(elem) == "object") && (typeof(elem.tagName) != "undefined")) {
					y += elem.offsetTop;
					x += elem.offsetLeft;
					tagname = elem.tagName.toUpperCase();

					if(tagname == "BODY")
						elem=0;

					if(typeof(elem) == "object") {
						if(typeof(elem.offsetParent) == "object")
							elem = elem.offsetParent;
					}
				}
				return {x: x, y: y};
			}
			
			this.canvasPosition = getElementPosition(document.getElementById(domElementId));
			
			document.addEventListener("mousedown", function(e) {
	            that.isMouseDown = true;
	            handleMouseMove(e);
	            document.addEventListener("mousemove", handleMouseMove, true);
	         }, true);
	         
	         document.addEventListener("mouseup", function() {
	            document.removeEventListener("mousemove", handleMouseMove, true);
	            that.isMouseDown = false;
	            that. x = undefined;
	            that. y = undefined;
	         }, true);

			 this._rightClickHandler = [];
			document.addEventListener('contextmenu', function(e) {
				for(var i = 0; i < that._rightClickHandler.length; i++) {
					that._rightClickHandler[i](e);
				}
			});

	         function handleMouseMove(e) {
	            that.x = (e.clientX - that.canvasPosition.x) / 30;
	            that.y = (e.clientY - that.canvasPosition.y) / 30;
	         }
		},

		onRightClick: function(callback) {
			this._rightClickHandler.push(callback);
		},
		
		initMouse: function() {
			if( this.isUsingMouse ) { return; }
			this.isUsingMouse = true;
			var mouseWheelBound = this.mousewheel.bind(this);
			this.domElement.addEventListener('mousewheel', mouseWheelBound, false );
			this.domElement.addEventListener('DOMMouseScroll', mouseWheelBound, false );
			
			this.domElement.addEventListener('contextmenu', this.contextmenu.bind(this), false );
			this.domElement.addEventListener('mousedown', this.keydown.bind(this), false );
			this.domElement.addEventListener('mouseup', this.keyup.bind(this), false );
			this.domElement.addEventListener('mousemove', this.mousemove.bind(this), false );
			
			this.domElement.addEventListener('touchstart', this.keydown.bind(this), false );
			this.domElement.addEventListener('touchend', this.keyup.bind(this), false );
			this.domElement.addEventListener('touchmove', this.mousemove.bind(this), false );
		},
		
		initKeyboard: function() {
			if( this.isUsingKeyboard ) { return; }
			this.isUsingKeyboard = true;
			window.addEventListener('keydown', this.keydown.bind(this), false );
			window.addEventListener('keyup', this.keyup.bind(this), false );
		},
		
		initAccelerometer: function() {
			if( this.isUsingAccelerometer ) { return; }
			window.addEventListener('devicemotion', this.devicemotion.bind(this), false );
		},

		initGamepad: function() {
			if( this.isUsingGamepad ) { return; }
			this.isUsingGamepad = true;

			if(this.supportsGamepad) {

				var prompt = "To begin using your gamepad, connect it and press any button!";
				$("#gamepadPrompt").text(prompt);

				$(window).on("gamepadconnected", (function() {
					$("#gamepadPrompt").html("Gamepad connected!");
					this.gamepadConnected = true;
				}).bind(this));

				$(window).on("gamepaddisconnected", (function() {
					$("#gamepadPrompt").text("Gamepad disconnected. " + prompt);
					this.gamepadConnected = false;
				}).bind(this));
			}
		},
		
		mousewheel: function(event) {
			var delta = event.wheelDelta ? event.wheelDelta : (event.detail * -1);
			var code = delta > 0 ? Input.KEY.MWHEEL_UP : Input.KEY.MWHEEL_DOWN;
			var action = this.bindings[code];
			if( action ) {
				this.actions[action] = true;
				this.presses[action] = true;
				this.delayedKeyup[action] = true;
				event.stopPropagation();
				event.preventDefault();
			}
		},
		
		mousemove: function(event) {
			var el = this.domElement;
			var pos = {left: 0, top: 0};
			while( el !== null ) {
				pos.left += el.offsetLeft;
				pos.top += el.offsetTop;
				el = el.offsetParent;
			}
			var tx = event.pageX;
			var ty = event.pageY;
			if( event.touches ) {
				tx = event.touches[0].clientX;
				ty = event.touches[0].clientY;
			}
			
			this.mouse.setXY(tx - pos.left, ty - pos.top);
		},
		
		contextmenu: function(event) {
			if( this.bindings[Input.KEY.MOUSE2] ) {
				event.stopPropagation();
				event.preventDefault();
			}
		},
		
		keydown: function(event) {
			if( event.target.type == 'text' ) { return; }
			
			var code = event.type == 'keydown' ?
				event.keyCode :
				(event.button == 2 ? Input.KEY.MOUSE2 : Input.KEY.MOUSE1);
			
			if( event.type == 'touchstart' || event.type == 'mousedown' ) {
				this.mousemove( event );
			}
				
			var action = this.bindings[code];
			if( action ) {
				this.actions[action] = true;
				if( !this.locks[action] ) {
					this.presses[action] = true;
					this.locks[action] = true;
				}
				event.stopPropagation();
				event.preventDefault();
			}
		},
		
		keyup: function(event) {
			if( event.target.type == 'text' ) { return; }
			
			var code = event.type == 'keyup' ?
				event.keyCode :
				(event.button == 2 ? Input.KEY.MOUSE2 : Input.KEY.MOUSE1);
			
			var action = this.bindings[code];
			if( action ) {
				this.delayedKeyup[action] = true;
				event.stopPropagation();
				event.preventDefault();
			}
		},
		
		devicemotion: function(event) {
			this.accel = event.accelerationIncludingGravity;
		},
		
		bind: function(key, action) {
			if( key < 0 ) { this.initMouse(); }
			else if( key > 0 ) { this.initKeyboard(); }
			this.bindings[key] = action;
		},
		
		bindTouch: function(selector, action) {
			var element = ig.$( selector );
			
			var that = this;
			element.addEventListener('touchstart', function(ev) {
				that.touchStart( ev, action );
			}, false);
			
			element.addEventListener('touchend', function(ev) {
				that.touchEnd( ev, action );
			}, false);
		},
		
		unbind: function(key) {
			var action = this.bindings[key];
			this.delayedKeyup[action] = true;
			
			this.bindings[key] = null;
		},
		
		unbindAll: function() {
			this.bindings = {};
			this.actions = {};
			this.presses = {};
			this.locks = {};
			this.delayedKeyup = {};
		},

		// access key states
		state: function(action) {
			return this.actions[action];
		},
		
		pressed: function(action) {
			return this.presses[action];
		},
		
		released: function(action) {
			return this.delayedKeyup[action];
		},
		
		clearPressed: function() {
			for( var action in this.delayedKeyup ) {
				if(!this.delayedKeyup.hasOwnProperty(action)) continue;

				this.actions[action] = false;
				this.locks[action] = false;
			}
			this.delayedKeyup = {};
			this.presses = {};
		},
		
		touchStart: function(event, action) {
			this.actions[action] = true;
			this.presses[action] = true;
			
			event.stopPropagation();
			event.preventDefault();
			return false;
		},
		
		touchEnd: function(event, action) {
			this.delayedKeyup[action] = true;
			event.stopPropagation();
			event.preventDefault();
			return false;
		},

		update: function() {
			this.updateGamepad();
			this.updateTool();
		},

		updateGamepad: function() {
			if(this.isUsingGamepad && this.supportsGamepad) {
				if(this.gamepadConnected) {
					this.reportOnGamepad();
				} else {
					this.checkForGamepad();
				}
			}
		},

		//polling for gamepad in Chrome
		checkForGamepad: function() {
			if(navigator.getGamepads()[0]) {
				if(!this.gamepadConnected) {
					$(window).trigger("gamepadconnected");
				}
			}
		},

		reportOnGamepad: function() {
			var gp = navigator.getGamepads()[0];
			var html = "";
			html += "id: "+gp.id+"<br/>";

			for(var i=0;i<gp.buttons.length;i++) {
				html+= "Button "+(i+1)+": ";
				if(gp.buttons[i].pressed) html+= " pressed";
				html+= "<br/>";
			}

			for(var i=0;i<gp.axes.length; i+=2) {
				html+= "Stick "+(Math.ceil(i/2)+1)+": "+gp.axes[i]+","+gp.axes[i+1]+"<br/>";
			}

			$("#gamepadDisplay").html(html);
		},

		updateTool: function() {
			if(this.tool)
				this.tool.update();
		}
	});

	Input.KEY = {
		'MOUSE1': -1,
		'MOUSE2': -3,
		'MWHEEL_UP': -4,
		'MWHEEL_DOWN': -5,
		
		'BACKSPACE': 8,
		'TAB': 9,
		'ENTER': 13,
		'PAUSE': 19,
		'CAPS': 20,
		'ESC': 27,
		'SPACE': 32,
		'PAGE_UP': 33,
		'PAGE_DOWN': 34,
		'END': 35,
		'HOME': 36,
		'LEFT_ARROW': 37,
		'UP_ARROW': 38,
		'RIGHT_ARROW': 39,
		'DOWN_ARROW': 40,
		'INSERT': 45,
		'DELETE': 46,
		'_0': 48,
		'_1': 49,
		'_2': 50,
		'_3': 51,
		'_4': 52,
		'_5': 53,
		'_6': 54,
		'_7': 55,
		'_8': 56,
		'_9': 57,
		'A': 65,
		'B': 66,
		'C': 67,
		'D': 68,
		'E': 69,
		'F': 70,
		'G': 71,
		'H': 72,
		'I': 73,
		'J': 74,
		'K': 75,
		'L': 76,
		'M': 77,
		'N': 78,
		'O': 79,
		'P': 80,
		'Q': 81,
		'R': 82,
		'S': 83,
		'T': 84,
		'U': 85,
		'V': 86,
		'W': 87,
		'X': 88,
		'Y': 89,
		'Z': 90,
		'NUMPAD_0': 96,
		'NUMPAD_1': 97,
		'NUMPAD_2': 98,
		'NUMPAD_3': 99,
		'NUMPAD_4': 100,
		'NUMPAD_5': 101,
		'NUMPAD_6': 102,
		'NUMPAD_7': 103,
		'NUMPAD_8': 104,
		'NUMPAD_9': 105,
		'MULTIPLY': 106,
		'ADD': 107,
		'SUBSTRACT': 109,
		'DECIMAL': 110,
		'DIVIDE': 111,
		'F1': 112,
		'F2': 113,
		'F3': 114,
		'F4': 115,
		'F5': 116,
		'F6': 117,
		'F7': 118,
		'F8': 119,
		'F9': 120,
		'F10': 121,
		'F11': 122,
		'F12': 123,
		'SHIFT': 16,
		'CTRL': 17,
		'ALT': 18,
		'PLUS': 187,
		'COMMA': 188,
		'MINUS': 189,
		'PERIOD': 190
	};

	var inputGamepadKeyOffset = 200;
	Input.GAMEPAD_KEY = {
		BUTTON_1: inputGamepadKeyOffset,
		BUTTON_2: inputGamepadKeyOffset + 1,
		BUTTON_3: inputGamepadKeyOffset + 2,
		BUTTON_4: inputGamepadKeyOffset + 3,
		BUTTON_5: inputGamepadKeyOffset + 4,
		BUTTON_6: inputGamepadKeyOffset + 5,
		BUTTON_7: inputGamepadKeyOffset + 6,
		BUTTON_8: inputGamepadKeyOffset + 7,
		BUTTON_9: inputGamepadKeyOffset + 8,
		BUTTON_10: inputGamepadKeyOffset + 9,
		BUTTON_11: inputGamepadKeyOffset + 10,
		BUTTON_12: inputGamepadKeyOffset + 11,
		BUTTON_13: inputGamepadKeyOffset + 12,
		BUTTON_14: inputGamepadKeyOffset + 13,
		BUTTON_15: inputGamepadKeyOffset + 14,
		BUTTON_16: inputGamepadKeyOffset + 15
	};

	return Input;
});
