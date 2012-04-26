function NetplaySprite() {
	this.NetWalk = NetWalk;
	this.XYList = [];
	// this.FinishedMoving = oFinishedMoving ;
	this.FinishedPath = oFinishedPath ;
	// this.StartPath = oStartPath ;
	// this.ContinueMoving = oContinueMoving ;
}
	// server uses a list of XYs to do movement from A to B but game uses directions

function NetWalk(XY) {
	if (this.XYList.length) {
		this.XYList.push(XY);
	} else {
		this.XYList.push(XY);
		this.WalkTo( this.XYList[0] );
	}
}

function oFinishedPath() {
	this.XYList.shift();
	if (this.XYList.length && this.XYList[0]) {
		this.WalkTo( this.XYList[0] );
	}
}

