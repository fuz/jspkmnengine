STATE.netPlayers = [];

var server = document.applets["JSPKEClient"];

cred = document.getElementById("credentials") ;
userbox = cred.username;
passbox = cred.password;

minimum_password = 3 ;

EnableCredentials();

function validate_password(box) {
	
	supplied = passbox.value;
	
	assert( typeof supplied == "string", "supplied is not a string: " + supplied) ;
	
try {
	if (supplied=="")
		throw("You must type a password!") ;

	if (supplied.length < minimum_password)
		throw("Passwords are at least " + minimum_password + " characters long.") ;

} catch ( reason ) {
		assert( typeof reason == "string", "error: " + reason) ;
		
		Put( [reason]) ;
		EnablePageInput(passbox) ;
		return false ;
	}
	
	return true ;
}

function validate_username() {
	supplied = userbox.value;
	
	assert( typeof supplied == "string", "supplied is not a string: " + supplied) ;

try {
	if (supplied=="")
		throw("You must type a username") ;	

	if (CheckForNumbers(supplied) )
		throw("Usernames may not contain numbers.") ;

	
} catch( reason ) {
		Put( [reason] ) ;
		EnablePageInput(userbox) ;
		return false ;
	}
	
	return true ;
}

function CheckForNumbers(str) {
	var numberCheck= new RegExp(/\d/) ;
	return numberCheck.test(str) ;
}

// ask to disconnect the user
function logout()
{
	server.logout();
}

// actually disconnect
function disconnect(ignored) {

	STATE.Login = false;
	changeinterface(4) ;
	
	// destroys the character from the game
	for (var curNet = 0 ; curNet < STATE.netPlayers.length ; curNet++) {
		STATE.netPlayers[curNet].Dispose();
	}
        STATE.netPlayers = [];

	ActivateCharacter(STATE.PrevActive) ;
	
}

/**
This player is no longer in the game now :-)
*/
function removeNetPlayer(name) {
	STATE.netPlayers[name].Dispose();
	// delete STATE.netPlayers[ STATE.netPlayers[name].netID ];
}

function connect(username, password) {
	// player already logged in
	if (STATE.Login) {
		return;
	}
	var username = username || prompt("Username?","fuz") ;
	var password = password || prompt("Password?","sam") ;
	var account = server.login(username, password);
	
	if (account) {
		STATE.Login = true;
		enable_netplay() ;
	} else {
		Put(["Login failure! Please try again."]) ;
	}
	

	// net_update = setInterval(update, 300)
}

function moveNetPlayer(name, map, x, y)
{
	STATE.netPlayers[name].Sprite.NetWalk([x,y]);
}

function addNetPlayer(name, map, x, y)
{
	// alert("New player is : " + [name,map,x,y].join(","));
	map = parseInt(map);
	x = parseInt(x);
	y = parseInt(y);
	// alert( [typeof(name),typeof(map), typeof(x), typeof(y)].join(","));
	var playerData = {
		// our crash test dummy of sorts
		Name: name,
		Sprite: 2,
		Team:[],
		Pokemons:[],
		Items:[
		 [13
		 ]
				   ],
		// using the pocket IDs
		ItemQuantity: [
		 [1
		 ]
		],		  
		Gender:1,
		ActivePokemon:null,
		Positioning: {
			Facing:3,
			XY:[x,y],
			Tile: map // what tile the player is on
			}
		};
	var netPlayer = new CHARACTER(playerData);
	STATE.netPlayers[name] = netPlayer;
	
	var netID = STATE.netPlayers.length;
	netPlayer.netID = netID;
	
	STATE.netPlayers.push(netPlayer);
	netPlayer.Position([x,y], map);
	netPlayer.Sprite.Render();
	
	// make it a netplayer as opposed to NPC or controlled player
	netPlayer.Sprite.Mode = NetplaySprite;
	netPlayer.Sprite.Mode();
	
}

function initLoggedPlayer(name, map, x, y ) {
	STATE.PrevActive = STATE.ThePlayer;
	// alert([name,map,x,y].join(","));
	map = parseInt(map);
	x = parseInt(x);
	y = parseInt(y);
	// alert( [typeof(name),typeof(map), typeof(x), typeof(y)].join(","));

	var playerData = {
	// our crash test dummy of sorts
	Name: name,
	Sprite: 2,
	Team:[],
	Pokemons:[],
	Items:[
	 [13
	 ]
			   ],
	// using the pocket IDs
	ItemQuantity: [
	 [1
	 ]
	],		  
	Gender:1,
	ActivePokemon:null,
	Positioning: {
		Facing:3,
		XY:[x,y],
		Tile: map // what tile the player is on
		}
	};

	
	// create a character
	newChar = new CHARACTER(playerData);
	// STATE.ThePlayer = newChar.Number;
	// this is the real main character
	ActivateCharacter(newChar.Number);
	ActivateTile(map);
	 
	ActiveCharacter.Position([x,y], map);
	
	// alert("render check: " + ActiveCharacter.Sprite.RenderCheck());
}

function EnableCredentials() {
	EnablePageInput(userbox) ;
	EnablePageInput(passbox) ;
	EnablePageInput(cred) ;
}

function DisableCredentials() {
	DisablePageInput(userbox) ;
	DisablePageInput(passbox) ;
	DisablePageInput(cred) ;
}

function login(cred) {
	ClearOutput() ;

	var username = userbox.value ; 	var password = passbox.value;
	
	DisableCredentials() ;
		
	if ( validate_username(username) && validate_password(password) ) {
		Put(["Logging in..."]) ;
		connect(username, password);
		EnableCredentials();
	} else  {
		add_event(3, EnableCredentials, [username, password, cred])	
	}

}

function enable_netplay() {
	OPTIONS.Netplay = true ;
	changeinterface(1) ;
	AcceptKeys() ;
}

function NetKeyHandle(e) {
	KeyHandle(e) ;
}

// Obsolete netplay commands (new server replaces these)

function net_move(Direction, XY) {
	server.move_player(XY[_x], XY[_y] ) ;
}



function net_add() {
	// adds a character that spawns into player's screen
	
}

function net_update(Direction, Who) {
	// updates an EXISTING player
	character_pool[1].Sprite.TryMove(Direction) ;
	window.status = Direction ;
}
