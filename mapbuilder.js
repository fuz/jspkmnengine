// map building tools

var startXY ;
var finishXY ;

function XYSize(Top, Bottom) {
	return [ 1+Math.abs( Top[_x]-Bottom[_x] ), 1+Math.abs( Top[_y] -Bottom[_y]) ] ;
}

function BeginTileFill() {
	startXY = SolidCursor.XY ;
	Mapper[_pageobj].onmouseup = EndTileFill ;
}

function EndTileFill() {
	// a range was selected
	finishXY = SolidCursor.XY ;
	window.status =  XYSize( startXY,finishXY) ;
}