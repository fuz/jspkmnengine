function changeinterface(to) {
	if ( interfaces[STATE.ActiveInterface] [1] )
	// process all disabling instructions
		ProcessList( interfaces[STATE.ActiveInterface][1] ) ;
	
	hideI(STATE.ActiveInterface) ;

	STATE.ActiveInterface = to ; // set active interface
	if ( interfaces[to][2] )	// enabling instructions
		ProcessList( interfaces[to][2] ) ;
	showI(to) ;
}

function ProcessList(List) {
	for (var Current=0;Current < List.length;Current++)
	 List[Current]() ;
}

function hideI(tohide) {
	interfaces[tohide][0].style.display = "none" ;
}

function showI(toshow) {
	interfaces[toshow][0].style.display = "" ;
}