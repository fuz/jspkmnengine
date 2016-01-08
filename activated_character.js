// logic for character controlled by a player

function PlayableCharacter() {
	this.Talk = aTalk ;
	this.Interact = aInteract ;
}

function ListenTo(Character) {
	// causes player to face talker
	this.Sprite.SetDirection( /*Their.Sprite.What,*/ Positions[Character.Data.Positioning.Facing][2] ) ;
}

function aTalk(Their) {
		EnableText() ;
		// INTERFACE.SetEncounterImage(_left, TrainerImage(Their.Data.Sprite) ) ;
		
		Their.Listen(this) ;
		// Their.Sprite.SetDirection( /*Their.Sprite.What,*/ Positions[this.Data.Positioning.Facing][2] ) ;
		// make them face me
		
		Their.Talk( this ) ;
		
		// Put( ["Speaking to",Their.Data.Name] ) ;
}

function aInteract(TileNumber) {
	var InfrontObject = GetTileObject(TileNumber) ;
	if (TileEvents[TileNumber] ) {
		var TileEvent = new TileEvents[TileNumber](InfrontObject) ;
		// create an instance of the tile infront
		
		InvokeTile(TileEvent, this.CharacterNumber , InfrontObject) ;
		delete TileEvent ;
	}
}
