// Animation

// animation:

function add_action(Action, ArgArray, Context) {
// adds action to central game loop
	if (!Context) Context = this ;
	var next = central_loop.length ;
	 central_loop[ next ] = [ Action , ArgArray, Context ] ;

	if (!ticker) start_loop() ;
}

function start_loop() {
	ticker = setInterval(step, tick) ;
}

function step() { // steps through a tick
// window.status = central_loop.length + " loop running" ;

	// if (central_loop.length > 0) {
	for (var CUR=central_loop.length - 1 ; CUR > -1 ; CUR-- ) {
		central_loop[0][0].apply( central_loop[0][2], central_loop[0][1] ) ; // carry out action
		central_loop.shift() ;
			}
	if (!central_loop.length) stop_loop() ;
}

function stop_loop() {
	// window.status = "loop not running" ;
	clearInterval(ticker) ;
	ticker = null ;
}