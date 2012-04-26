/* dumps all data of the game so it can be reloaded
this means:
 - character's list
 - statistics
 - current confrontation
 - state the player
*/

SEPARATOR = "####" ;

function SAVE() {
	// saves the current state
	var DUMP = new Array() ;
	DUMP[0] = STATE ;

	DUMP[1] = new Array() ;
		 
	for (var CurChar=0 ; CurChar < character_pool.length ; CurChar++) {
		DUMP[1][CurChar] = character_pool[CurChar].Data ;
	}
	
	DUMP[2] = Statistics ;
	
	MapText.value = DUMP.toJSONString() ;
}

function docString() {
var time = new Date() ;
var doc =	"/*#########################\nJSPKE Version: " + JSPKE.Version + "\nProduced: " +
			time + "\n*/#########################" ;
			return doc ;
}

function LOAD(Input) {
	RemoveActive() ;
	
	for (var each_character = 0 ; each_character < character_pool.length ; each_character++) {
		character_pool[each_character].Dispose() ; // remove the sprite
	}
	character_pool = [] ;
	
	hideI(STATE.ActiveInterface) ;
	
	DUMP = Input.parseJSON() ;
	
	STATE = DUMP[0] ;
	
	for (var CurChar = 0 ; CurChar < DUMP[1].length ; CurChar++) {
	// recreate objects
		var Chara = new CHARACTER( DUMP[1][CurChar] ) ;
		Chara.Sprite.Render() ;
	}
	
	ActivateTile(STATE.CurrentTile) ;
	ActivateCharacter(STATE.ActiveCharacter) ;
	changeinterface(STATE.ActiveInterface) ;
}
