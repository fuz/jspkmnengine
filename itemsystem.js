// draws and handles the items

GENERAL_POCKET = 0 ;
KEY_POCKET = 1 ;
TMHM_POCKET = 2 ;
BERRY_POCKET = 3 ;
BALL_POCKET = 4 ;

item_pockets = [
				["General", 13],
				["Key Items", 206],
				["TM Case", 297],
				["Berries", 105],
				["Pokeballs", 1]
				] ;

item_categories = [ // type, item number range, pocket
				   ["Pokeballs",12,		BALL_POCKET],
				   ["Recovery",38,		GENERAL_POCKET],
				   ["Flutes",43,		KEY_POCKET],
				   ["Rare Recovery",45,	GENERAL_POCKET],
				   ["Unknown",47,		GENERAL_POCKET],
				   ["Shards",51,		GENERAL_POCKET],
				   ["Drugs",60,			GENERAL_POCKET],
				   ["Battle Aids",69,	GENERAL_POCKET],
				   ["Repellants", 73,	GENERAL_POCKET],
				   ["Stones",79,		GENERAL_POCKET],
				   ["Rares",87,			GENERAL_POCKET],
				   ["Mail",99,			GENERAL_POCKET],
				   ["Berries",142,		BERRY_POCKET],
				   ["Hold Items",194,	GENERAL_POCKET],
				   ["Mission Items",223,KEY_POCKET],
				   ["TMs",273,			TMHM_POCKET],
				   ["HMs",281,			TMHM_POCKET],
				   ["Key Items",308,	KEY_POCKET]
				   ] ;
// this is used to sort items


// the order the pockets should be navigated in (when using keyboard)
default_pocket_order = [BERRY_POCKET,
						TMHM_POCKET,
						GENERAL_POCKET, // <-- default position for ease of use
						KEY_POCKET,
						BALL_POCKET] ;

function ShowInventory() {
	var original_interface = STATE.ActiveInterface ;
	stop_loop() // pause the game
	SHOW( SIDES[_left].Pockets ) ;
	CloseMenu() ; // close game menu if open
	changeinterface(6) ; // change to inventory
	SHOW( SIDES[_left].InventoryListArea ) ;
}

function EnableInventory() {
	AcceptKeys() ;
	set_direction_action( 3, MovePocketLeft ) ;
	set_direction_action( 4, MovePocketRight ) ;
	ChangePocket(STATE.ActivePocket) ;
}

function DisableInventory() {
		
}

function ChangePocket(PocketNumber) {
	DeselectPocket(STATE.ActivePocket) ;
	STATE.ActivePocket = PocketNumber ;
	SelectPocket( PocketNumber ) ;
}

function SelectPocket(PocketNumber) {
	var cell = SIDES[_left].PocketList[_pageobj].rows[0].cells[PocketNumber] ;
	cell.className = "selectedPocket" ;
	SHOW( SIDES[_left].PocketItems[ default_pocket_order[PocketNumber] ] ) ;

}

function DeselectPocket(PocketNumber) {
	var cell = SIDES[_left].PocketList[_pageobj].rows[0].cells[PocketNumber] ;
	cell.className = "normalPocket" ;
	HIDE( SIDES[_left].PocketItems[ default_pocket_order[PocketNumber] ] ) ;
}

function MovePocketLeft() {
	var Next ;
	if (STATE.ActivePocket == 0) {
		Next = item_pockets.length-1 ;	
	} else {
		Next = STATE.ActivePocket-1 ;	
	}
	ChangePocket(Next) ;
}

function MovePocketRight() {
	var Next ;
	if (STATE.ActivePocket == item_pockets.length-1) {
		Next = 0 ;	
	} else {
		Next = STATE.ActivePocket + 1 ;
	}

	ChangePocket(Next) ;
}

