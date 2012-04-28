// computer AI characters

function NPCCharacter() {
	this.Action = nAction ;
	this.Talk = nTalk ;
	this.Interact = nInteract ;
	this.Queued = [] ;
	this.RunBehaviour = RunQueue ;
	this.SetBehaviour = SetBehaviour ;
}

// set this NPC's next behaviour
function SetBehaviour(Parameters) {
	var nextBehaviour = this.Data.Behaviours[0];
	var action = nextBehaviour[0];
	this.Queued.push( [BEHAVIOURS[action] , [Parameters] ] ) ;
}

function nAction() {
	var Infront = GetXYinFront(
				this.Data.Positioning.XY,
				this.Data.Positioning.Facing
				) ;
	Infront = GetObjectAt(Infront) ;
	var tc = GetTileContents(Infront);
	
	if ( tc.hasCharacter() ) {
	 var Them = character_pool[ Infront[0] ] ;
	 this.Talk( Them ) ;
	} else if ( tc.hasTileItem() ) {
	 this.Interact( GetTileItemNumber(tc.TileItem), Infront ) ;
	}
}

function nTalk(Their) {
	var mode = "random";
	var nextSpeech = 0; // default first speech item

	if (this.Data.Behaviours.length > 0) {
		var nextBehaviour = this.Data.Behaviours[0] ;
		mode = nextBehaviour[0];
		this.SetBehaviour( Their ) ;

		nextSpeech = (nextBehaviour.length > 1 ? nextBehaviour[1] : 0)
	}

		
	this.Say( nextSpeech, mode ) ;
	// npc needs to be able to do something else other than battle
	
	INTERFACE.SetEncounterImage(_right, TrainerImage(this.Data.Sprite) ) ;
	// i don't like how this needs to be underneath
}


function nInteract() {
		
}
