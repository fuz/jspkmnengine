// nonactivated sprites are not controlled by the player
// the prefix 'n' represents non-active or NPC

function NPCSprite() {
	this.FinishedMoving = nFinishedMoving ;
	this.FinishedPath = nFinishedPath ;
	this.StartPath = nStartPath ;
	this.ContinueMoving = nContinueMoving ;
}

function nContinueMoving() {
	this.TryMove(this.Direction) ;
}

function nStartPath() {
	this.TryMove( this.Path[0] ) ;
	// starts off the path for computer controlled characters	
}

function nFinishedMoving() {
	// after finished moving by one square
	this.RunQueue() ; // do whatever necessary after finished moving

}

function nFinishedPath() {
	
}