// computer AI characters

function NPCCharacter() {
	this.Action = nAction ;
	this.Talk = nTalk ;
	this.Interact = nInteract ;
	this.Queued = [] ;
	this.RunBehaviour = RunQueue ;
	this.SetBehaviour = SetBehaviour ;
}

function SetBehaviour(Parameters) {
	this.Queued.push( [BEHAVIOURS[this.Data.Behaviour] , [Parameters] ] ) ;
}

function nAction() {
	var Infront = GetXYinFront(
				this.Data.Positioning.XY,
				this.Data.Positioning.Facing
				) ;
	Infront = GetObjectAt(Infront) ;
	
	if ( isPlayer(Infront) ) {
	 var Them = character_pool[ Infront[0] ] ;
	 this.Talk( Them ) ;
	} else if ( hasTileItem(Infront) ) {
	 this.Interact( GetTileItemNumber(Infront), Infront ) ;
	}
}

function nTalk(Their) {
	var nextBehaviour = this.Data.Behaviour ;
	
	this.SetBehaviour( Their ) ;
	
	if ( nextBehaviour >= 0 ) {
		this.Say( nextBehaviour ) ;
	}
	// npc needs to be able to do something else other than battle
	
	INTERFACE.SetEncounterImage(_right, TrainerImage(this.Data.Sprite) ) ;
	// i don't like how this needs to be underneath
}


function nInteract() {
		
}
