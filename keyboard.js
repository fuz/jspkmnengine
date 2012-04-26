// %&'( = left, up, right, down
// add toggle functionality
Key = new Array() ;
Key["W"] = 1 ; //  up
Key["A"] = 3 ; // left
Key["S"] = 6 ; // down
Key["D"] = 4 ; // right

MovementKeys = [] ;
ActionKeys = {} ;

Key["¾"] = ActionButton ; // full stop --> ].[
Key["."] = ActionButton // for opera

Key["Ý"] = ShowMenu ; // the ] button
Key["]"] = ShowMenu ; // for opera

Key[13] = ShowMenu ; // enter

KEYS = new Array() ;
ACTIONS = new Array() ;

// ACTIONS[13] = ShowMenu ;

function disable_directions() {
	for (var cur_dir = 0 ; cur_dir < arguments.length ; cur_dir++) {
		delete KEYS[ MovementKeys[ arguments[cur_dir] ] ] ;	
	}
}

function enable_directions() {
	for (var cur_dir = 0 ; cur_dir < arguments.length ; cur_dir++) {
		var direction = arguments[cur_dir] ;
		var keyCode = MovementKeys[ direction ] ;
		KEYS[keyCode] = direction ;
	}
}

function disable_action(Action) {
	var keyCodes = ActionKeys[Action] ;
	for (var cur_code = 0 ; cur_code < keyCodes.length ; cur_code++) {
		var keyCode = keyCodes[cur_code] ;
		delete ACTIONS[ keyCode ] ;
	}
}

function set_action_key( NewAction ) {
	var keyCodes = ActionKeys[ ActionButton ] ;
	for (var cur_code = 0 ; cur_code < keyCodes.length ; cur_code++) {
		var keyCode = keyCodes[cur_code] ;
		ACTIONS[ keyCode ] = NewAction ; // reassigns the button to do something else
	}
}

function enable_action(Action) {
	var keyCodes = ActionKeys[Action] ;
	for (var cur_code = 0 ; cur_code < keyCodes.length ; cur_code++) {
		var keyCode = keyCodes[cur_code] ;
		ACTIONS[keyCode] = Action ;
	}
}

for (var cur_code = 0 ; cur_code < Key.length ; cur_code++) {
	  var keyData = Key[ cur_code ] ;
	  if (typeof keyData == "function") {
		ACTIONS[ cur_code ] = keyData ;  
		ActionKeys[keyData] = [ cur_code ] ;
	  }	
}

for (KEY_STRING in Key) { // generate key codes
	if ( (typeof Key[KEY_STRING]) == "number") {			// direction keys
	 var keyCode = KEY_STRING.charCodeAt(0) ;
	 var direction = Key[KEY_STRING] ;
	 KEYS[ keyCode ] = direction ; 
	 MovementKeys[direction] = keyCode ;
	}
	else if (KEY_STRING.length == 1) {						// action keys
	var Action = Key[KEY_STRING] ;
	var keyCode = KEY_STRING.charCodeAt(0) ;
	ACTIONS[ keyCode ] = Action ;
	if ( ActionKeys[Action] ) { // is already multiple actions assigned
		ActionKeys[Action].push(keyCode) ;
	} else ActionKeys[Action] = [ keyCode ] ;
	}
}
disable_action( ShowMenu ) ;
