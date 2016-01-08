// low level page manipulation functions

JSPKE = {
	Version:.1
	}

function assert(expression, note) {
	if (!expression) {
		alert(note) ;
	}
}

function PageObject(What) {
	return [What,What.style] ;
}

function SetBack(What, To) {
// sets the background image
	What[_style].backgroundImage = "url(" + To + ")" ;
}

function EnablePageInput(element) {
	element.disabled = false ;
}

function DisablePageInput(element) {
	element.disabled = true ;

}

function SetSource(What, To) {
	What[_pageobj].src = To ;
}

function ResetImage(What) {
	// workaround for internet explorer which doesn't resize dynamically loaded images
	var NewImage = new Image() ;
	What[_pageobj].parentNode.replaceChild(NewImage, What[_pageobj] ) ;
	return [NewImage, NewImage.style] ;
}

function setOpacity(What, Value) {
// sets an object's opacity 
// thanks http://www.quirksmode.org/js/opacity.html
	What[_style].opacity = Value/10 ;
	What[_style].filter = "alpha(opacity=" + Value*10 + ")" ;
}

function SetPos( What, XY) {
// sets the left and right  properties of an object
	// XY = ApplyOffset(XY) ;
	What[_style].left = XY[_x] + Px ; What[_style].top = XY[_y] + Px ;
}

function CurPos( What ) {
// obtains the left and right  properties of an object
	return [parseInt(What[_style].left), parseInt(What[_style].top)] ;
}
