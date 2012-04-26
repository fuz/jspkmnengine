// animator.js, records and play mouse movement animations
/* animations should be recorded as if they are from the left side:
they will be flipped according to the side they are used by

*/
function RecordMouse(seconds, sendto) {
var cur = 0 ;
var interval = 45 ;
var stop = Math.floor( (seconds * 1000) / interval )
var looper = setInterval(NoteCoords, interval) ;
var previous = UMouse ;
var delta = [false] ;
var maxXY = [0,0] ;

 function NoteCoords() {
	// window.status = cur ;
  if (cur >= stop) {
   clearInterval(looper) ;
  // alert(seconds + " seconds over!") ;
alert(maxXY) ;
	sendto(SIDES[_left].GoPokeball,delta,_left ) ;
	// sendto(SIDES[_right].GoPokeball,delta,_right,1 ) ;
   return ;
  }
  delta.push( [UMouse[0]-previous[0],UMouse[1]-previous[1] ] ) ;
  previous = UMouse ;
  
  maxXY[0] += delta[delta.length-1][0] ;
  maxXY[1] += delta[delta.length-1][1] ;
  // MapText.value += delta[delta.length-1] + "\n" ;
  cur++ ;
 }
}

// plays recorded coordinates:

function reversedelta(x,list) {
	var reversed = [] ;
	for (var cur = 1 ; cur < list.length ; cur++) {
	 reversed[cur] = [x*list[cur][0],list[cur][1]] ;
	}
	return reversed ;
}

function deltarange(list) {
	var maxXY = [0,0] ;
	for (var cur = 1 ; cur < list.length ; cur++) {
	 maxXY[0] += list[cur][0] ;
	 maxXY[1] += list[cur][1] ;
	}
	return maxXY ;
}

function Playback(What, original, side, sendto) {
 What[_style].position = "relative" ;

  offset = deltarange(original) ;

  if (side == _left) {
	list = original ;
	offset = [ -offset[0], -offset[1] ] ;
	// alert(offset) ;
  } else if (side == _right) {
	list = reversedelta(-1,original) ;
	// offset = deltarange(list) ;
	offset = [ offset[0], -offset[1] ] ;
 }

useOffset = original[0] ;
 if (useOffset) { // animation type
  SetPos( What, offset ) ;
 }
 // changeinterface(0) ;


 var cur = 1 ;
 // var looper = setInterval(readcoord,25) ;
add_action(readcoord, [list, What, cur, sendto] ) ;

function readcoord(list, What, cur, sendto) {
	if (cur == list.length) {
	 // clearInterval(looper) ;
	 SetPos(What,[0,0]) ; // reset
	 HIDE(What) ;
	 MapText.value = list.toJSONString() ;
	 if (sendto) { 
	  sendto[0].apply( sendto[1], sendto[2] || [] ) ;
	 }
	 return ;
	}
  
   deltax = (parseInt( What[_style].left) | 0) + list[cur][0] ;
   deltay = (parseInt( What[_style].top) | 0) + list[cur][1] ;
   SetPos(What,[deltax,deltay]) ;
   
   cur++ ;
   add_action(readcoord, [list,What,cur, sendto] ) ;
 }
  
}
