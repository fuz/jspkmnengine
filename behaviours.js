// NPC constants

PRE_BATTLE = 0 ;
POST_DEFEAT = 1 ;
POST_BATTLE = 2 ;

TRAINER = [ PRE_BATTLE, POST_DEFEAT, POST_BATTLE ] ;

BEHAVIOURS = new Array() ; // all what is possible

BEHAVIOURS[PRE_BATTLE] = StartBattle ;

function StartBattle(Them) {
	// Them.AddPokemon(Pikachu) ;
	// this.AddPokemon(aPokemon) ;
	changeinterface(0) ;
	ENGAGE(this.Number, Them.Number) ;
}

