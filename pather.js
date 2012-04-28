/* an A* implementation for path finding in JSPKMNE
binary heap stolen from http://www.policyalmanac.org/games/binaryHeaps.htm, http://www.policyalmanac.org/games/aStarTutorial.htm
*/
var MovementCost = 10 ;

function Distance(XYfrom, XYto) {
	return ( Math.abs(XYfrom[0]-XYto[0]) + Math.abs(XYfrom[1]-XYto[1]) ) ;
}

var MoveDirs = [
		Positions[1], // north
		Positions[4], // east
		Positions[6], // south
		Positions[3] // west
	] ;

var OppositeDirs = [
		2,
		3,
		0,
		1
		] ;

var RealDirs = [
					1,
					4,
					6,
					3
					]

function BuildPath(XYfrom, XYto) {

	if (isSolidAt(XYto)) {
	 // alert("destination solid") ;
	 return false ;
	}
	
	if (!isInsideBounds(XYto)) {
	 // alert("outside bounds") ;
	 return false ;
	}

	var OpenList = [] ;
	 var FList = [] ;
	 var XYlist = [] ;
	 var GList = [] ;
	var ClosedList = [] ;
	var squaresChecked = 0 ;
	var OpenSize = 0 ;
	var Parents = [] ;
	var tielist = [] ;
	var DirectionList = [] ;

function GetG(ParentXY) {
	var PreviousG = GList[ Parents[ParentXY] ] || MovementCost ;
	return PreviousG ;
}

function ADD(XY, F, Parent, G, ParentXY, Direction) {
	squaresChecked++ ; // id number
	OpenSize++ ;

	OpenList[OpenSize] = squaresChecked ;
	OpenList[XY] = squaresChecked ;

	Parents[XY] = Parent ;
	if (Direction != undefined) {
		DirectionList[XY] = Direction ;
		// where to go when at XY
	}
	XYlist[squaresChecked] = XY ;

	// var PreviousG = GList[ Parents[ParentXY] ] || MovementCost ;
	GList[squaresChecked] = G /* + GetG() ; */
	
	FList[squaresChecked] = F ;
	
	var I = OpenSize ;
	  
	while (I > 1) {
	   var parentI = Math.floor(I/2) ;
	   var parentF = FList[ OpenList[parentI] ] ;
	   
	   if (F < parentF) {
		OpenList[I] = OpenList[parentI] ;
		OpenList[parentI] = squaresChecked ;
	    I = parentI ; // continue where we left of
	   } else {
	   	break ;
	   }
	  }
  
}

function SORT() {
	var I = 1 ;
	var Me = OpenList[1] ;
	var NewF = FList[ OpenList[1] ] ;
	
	while(true) {
	 var childA = I*2 ;
	 var childB = childA+1 ;	// right child is next to left child
	
	 var swap = null ;
	 
	if (childA < OpenSize) {	// if left child exists
	 if ( FList[ OpenList[childA] ]  < NewF)
	  swap = childA ;
	}
	
	if (childB < OpenSize) {
	 if (FList[ OpenList[childB] ]  < NewF )
	  swap = childB ;
	}
	
	if (swap != null) {
	 	OpenList[I] = OpenList[swap] ;
		OpenList[swap] = Me ;
		I = swap ; // offset for next iteration
	} else {
		break ; // sorted
	}
	
	} // end of loop
}

function REMOVE() {
	// remove lowest F score
	OpenList[ XYlist[ OpenList[1] ] ] = undefined ;
	OpenList[1] = OpenList[OpenSize] ; // set last added F cost to front of list

	OpenList.pop() ; // remove last F
	OpenSize-- ;
	
	SORT() ;
}
	
	ADD(XYfrom, Distance(XYfrom, XYto), 1, MovementCost, XYfrom) ; // add starting cell
	
	var debugtext = "" ;
	var processedsquares = 0 ;
	while (OpenSize > 0 && processedsquares < 250) {
		var CurrentSquare = OpenList[1] // lowest
		
		var CurrentXY = XYlist[CurrentSquare] ;
		// debugtext += "\ncurrently at " + CurrentXY + " square " + (processedsquares+1) + " my F " + FList[CurrentSquare] + "\n" ;
		
		REMOVE() ;

		ClosedList[ CurrentXY ] = CurrentSquare ;
		// ShadeTile(1, CellToPixel( CurrentXY ) ) ;
		
		// ShadeExplored(CurrentXY) ;
		// alert("") ;
		processedsquares++ ;
		// window.status = processedsquares ;
		
		if ( areXYequal(CurrentXY,XYto )) {
			// MapText.value = debugtext ;
			return Backtrack(CurrentXY) ;
			break ; // we've reached our destination
		}
		var tielist = [] ;
		for (var cur_position = 0 ; cur_position < MoveDirs.length ; cur_position++) {
			var Adjacent = [ CurrentXY[0] + MoveDirs[cur_position][0],
							CurrentXY[1] + MoveDirs[cur_position][1] ]

			if ( !isInsideBounds(Adjacent) ) {
			// out of map boundaries
				continue ;
			}

			// debugtext += cur_position + "\n" ;
			
			if ( isSolidAt(Adjacent) ) {
			 // debugtext += "cannot go to " + cur_position + " because of " + GetObjectAt( Adjacent ) + "\n" ;
			 continue ; // ignore solid tiles which cannot be walked upon	
			}

			if (ClosedList[Adjacent]) {
				// debugtext += Adjacent + " is on closed list\n" ;
				continue ; // ignore if already on closed list	
			}
		
		if ( !OpenList[Adjacent] ) { // is not on open list already
			var G = GetG(CurrentXY) + MovementCost ;
			var H = Distance(Adjacent, XYto) * MovementCost ;
			var F = G + H ;
			// debugtext += Adjacent + ": heuristic " + F + " " ;

			ADD(Adjacent, F, CurrentSquare, G, CurrentXY, cur_position) ;
			
			// debugtext += "lowest so far " + FList[ OpenList[1] ] + " Size: " + OpenSize + " " + FList.length + " \n" ;
				 /* for (var eachf = 1 ; eachf < OpenList.length ; eachf++) {
					debugtext += FList[ OpenList[eachf] ] + "," ;
				}
				debugtext += "\n " ; */
		
		} else {
			// debugtext += Adjacent + " already on open list\n" ;	
			var ID = OpenList[Adjacent] ;
			var ThisG = GList[ ID ] ;
			var PreviousG = GList[CurrentSquare] ;
			
			// debugtext += "this g: " + ThisG + " previous g:" + PreviousG + "\n" ;
			
			if (ThisG < PreviousG ) { // this path is better!
				// alert(NewG + " " + OldG) ;
				// debugtext += "found better path\n" ;
				Parents[CurrentXY] = ID ;
				
				// DirectionList[Adjacent] = OppositeDirs[cur_position] ; // works except it follows a different path
				// DirectionList[Adjacent] = DirectionList[ XYlist[ Parents[Adjacent] ] ] ; 
				
				DirectionList[CurrentXY] = OppositeDirs[cur_position] ;
	
				var G = ThisG + MovementCost ;
				var H = Distance(Adjacent, XYto) * MovementCost ;
				var F =  G + H ;
				
				GList[ID] = G ;
				FList[ID] = F ;
								
				SORT() ;
			}
			
			
		}
		
		
		}

	}

function Backtrack(CurrentXY) {
	ShadeTile(1, CellToPixel( XYto ) ) ;
	ShadePath(CurrentXY) ;
	var output = "" ;
	var finished = false ;
	previous = XYto ;
	var completePath = [] ;
	var directions = [] ;
	while (finished != true) {
		
		// alert("") ;
		// output += XYlist[ Parents[previous]] + "\n" ;
		
		// ShadePath(XYlist[ Parents[previous]]) ;
		completePath.push( XYlist[ Parents[previous]] ) ;
		
		directions.unshift( RealDirs[ DirectionList[ previous ]]  ) ;	
		previous = XYlist[ Parents[previous] ] ;

		// if (previous[0] == XYfrom[0] && previous[1] == XYfrom[1]) {
		if ( areXYequal(previous, XYfrom) ) {
		 // directions.shift() ;
		 // MapText.value = output + MapText.value ;
		 // alert("directions length: " + directions.length + "\ncoordinates length: " + completePath.length) ;
		 finished = true ;
		 return directions ; // list of directions
		}
	}
}
/* test case

	ADD(0,5) ;
	ADD(0,8) ;
	ADD(0,60) ;
	ADD(0,10) ;
	ADD(0,20) ;
	ADD(0,70) ;
	ADD(0,80) ;
	ADD(0,90) ;
	ADD(0,30) ;
	ADD(0,5) ;
	ADD(0,5) ;
	ADD(0,3) ;
	
	/*REMOVE() ; // 3
	REMOVE() ; // a 5
	REMOVE() ; // another 5
	REMOVE() ; // last 5
	// REMOVE() ;
	

	var debugtext = "" ;
	
	for (var eachf = 1 ; eachf < OpenList.length ; eachf++) {
					debugtext += FList[ OpenList[eachf] ] + "," ;
				}

	alert( "The lowest is: " + FList[OpenList[1]] + "\nand looks like: " + debugtext ) ;
	*/
}
