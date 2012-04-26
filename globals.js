// important global objects/variables

var Code = 0 ; // keypress code
var finishedCalculating = true ;

default_pocket_position = 2 ; // what pocket to originate on

var INTERFACE ;
var STATE = { 				// data necessary to restore exact state
	ActiveCharacter:-1,		// character responding to keypresses
	ThePlayer:-1,			// the true player
	CurrentTile:-1,			// the tile number the game is loaded on
	Sides:[], 				// trainer or wild pokemon on each side of interface
	ActiveInterface:1,		// the current screen displayed
	ActiveMenu:0,			// currently selected item in game menu
	ActivePocket: default_pocket_position,
							// the pocket selected
	ActiveItem:-1			// the item selected in inventory
}

var devmode = 0 ;			// temporary development mode

tick = 30 ; 				// update delay

OPTIONS = {
	Music: false,
	Netplay: false
}

Statistics = {
	playtime: 0, 			// seconds player has played
	steps: 0				// number of steps player has taken
}

// local object references
var CurrentTile ;			// current tile number
var ActiveCharacter ;		// shortcut to current character
var ActiveBattle ; 			// handles active battle
var SIDES ;					// interface for each side

character_pool = [
				  ] ;
// list of characters with registered changes

central_loop = [ // action, parameters
				] ;
seconds_loop = [
			  // action, parameters
			  ] ;

ticker = null ; // animation timer
timer = null ; // seconds timer
