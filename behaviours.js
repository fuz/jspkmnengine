
BEHAVIOURS = {} ; // all what is possible for NPC
RegisterBehaviour = function(name, procedure) {
	procedure = procedure || NoBehaviour;	
	BEHAVIOURS[name] = procedure;
	return name;
};

PRE_BATTLE = RegisterBehaviour("prebattle", StartBattle);
POST_DEFEAT = RegisterBehaviour("postdefeat", StartBattle);
POST_BATTLE = RegisterBehaviour("postbattle", StartBattle);
STORY = RegisterBehaviour("story", NoBehaviour);

// NPC constants


TRAINER = [ [PRE_BATTLE], [POST_DEFEAT], [POST_BATTLE] ] ;


MENTOR = [[STORY, 1]] ;

// BEHAVIOURS[PRE_BATTLE] = StartBattle ;

function StartBattle(Them) {
  Audio(0, 3);
  // Them.AddPokemon(Pikachu) ;
  // this.AddPokemon(aPokemon) ;
  changeinterface(0) ;
  ENGAGE(this.Number, Them.Number) ;
}

function NoBehaviour() {

}
