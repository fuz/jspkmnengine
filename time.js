// time primitives

function start_seconds() {
	timer = setInterval(second,1000) ;
}

function add_event(InSeconds, Action, ArgArray, Context) {
	if (!ArgArray || !ArgArray.length) ArgArray = [] ;
	if (!Context) Context = this ;
	if (seconds_loop[InSeconds]) InSeconds++ ;
	seconds_loop[InSeconds] = [ Action, ArgArray, Context ];
	if (!timer) start_seconds() ;
}

function stop_seconds() {
	clearInterval(timer) ;
	timer = null ;
}

function second() {
	Statistics.playtime++ ;
	window.status = "second" ;
	if (seconds_loop.length > 0 && seconds_loop[0]) {
		seconds_loop[0][0].apply(seconds_loop[0][2], seconds_loop[0][1] ) ; // call the event
	}
	seconds_loop.shift() ;
}