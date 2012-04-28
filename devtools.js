// handles development features and interface

GameArea = PageObject( document.getElementById("game") ) ;

DevBlock = PageObject( document.getElementById("devblock") ) ; 
DevBlock[_style].width = screen.width+Px; 
DevBlock[_style].height = screen.height+Px;
	HIDE( DevBlock ) ;

function EnableDevmode() {
	// Mapper[_style].
	devmode=!devmode ;
	if (devmode) {
		// OuterTile[_style].overflow = "visible" ;
		// GameArea[_style].overflow =  "visible" ;
		// SHOW( DevBlock ) ;
		// document.body.style.overflow = "hidden" ;
	}
}

