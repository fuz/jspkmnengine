// activated characters are handled differently to NPCs

function PlayableSprite() {
	// playable character mode
	this.FinishedPath = aFinishedPath ;
	this.FinishedMoving = aFinishedMoving ;
	this.StartPath = aStartPath ;
	this.ContinueMoving = aContinueMoving ;
}

function aContinueMoving() {
	ActiveWalkDirection(this.Direction) ;
}

function aStartPath(alreadyExists) {
	if (finishedCalculating == false) {
	// still moving	 

	} else if (finishedCalculating && !alreadyExists /*&& Code == 0*/ ) { // if path doesn't exist already, we start it off
		// window.status = "the code is " + Code ;
		// this.RunPath() ;
		// window.status = "new path" ;
		// alert("new path") ;
		ActiveWalkDirection( this.Path[0] ) ;
		// Code = this.Path[0] ;
	}	
}

function aFinishedPath() {
	// Code = 0 ; // stop the path
	ActiveCharacter.Sprite.Direction = 0 ;
	AcceptKeys() ;
	finishedCalculating = true ;
}

function aFinishedMoving() {
	AcceptKeys() ;
	finishedCalculating = true ;
	this.nFinishedMoving() ;
}