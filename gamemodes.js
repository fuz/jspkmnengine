GAME_MODES = [
	function() {
	this.Name = "Demo 1" ;
	this.Description = "first demonstration of JSPKE and features" ;
	this.Author = "fuz" ;
	this.New = function() { // called upon new game
		
		Audio(0, 1) ;
		
		ClearOutput() ;
		Put( ["What is your name?", RequestData( this, this.Continue) ] );
	}
	
	this.Continue = function(Name) {
	
		ActivateCharacter( new CHARACTER({
				Name: Name,
				Sprite:0,
				Team:[],
				Items:[[13,14,15,16,17]],
				ItemQuantity:[[1,2,3,4,5]],
				Pokemons:[],
				Gender:0,
				ActivePokemon:null,
				Positioning: {
					Facing:3,
					XY:[0,0],
					Tile:0
					}
					}).Number ) ;
	STATE.ThePlayer = STATE.ActiveCharacter ;
	
	
	// teleport player to starting point
	
	EnableText() ;
	INTERFACE.SetEncounterImage(_left, Img+"sprites/items/license.gif") ;
	INTERFACE.SetEncounterImage(_right, Img+"sprites/items/rsitem98.png") ;

	Put(["Congratulations, " + Name + "! You have received your Pokemon license and are qualified to train pokemon! Let your adventure begin!"], this.Spawn) ;
	

	
	return false ;
		}

	this.Spawn = function() {
		
		
		// alert("setting character to predetermined place") ;
	SetCharacterPlace( ActiveCharacter , 0 , 1) ;
		ActiveCharacterAction() ; // interact with the mentor
		changeinterface(1) ; // go to map to player can see himself
	
			}
	}
]