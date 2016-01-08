// menu system

menu_items = [ // name, image, likely to be function to run when executed
			  ["Pokemon","/sprites/items/rsitem68.png"],
			  ["Items","/sprites/items/rsitem170.png", ShowInventory],
			  ["Pokedex","/sprites/items/rsitem296.png"],
			  ["Me", "/sprites/trainers/icons/fuz6s.gif"],
			  ["Save","/sprites/items/rsitem209.png"],
			  ["Options","/sprites/items/rsitem172.png"],
			  ["Cancel","/sprites/items/rsitem168.png", CloseMenu]
			  ] ;

function ShowMenu() {
	stop_loop() // pause the game
	
	SHOW( SIDES[_left].GameMenu ) ;
	SHOW( SIDES[_left].MenuArea ) ;
	SIDES[_left].MenuArea[_pageobj].className = "displayMenu" ;

	ACTIONS[13] = CloseMenu ;
	disable_directions(3,4,1,6) ;
	set_action_key(UseMenuOption) ;
	SelectMenu(STATE.ActiveMenu)
	set_direction_action(1, MoveMenuUp) ;
	set_direction_action(6, MoveMenuDown) ;
}

function CloseMenu() {
	HIDE( SIDES[_left].MenuArea ) ;
	HIDE( SIDES[_left].GameMenu ) ;
	SIDES[_left].MenuArea[_pageobj].className = "hiddenMenu" ;

	// ACTIONS[13] = ShowMenu ;
	remove_direction_action(MoveMenuUp) ;
	remove_direction_action(MoveMenuDown) ;
	
	enable_action( ShowMenu ) ;
	enable_directions(3,4,1,6) ;
	enable_action( ActionButton ) ;
	
	start_loop() ; // unpause the game
}

function UseMenuOption() {
	var thisOption = menu_items[ STATE.ActiveMenu ] ;

	if ( thisOption[2] ) {
		thisOption[2]() ; // run the action
	}
}

function SelectMenu(Option) {
	DeselectMenu(STATE.ActiveMenu) ; // clear previous menu selection
	STATE.ActiveMenu = Option ;
	var row = SIDES[_left].GameMenu[_pageobj].rows[Option] ;
	row.className = "selectedMenu" ;
	// need to remove the direction actions
	// do not need to since when moving, the actions can never fire
	// remove_direction_action(1) ;
}

function DeselectMenu(Option) {
	var row = SIDES[_left].GameMenu[_pageobj].rows[Option] ;
	row.className = "normalMenu" ;
}

function MoveMenuUp() {
	var Next ;
	if (STATE.ActiveMenu == 0) {
	 Next = menu_items.length-1 ;
	} else {
		Next = STATE.ActiveMenu-1 ;
	}
	SelectMenu(Next) ;
}

function MoveMenuDown() {
	var Next ;
	if ( STATE.ActiveMenu == menu_items.length-1 ) {
	 Next = 0 ;
	}
	else {
		Next = STATE.ActiveMenu+1 ;
	}
	SelectMenu(Next) ;
}


function remove_direction_action(Direction) {
	var keyCode = MovementKeys[Direction] ;
	ACTIONS[keyCode] = undefined ;
}

function set_direction_action(Direction, Action) {
	var keyCode = MovementKeys[Direction] ;
	ACTIONS[keyCode] = Action ;
}

