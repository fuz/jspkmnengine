// 250 247

// C = 16 ; R = 15 ;		// cell columns and rows
// C = 16 ; R = 26 ;
C = 25 ; R = 15 ;

CellGrid = C * R ;		// total number of cells

X = 16 ; Y = 16 ;		// size of a cell

XLimit = X * C ; YLimit = Y * R ;

SelectorXY = [0,0] ;	// selector cell x,y
SelectorpxXY = [0,0] ;	// pixel cell x,y

TileStart = 0 ; // user has opened a tile

SpriteIcons = Img+"sprites/trainers/icons/" ; 
Still = "s" ;

// Panel Text Boxes
Data = document.data ;

AccMenu = Data.acceleration ;

CellOffsetBox = Data.celloffset ;
OffSetBox = Data.offset ;

PlayerLoc = Data.playerloc ;

MapText = Data.map_text ;

CursorPX = Data.cursorpx ;
CursorPXCell = Data.cursorpxcell ;
CursorCell = Data.cursorcell ;

PlayerLocation = Data.playerloc ;

// Elements
Collider = [document.getElementById("collider"),
			document.getElementById("collider").style ] ;

PlayerSprite = [document.getElementById("player"),
				document.getElementById("player").style] ;

Mapper = [document.getElementById("tile"),
				document.getElementById("tile").style] ;
	// once changed to outertile to see what would happen

OuterTile = [document.getElementById("outertile"), document.getElementById("outertile").style] ;

FollowTest =  [document.getElementById("selection"),
				document.getElementById("selection").style]

MapperPos = new ElementPosition(Mapper);
MapperX = MapperPos.x ;
MapperY = MapperPos.y ;


// 0 = x left, 1 = y top, opposite
Positions = [
[-1,-1], // North West 0
[0,-1,6], // North 1
[1,-1], // North East 2
[-1,0,4], // West 3
[1,0,3], // East 4
[-1,1], // South West 5
[0,1,1],  // South 6
[1,1] // South East 7
] ;
// direction effects upon XY



function Tile( N ) {
	// [Loc, Offset, XY]
	// filename, global offset, size, playerpos
	this.Number = N ;
	this.Loc = Tiles[N][0]; // URL of tile
	this.Offset = Tiles[N][1] ; // pixels
	this.XY = Tiles[N][2] ;

	this.MusicTrack = Tiles[N][3] ;

	this.Data = TileData[N] ; // raw data of the tile
	this.CurrentOffset = [0,0] ; // tile offset in pixels
	this.Load = LoadTile ; // expand the tiledata for collision detection using the referenced tileobject's XY
	// this.PlayerPos = Tiles[N][3] ; // initial player positions
	this.Render = RenderTile ; // draws tile image to screen
	
// Development	
	this.DevData = new Array( this.XY[1] * this.XY[0] ) ; // development data
	this.DevLoadTile = DevLoadTile ; // development load (draws square guides to screen)
}

function Sprite(SpriteNumber, PageObject, Positioning, CharacterNumber, PlayerImage) {
// player sprite
	this.Mode = NPCSprite ;
	// by default, all sprites are NPCs and playable characters are specified on demand
	this.Mode() ;
	
	this.nFinishedMoving = nFinishedMoving ;
	this.nFinishedPath = nFinishedPath ;

	this.aFinishedMoving = aFinishedMoving ;
	this.aFinishedPath = aFinishedPath ;
	
	this.CharacterNumber = CharacterNumber ;
	this.Number = SpriteNumber ; // referenced sprite of sprites.js Sprites
	this.What = [ PageObject[_pageobj], PageObject[_style] ] ;
	
	this.Direction = 0 ; // direction to move to after current movement
	
	this.PlayerImage = PlayerImage ;

	if (Positioning.Facing == null || Positioning.Facing == undefined) {
	 Positioning.Facing = 6 ;
	 // default face screen position
	}

	Positioning.Animated = false ; // the sprite will not be animated yet
	this.Character = Positioning ;
	
	this.Path = [] ; // directions to travel along
	this.WalkTo = SpriteWalkTo ; // builds a path from player to supplied coordinates
	this.RunPath = RunPath ; // tries to move to next direction on path
	this.DoneDirection = DoneDirection ;
	
	this.Render = RenderSprite ;
	this.RenderCheck = RenderCheck ;

	this.Destroy = DestroySprite ;
	this.Center = CenterSprite ;
			
	this.TryMove = TryMovePlayer ; // attempts to move player in direction
	
	this.Move = MovePlayer ; // moves a player
	this.Moved = MovedPlayer ; // updates variables after moving
	this.Step = StepPlayer ; // makes a step
	
	this.SetDirection = ChangeDirection ;

	this.Animate = AnimateSprite ; // animate a static sprite
	
	this.CreateSight = CreateSight ; // generates a line of sight that reacts to input
	this.ClearSight = ClearSight ;

	this.Queued = [] ; // what to do next
	this.AddQueue = AddQueue ;
	this.RunQueue = RunQueue ;
}

function CreateSight(Range) {
	var WatchedList = [] ; // list of tiles currently watched by character
	var NextXY = this.Character.XY ;

	for (var current_square = 0 ; current_square < Range ; current_square++) {
		var NextXY = [
		       NextXY[_x] + Positions[this.Character.Facing] [_x],
		       NextXY[_y] + Positions[this.Character.Facing] [_y]
				] ;
		
		var ThisCell = XYtoCellNumber(NextXY) ;
		WatchedList.push(ThisCell) ;
		var tc = GetTileContents(CurrentTile.Data[ThisCell]);
		tc.TileItem = 10;
		tc.LoS = this.CharacterNumber;
		CurrentTile.Data[ThisCell] = ToRawContents(tc);	

		/*
		if ( CurrentTile.Data[ThisCell] && CurrentTile.Data[ThisCell].length ) {
			// player exists here, ie, they've been seen
			CurrentTile.Data[ThisCell][2] = this.CharacterNumber ;
		}  else if ( typeof CurrentTile.Data[ThisCell] == "number" ) {
			// a tile item exists here
			CurrentTile.Data[ThisCell] = [,CurrentTile.Data[ThisCell],this.CharacterNumber] ;
		} else {
		       // the player's LoS is the only thing here
		       CurrentTile.Data[ThisCell] = [,,this.CharacterNumber] ; 
		}
		*/
	}
	this.WatchedList = WatchedList ;
}

function ClearSight() {
	var ThisCell ;
	// stops the character from responding to line of sight
	for (var current_cell = 0 ; current_cell < this.WatchedList.length ; current_cell++) {
		ThisCell = this.WatchedList[current_cell] ;

		var tc = GetTileContents(CurrentTile.Data[ThisCell]);
		tc.TileItem = undefined;
		tc.LoS = undefined;
		CurrentTile.Data[ThisCell] = ToRawContents(tc);
		/*
		CurrentTile.Data[ThisCell].length = 2 ; // remove the character from the tile
		
		// alert(CurrentTile.Data[ThisCell]) ;
		
		if (CurrentTile.Data[ThisCell][0] == undefined && CurrentTile.Data[ThisCell][1] == undefined) {
			// if completely empty - remove it entirely
			CurrentTile.Data[ThisCell] = undefined ;
		}
		// alert(CurrentTile.Data[ThisCell]) ;
		*/
		
	}
}

function add_tile_metadata() {
	
}

function RenderCheck() {
	if (this.Character.Tile == STATE.CurrentTile)
		return true;
	else {
		return false ;
	}
}

function SetCharacterPlace(Character, PlaceNumber, TileNumber) {
// teleport player to place
	if (Character.Sprite.Active && STATE.CurrentTile != TileNumber) {
	 ActivateTile(TileNumber) ; // if the player is active and the tile is different, reset
	}
	Character.Position(TilePlaces[TileNumber][ PlaceNumber ], TileNumber) ;
}

function DestroySprite() {
	Mapper[_pageobj].removeChild( this.What[_pageobj] ) ;
	ClearCharacter(this.Character.XY) ;
	// HIDE(this.What) ;

}

function CenterSprite() {
	// center the sprite on the tile
	
	var pxXY = CellToPixel(this.Character.XY) ;
	var TOS = ApplyOffset(CurrentTile.CurrentOffset) ;
	
	/*
	 CurrentTile.CurrentOffset = [
		(-TOS[0] - pxXY[0]) + (XLimit/2)+40,(-TOS[1] - pxXY[1]) + (YLimit/2)
								 ] ;
	*/

	 CurrentTile.CurrentOffset = [
		-( pxXY[0]) + XLimit/2,
		-( pxXY[1]) + (YLimit/2)
								 ] ;
	/* 
		CurrentTile.CurrentOffset = [
		-( pxXY[0]) + (X * 12),
		-( pxXY[1]) + (Y * 7)
								 ] ; */
	

	SetPos( Mapper, CurrentTile.CurrentOffset ) ;
	
}

function CursorBox() {
// the box that follows the cursor
	this.XY = [0,0] ;
}

SolidCursor = new CursorBox() ;

function IsNegativeA(number) {
// if number is negative, below 0 return true, otherwise return false
	return number < 0 ? true : false;
}

function PixelToCell( pxXY ) {
// converts Pixels into Cells based on the preset XY values
	return [ Math.floor(pxXY[0] / X), Math.floor(pxXY[1] / Y) ] ;
}

function CellToPixel( clXY ) {
// converts Cells to Pixels based on the preset XY values
	return [clXY[0] * X, clXY[1] * Y] ;
}

function IsEven(Number) {
// returns true if even and false if odd
	if (Number % 2) return false ;
	else return true ;
}

function RenderSprite() {
// places a sprite to the screen at correct position

if (!this.RenderCheck() ) return false ; // not on the same tile
	ClearCharacter(this.Character.XY) ;
	var tc = SetCharacterAt(this.CharacterNumber, this.Character.XY) ;

	RPos = ApplyOffset( CellToPixel(this.Character.XY) ) ;

	// PlayLocation = this.Character.XY ;
	
	SetPos(this.What, RPos ) ;
	ChangeSprite(this.What /* this.PlayerImage */,
				 Sprites[this.Number][0].toLowerCase(),
				 this.Character.Facing,
				 this.Character.Animated) ;

}

function ApplyOffset( XY ) {
// applies the tile's global offset
	return [ XY[0] + CurrentTile.Offset[0] , XY[1] + CurrentTile.Offset[1] ] ;
}

function UnApplyOffset( XY ) {
// negates the tile's global offset
	return [ XY[0] - CurrentTile.Offset[0] , XY[1] - CurrentTile.Offset[1] ] ;
}

function RenderTile() {
// sets the image of the tile
	//SetBack(Mapper[_style], "images/tiles/" + this.Loc)
	document["tiler"].src = "images/tiles/" + this.Loc ;
	// SetPos(Mapper[_style], this.Offset)
	Current = CellToPixel(this.XY) ;



	if (OPTIONS.Music && this.MusicTrack >= 0) {
	 Audio(0,this.MusicTrack) ; 
	}
	
	Mapper[_style].width = Current[0] + Px ; Mapper[_style].height = Current[1] + Px ;
}

/*
function Tester() {
// tester function to test out mapper
	CurrentTile = new Tile( 0 ) ;
	CurrentTile.Load() ;
	CurrentTile.Render() ;
	FollowTest[_style].width = X + Px ; FollowTest[_style].height = Y + Px;
	MyPlayer = new Sprite(0, PlayerSprite) ;
	MyPlayer.XY = CurrentTile.PlayerPos ;
	MyPlayer.Render() ;
	UpdateOffsets() ;
	showI(1) ;
}
*/


// moved from up above


// document.onkeydown = KeyHandle ;
// capture keypresses

function AcceptKeys() {
	// ActiveCharacter.Sprite.Path.length = 0 ;
	document.onkeydown = KeyPressed ;
	document.onkeyup = KeyUp ;
}

function IgnoreKeys() {
	document.onkeydown = null ;
	document.onkeyup = null ;
}

function AcceptNewDirKeys() {
	document.onkeydown = KeyDirectionChange ;
	document.onkeyup = KeyUpDirection ;
}

function KeyUp(e) {
// key goes up - handle actions
	Action = ACTIONS[ GetKeyCode(e) ] ;

	// alert( GetKeyCode(e) ) 
	if (Action) {
	 Action() ;
	}
}

	setInterval(KeyStatus, 50) ;

function KeyPressed(e) {
// handles the captured keypress
	// var Code = String.fromCharCode( GetKeyCode(e) ) ;
	
	// ActiveCharacter.Sprite.Path = [] ;
	
	// assert( ActiveCharacter.Sprite.Path.length == 0,"path has a length!") ;

	

	if (KEYS[ GetKeyCode(e) ]) {
	 finishedCalculating = false ;
	 executingInput = true ;
	 
	 // Code = KEYS[ GetKeyCode(e) ] ;
	 ActiveCharacter.Sprite.Direction = KEYS[ GetKeyCode(e) ] ;
	 AcceptNewDirKeys() ;
	 // ActiveWalkDirection(Code) ;
	 ActiveWalkDirection(ActiveCharacter.Sprite.Direction) ;
	}
}

function ActiveWalkDirection(Code) {
	// MapText.value = ActiveWalkDirection.caller ;
	if (STATE.ActiveInterface == 1 && Code && Code > 0)  { // a control key is being pressed
		// IgnoreKeys() ; // ignore further keys

		if (!ActiveCharacter.Sprite.TryMove(Code) ) {
		 AcceptKeys() ;
		}

		return false ;
	}
}

function KeyUpDirection(e) {
 // window.status = "UP" ;
 if (KEYS[ GetKeyCode(e) ] ) {
  ActiveCharacter.Sprite.Direction = 0 ;
  // Code = 0 ; // stop moving
 }
}

function KeyDirectionChange(e) {
	// ActiveCharacter.Sprite.Path.length = 0 ; // clear path

	if (KEYS[ GetKeyCode(e) ]) {
	 finishedCalculating = false ;
	 // Code = KEYS[ GetKeyCode(e) ] ;
	 ActiveCharacter.Sprite.Direction = KEYS[ GetKeyCode(e) ] ;
	}
}

function KeyStatus() {
 // window.status = document.onkeydown ;
 // window.status = ActiveCharacter.Sprite.Direction ;
 // window.status = central_loop.length + ":   " + central_loop ;
}

function ActivateCharacter(CharacterNumber) {
	STATE.ActiveCharacter = CharacterNumber ;
	ActiveCharacter = character_pool[CharacterNumber] ;

	if (STATE.CurrentTile != ActiveCharacter.Data.Positioning.Tile) {
		ActivateTile(ActiveCharacter.Data.Positioning.Tile) ;
	}
	
	ActiveCharacter.Mode = PlayableCharacter ;
	ActiveCharacter.Mode() ;
	
	ActiveCharacter.Sprite.Mode = PlayableSprite ;
	ActiveCharacter.Sprite.Mode() ;
	
	ActiveCharacter.Sprite.Active = true ;
	ActiveCharacter.Sprite.Center() ; // ensures the user can see their character
	
	// temporary ugliness
	SIDES[_left].Character = ActiveCharacter ;
	SIDES[_left].UpdateInventory() ;
}

function RenderCharacter(Character) {
	ActivateTile( Character.Data.Positioning.Tile ) ;
}

function RemoveActive() {
	STATE.ActiveCharacter = null ;
	ActiveCharacter = null ;
}

function DeactivateCharacter() {
	// returns to the actual player
	ActiveCharacter.Sprite.Active = false ;
	ActivateCharacter(STATE.ThePlayer) ;
}

function ActivateTile(TileNumber) {
	STATE.CurrentTile = TileNumber ;
	delete CurrentTile ;
	CurrentTile = new Tile(TileNumber) ;
		
	RemoveDevBoxes() ;
	CurrentTile.DevData = TileData[TileNumber] ; // load existing tile data into dev data for manipulations
	CurrentTile.DevLoadTile() ;
	
	CurrentTile.Load() ;
	CurrentTile.Render() ;
	LoadNPCS() ;
}

function LoadNPCS() {
	// load npcs of a tile
	// should only render the NPCs on the tile of that they belong - not on the CURRENT TILE
	
	for (cur_npc=0 ; cur_npc < TileNpcs[STATE.CurrentTile].length ; cur_npc++) {
		var NPC = character_pool[new CHARACTER(
				npcs[ TileNpcs[STATE.CurrentTile][cur_npc][2] ]
			).Number] ;
	
	var behaviourList = TileNpcs[STATE.CurrentTile][cur_npc][4] ;
	
	if ( behaviourList && behaviourList.length ) {
		// make a copy of all behaviours
		NPC.Data.Behaviours = TileNpcs[STATE.CurrentTile][cur_npc][4].slice(0) ;
	}

	NPC.NPCNumber = TileNpcs[STATE.CurrentTile][cur_npc][2] ;

	NPC.Position( [TileNpcs[STATE.CurrentTile][cur_npc][_x],
			TileNpcs[STATE.CurrentTile][cur_npc][_y]], STATE.CurrentTile ) ; // there
	
	NPC.Sprite.CreateSight( TileNpcs[STATE.CurrentTile][cur_npc][3] ) ;
	var wantBattle = TileNpcs[STATE.CurrentTile][cur_npc][4] ;
	if (wantBattle) {
		NPC.Data.wantBattle = wantBattle ;
		}
	}

}

function ChangeSprite(What, Loc, Direction, Animated) {
	var path = SpriteIcons + Loc + Direction ;

	if (!Animated) path += Still ;
	
	SetBack(What, path + ".gif") ;
	// changes sprite
	return What[_pageobj] ;
	// document["player_img"].src = SpriteIcons + Loc + ".gif" ;
}

function ChangeSprite_new(ImageObject, Location, Direction, isAnimated) {
	var path = SpriteIcons + Location + Direction ;
	
	if (!isAnimated) {
		path += Still ;	
	}
	
	//ImageObject.src = path + ".gif" ;
	SetSource(ImageObject, path + ".gif" ) ;
}

function ChangeDirection(Direction) {
// change player's sprite direction
	this.Character.Facing = Direction ;
	ChangeSprite( this.What  /*this.PlayerImage*/,
				 Sprites[this.Number][0].toLowerCase(),
				 Direction, this.Animated) ;
}

function AnimateSprite() {
	this.Character.Animated = !this.Character.Animated ;
	ChangeSprite(this.What /*this.PlayerImage */,
				 Sprites[this.Number][0].toLowerCase(),
				 this.Character.Facing,
				 this.Character.Animated) ;
				 
}

function pxGetFinalPosition(Code, CurpxXY) {
	return [
		CurpxXY[0] + ( Positions[Code][0] * X ) , CurpxXY[1] + ( Positions[Code][1] * Y )
	] ;
}

function GetObjectAt(XY) {
	var cell = XYtoCellNumber(XY)
	return CurrentTile.Data[ cell  ] ;
}

function GetTileObject(TileItemNumber) {
	if (typeof TileItemNumber === "object" && TileItemNumber.constructor == TileContents) {
		throw "You passed in TileContents, not the TileContents.Number";
	}
	return TileItems[ TileItemNumber ] ;
}

function isPlayer(TileData) {
	// players are either the ONLY entities occupying a tile item or one of many
	if (TileData && TileData.length && typeof TileData[0] =="number") {
	 return true ;
	} else {
	 return false ;
	}
}

/*
function GetTileItemNumber(TileData) {
	TileNumber = false ;
	
	if ( !isNaN(TileData) ) {
	 TileNumber = TileData ;
	} else if ( isPlayer(TileData) ) {
	 TileNumber = TileData[1] ;
	}
	return TileNumber ;
} */

function GetTileItemNumber(TileData) {
	var tc = GetTileContents(TileData);
	return tc.TileItem;
}

function hasTileItem(TileData) {
	if ( TileData && (!isNaN(TileData) || TileData[1]) ) {
	 return true ;	
	}
	return false ;
}

function SetCharacterAt(CharacterNumber, XY) {
	var cell = XYtoCellNumber(XY) ;
	var TileUnderneath = CurrentTile.Data[cell] ; // anything already here
	var tc = GetTileContents(TileUnderneath);
	tc.Character = CharacterNumber;

	// update tile
	CurrentTile.Data[ cell ] = ToRawContents(tc);	

	return tc;

	// todo: remove below
  /*
	if ( typeof TileUnderneath == "number" ) { // a tile item exists underneath the player
	 // the player is now ontop of this tile
	 CurrentTile.Data[ cell ] = [ CharacterNumber, TileUnderneath ] ;
	 return [TileUnderneath] ;
	} else if (TileUnderneath && TileUnderneath[2] ) {

		CurrentTile.Data[ cell ][0] = CharacterNumber ;
		return [10, TileUnderneath[2] ] ;

	} else { // only the player is here
	 CurrentTile.Data[ cell ] = [ CharacterNumber ] ;
	}
  */
}

function SetObjectAt(XY, CharacterNumber) {
	var cell = XYtoCellNumber(XY) ;
	
	if ( !isNaN(CurrentTile.Data[ cell ]) ) { // tile object
	 var TileNumber = CurrentTile.Data[ cell ] ;
	 CurrentTile.Data[ cell ] = [ CharacterNumber, TileNumber ] ;
	 return TileNumber ;
	}
	else  {
		CurrentTile.Data[ cell ] = [ CharacterNumber ] ; // empty
	}
	 // alert("Is now here: " + CurrentTile.Data[ cell ].toJSONString() ) ;
}

function ClearCharacter(XY) {
	// removes character from tile at position
	var cell = XYtoCellNumber(XY) ;
	
	// window.status = CurrentTile.Data[cell] ;
	
	if ( CurrentTile.Data[ cell ] && CurrentTile.Data[ cell ].length == 3 ) {
		CurrentTile.Data[ cell ][0] = undefined ;
	} else if ( isPlayer(CurrentTile.Data[ cell ]) ) {
		CurrentTile.Data[ cell ] = CurrentTile.Data[ cell ][1] ;
		// window.status = CurrentTile.Data[ cell ] ;
	 	// reset to original tile item if it exists
	}
	else {
		// erase the player
		CurrentTile.Data[ cell ] = undefined ;
	}
	
}

function GetTileUnderPlayer(TileObject) {
	return TileObject.TileItem;
	/*
	if (TileObject && TileObject.length > 1) {
		return TileObject[1] ;
	}
	*/
}

function isSolidTile(TileData) {
	return (TileData && TileData.solid);
	/*
	if (TileData && TileData[_solidity]) {
		return true ;
	}
		return false ;
	*/
}

function CheckSolidity(XY, Facing, oldXY) {
	var Solidity = false ; // default: non solid

	var Destination = GetObjectAt( XY ) ;
	var tc = GetTileContents( Destination ) ;	
	
	if ( tc.hasCharacter() ) {
		Solidity = true ; // players take precedence and make any tile solid
	} else if (tc.hasTileItem()) {

		var TileAhead = GetTileObject(tc.TileItem) ;
		var old = GetTileContents(GetObjectAt( oldXY ));
		var oldTile = GetTileObject(old.TileItem);

		if ( TileAhead.solid ) {
			 console.log("cannot move, solid " + TileAhead.name);
			 Solidity = TileAhead.solid ;
		} else if (old.hasTileItem() && CheckEdges(Facing, oldTile, TileAhead) ) {
		// check if edge of tile item is solid
			 Solidity = true ;
		}
	}
	return Solidity ;
}

function isDirectionallySolid(Tile) {
	return Tile.dsolid;	
	/*
	if (Tile && Tile.length && Tile[3]) {
		return true ;
	}
		return false ;
	*/
}

function GetXYinFront(XY, Direction) {
	return [
		XY[0] + Positions[Direction][_x],
		XY[1] + Positions[Direction][_y]
			] ;
}

function GetCellInFront(XY, Direction) {
	return XYtoCellNumber( 
		GetXYinFront(XY, Direction)
		) ;
}

function CheckEdges(Facing, oldTile, newTile) {
	// checks the solidity of an edge of a tile
	if (newTile == oldTile) { // if they're the same then the edges are not solid
		return false ;
	}
	if ( isDirectionallySolid(newTile) && Facing == dsolid) { // the new tile has a solid edge
		return true ;
	}
	// alert("checking existing tile\n"+Positions[Facing][_opposite] + "\n" + oldTile) ;
	if (oldTile.hasTileItem() && isDirectionallySolid(oldTile) && Positions[Facing][_opposite] == oldTile.dsolid ) { // the current tile has a solid edge
		return true ;
	}
			
	return false ;
}

function isInsideBounds(XY) {
	if (XY[_x] < 0 ||
		XY[_y] < 0 ||
		XY[_x] >= CurrentTile.XY[_x] || // we're using >= because we start counting from 0, may need to be fixed
		XY[_y] >= CurrentTile.XY[_y]) {
	 return false ;
	}
	
	return true ;
}

function areXYequal(XYa,XYb) {
	if (XYa[_x] != XYb[_x] || XYa[_y] != XYb[_y]) {
	 return false
	}
	else return true ;
}

function isSolidAt(XY) {
	var Destination = GetObjectAt(XY) ;

	var tc = GetTileContents(Destination);
	console.log(tc);
	if (tc.hasCharacter()) {
		return true;
	}
	var item = GetTileObject(tc.TileItem);
	console.log(item);
	if (item && item.solid) {
		console.log("solid here");
		return true;
	}
	return false;
}

function TryMovePlayer(Direction) {
	// window.status = TryMovePlayer.caller ;
	
	this.SetDirection( Direction ) ;
	// change the direction the player is facing and the graphic
	
	var Cur = CellToPixel(this.Character.XY) ;
	newpxXY = pxGetFinalPosition(Direction, Cur) ;
	// calculate final position of character
	
	var newXY = PixelToCell( newpxXY ) ;
	
	if ( !CheckSolidity(newXY, this.Character.Facing, this.Character.XY) && // solidity detection
			isInsideBounds(newXY)) { 
	// bounds protection, only move if within tile
	
	ClearCharacter(this.Character.XY) ; // remove character from previous tile
	
	this.Animate() ;
		
	if (this.Active) {
		// if active player, move camera to follow
			StepCamera(Direction, CurrentTile.CurrentOffset,
				   [CurrentTile.CurrentOffset[_x] - X * Positions[Direction][_x],
					CurrentTile.CurrentOffset[_y] - Y * Positions[Direction][_y]]) ;
	}
		
	this.Step(Direction, Cur, newpxXY, newXY) ;
		// moves the player
		
	if (OPTIONS.Netplay && this.CharacterNumber == STATE.ActiveCharacter) {
		// net_move(Code, newXY) ; // if netplay mode enabled, move character
		net_move(ActiveCharacter.Sprite.Direction, newXY) ;
	}
		
		return true ;
	}
	
	if (this.Active) {
		finishedCalculating = true ;
	}
	
	return false ;
}

function MovePlayer(pxXY) {
	if (this.RenderCheck) {
	 SetPos( this.What, ApplyOffset(pxXY) ) ;
	}
	// update the location of the character on the map
}

function AcceptPathBreakers() {
	document.onkeydown = InterruptPath ;
	document.onkeyup = RestoreNonPathKeys ;
}

function InterruptPath(e) {
	ActiveCharacter.Sprite.Path = [] ; // delete path
	KeyDirectionChange(e) ;
}

function RestoreNonPathKeys(e) {
	KeyUpDirection(e) ;
}

function SpriteWalkTo(To) {
	// builds a path to walk along
	
	if (this.CharacterNumber == STATE.ActiveCharacter) {
	 AcceptPathBreakers() ;
	 // this.RunPath = RunPath ;
	 var bot = false ;
	}

	var PlayerXY = this.Character.XY ;
	
	this.nextDir = To ; // next destination
	
	if (this.Path.length) {
		var alreadyExists = true ;
		// this.Path.shift( Positions[this.Character.Facing][2] ) ; // go backwards to make path correct	
	}

	var generatedPath = BuildPath(PlayerXY, To) ;
	
	if (!generatedPath) {
	 // alert("cannot make path" + PlayerXY + " to " + To + "\n" + generatedPath) ;
	 this.FinishedPath() ; // reset to defaults
	 return ; // path could not be created
	}

	MapText.value = [generatedPath,finishedCalculating,Code] ;
	this.Path = generatedPath ;

	this.StartPath(alreadyExists) ;
	// start running the path

	// this.Path.push(0) ; // stop

}

function RunPath() {
	var nextDirection = this.Path[0] ;

	 // Code = nextDirection ;
	 this.Direction = nextDirection ;
}

function BotRunPath() {
	var nextDirection = this.Path[0] ;
	
	this.TryMove(nextDirection) ;
}

function DoneDirection() {
	 this.Path.shift() ;
	  // erase the direction
}

function StepPlayer(Direction, pxXY, newpxXY, newXY) {

	pxXY = [
			pxXY[_x] + (Positions[Direction][_x]),
			pxXY[_y] + (Positions[Direction][_y])
			]
	
	/* if (pxXY[0] == newpxXY[0]
		&&
		pxXY[1] == newpxXY[1]) {
			// todo: needs check for active character! */
		
if (areXYequal(pxXY, newpxXY) ) {
	this.Moved(newpxXY, newXY) ;
	this.Animate() ;
	
	if (this.Path.length) {
		this.DoneDirection() ;
		this.RunPath() ;
		if (this.Path.length == 0) {
			this.FinishedPath() ;
		}
	}
	
	window.status = this.Direction ;
	
	if (this.Direction) {
		this.ContinueMoving() ;
	} else {
		this.FinishedMoving() ;
	}
	return ;
	/* if ( this.CharacterNumber == STATE.ActiveCharacter) {
	if ( this.Path.length ) {
		this.DoneDirection() ;
		this.RunPath() ;
		if (this.Path.length == 0) {
		 Code = 0 ; // stop the path
		 AcceptKeys() ;
		 finishedCalculating = true ;
		 
		 return ;
		}
	}
		
				if (Code) {
				 ActiveWalkDirection(Code) ;
				}
				else {
					AcceptKeys() ;
					finishedCalculating = true ;
				}
	
	} else if (this.Path.length) { // bots
			this.DoneDirection() ;
			if (this.Path.length) { // if path still exists
				this.RunPath() ;
			} else { // path finished
				this.RunQueue() ;	
			}
	}
			return ;
			*/ 
	} // if equal
	
	this.Move(pxXY) ;

	 add_action(this.Step, [Direction, pxXY, newpxXY, newXY], this) ;
	 // continue moving otherwise
}

function MovedPlayer(pxXY, XY) {
	// the player has now moved from one space to another
	this.Move(pxXY) ;
	this.Character.XY = XY ;
	var LoS;	
	PlayerLocation.value = XYtoCellNumber(this.Character.XY) ;
	
	var TileData = SetCharacterAt(this.CharacterNumber, XY) ;
	if (TileData.hasTileItem()) {
		ThisTile = TileData.TileItem;
		LoS = TileData.LoS;
	
	/*
	if ( TileData ) {
	var ThisTile = TileData[0] ;
	
	if (!TileEvents[ThisTile]) return ;
	
	if (TileData[1]) {
		var Metadata = TileData[1] ;	
	}
	*/
		if (TileEvents[TileData.TileItem]) {
			var TileEvent = new TileEvents[ThisTile]( TileItems[ThisTile], LoS ) ;
			OnTile(TileEvent, this.CharacterNumber, ThisTile) ;
		}	
	}
}

function StepCamera(Direction, pxXY, newpxXY) {
	// window.status = pxXY + " " + newpxXY ;
	pxXY = [ pxXY[_x] - Positions[Direction][_x],
			 pxXY[_y] - Positions[Direction][_y]] ;
	
	/* if (pxXY[_x] == newpxXY[_x] 
			 &&
		pxXY[_y] == newpxXY[_y] ) { */
	if (areXYequal(newpxXY, pxXY) ) {
		CurrentTile.CurrentOffset = pxXY ;
		return ;	
	}
	SetPos(Mapper, pxXY) ;
	
	// if (pxXY != newpxXY) 
	 add_action( StepCamera, [Direction, pxXY, newpxXY] ) ;
	
	// MapMove( Direction, Acceleration)
}

function XYtoCellNumber(XY) {
// convert XY into Cells from the left, reversal of CellNumbertoXY
return ( (XY[1] * CurrentTile.XY[0]) + XY[0]) ; // cells from top left
}

function CellNumbertoXY(CellNumber) {
// convert cells from top left to an X and Y, reversal of XYtoCellNumber
	XY = [] ;
	XY[_y] = Math.floor(CellNumber / CurrentTile.XY[_x]) ;
	XY[_x] = CellNumber % CurrentTile.XY[_x]
	/* alert(XY) ; */
	return XY ;
}

function GetKeyCode(e) {
// capture keypress
	if (!e) e = window.event ;

	return e.keyCode || event.which ;
}

function ClickToMove() {
	ActiveCharacter.Sprite.WalkTo( SolidCursor.XY ) ;
}

function Panel(Mouse) { document.onmouseup = null
// every time the mouse is moved, make selector follow mouse
	UMouse = UnApplyOffset(Mouse) ; // mouse with offset taken away
	Cells = PixelToCell( UMouse ) ; // unoffsetted mouse
	Position = CellToPixel( Cells ) ; // rounded up pixels
	UPosition = ApplyOffset( Position ) ; // offsetted position
	// Position[0] >= 0 && Position[1]
	
	if ( Position[_x] >=0 && Position[_y] >= 0 && TileStart == 0) {
		SetPos( FollowTest , UPosition ) ;
		 if (devmode) {
			document.onmouseup = SelectedTile ;
		}
		else {
			document.onmouseup = ClickToMove ;
		}
	}

	SolidCursor.XY = Cells ;
	SolidCursor.rXY = PixelToCell( UMouse ) ; // relative XY

	// debug values
	// CursorPXCell.value = UPosition ;
	CursorCell.value = SolidCursor.rXY ;
	// CursorPX.value = Mouse ; // the real X and Y
	
}

function Pos(Direction) {
// move the map and update offsets
	Acceleration = parseInt(AccMenu.options[AccMenu.selectedIndex].text) ;
	MapMove( Direction, Acceleration ) ;
	// UpdateOffsets() ;
}

/* 
function UpdateOffsets() { // Current = CurPos(Mapper) ;
// update panel text box offset values
	OffSetBox.value = CurrentTile.Offset ;
	CellOffsetBox.value = PixelToCell( CurrentTile.Offset ) ;
	GlobalCellBox.value = PixelToCell( CurrentTile.CurrentOffset ) ;
}
*/

function MapMove( Direction, Acceleration) {
// move the map
	CurrentTile.CurrentOffset[0] = CurrentTile.CurrentOffset[0] + Positions[Direction][0] * Acceleration
	CurrentTile.CurrentOffset[1] = CurrentTile.CurrentOffset[1] + Positions[Direction][1] * Acceleration
	SetPos(Mapper, CurrentTile.CurrentOffset) ;
}

function EnableMap() {
	enable_action(ShowMenu) ; // allow game menu to be opened
	AcceptKeys() ;
	enable_directions(3,4,1,6) ;
}

function DisableMap() {
	disable_action( ShowMenu ) ;
	IgnoreKeys() ;
	disable_directions(3,4,1,6) ;
}


function Keypoint( Where ) {
	Mapper[_style].backgroundPosition = Where ;
}

function TileList() {
// fills the list of potential objects for selection
	ListBox = document.forms["tileselector"].tileobjects ;
	List = ListBox.options ;
	for ( CurrentItem = 0 ; CurrentItem < TileItems.length ; CurrentItem++) {
		List[List.length] = new Option(TileItems[CurrentItem].name,CurrentItem) ;
	}
}

function ShadeXY(XY, CLASS) {
	var Shaded = document.createElement("div") ;
	
	Shaded.className = CLASS
	
	Shaded = [Shaded, Shaded.style] ;
		
	Mapper[_pageobj].appendChild( Shaded[_pageobj] ) ;
	Shaded[_style].width = X + Px ;
	Shaded[_style].height = Y + Px ;
	
	SetPos(Shaded, ApplyOffset( CellToPixel(XY) ) ) ;
}

function ShadeExplored(XY) {
	ShadeXY(XY, "explored") ;
}

function ShadePath(XY) {
	ShadeXY(XY, "path") ;	
}

function ShadeTile(TileObjectNumber, pxXY) {
// gives a tileobject a black outline
	TileObject = TileItems[TileObjectNumber] ;
	Shaded = document.createElement("div") ;
	Shaded = [Shaded, Shaded.style] ;
	// Text = document.createTextNode(TileObject[0].charAt(0)) ;
	Current =  CellToPixel( TileObject.xy ) ;
	
	Shaded[_style].width = Current[_x] + Px ;
	Shaded[_style].height = Current[_y] +  Px ;
	
	Shaded[_pageobj].className = "shader" ;

	Shaded[_style].left = pxXY[_x] + Px ;
	Shaded[_style].top = pxXY[_y] + Px ;
	
	Shaded[_pageobj] = Mapper[_pageobj].appendChild( Shaded[_pageobj] ) ;
	
	CancelTile() ;
}

function ReadTile(Data) {
// expands raw tile data into collision system friendly detectable data
// needs to be IN PLACE
	var XY ; var NewData = new Array() ; var Current ; Cur = "" ; var CurrentXY= [0,0] ;
	CurrentEntries = Data.length ;
	var Previous = [0,0] ;
	var RowColumnXY = [0,0] ;
	
	for (Current=0 ; Current < CurrentEntries ; Current++) {
	// Cur += "Data " + Current
	var item = Data[Current];
	 CurrentData = TileItems [ item  ] ;
	 if (CurrentData) {
		 XY = CurrentData.xy ;
	 // Cur += " - XY:" + XY + "\n";

RowColumnXY[1] = 0 ;
Previous[0] = Current ;
for (CurrentXY[1] = 0 ; CurrentXY[1] < XY[1] ; CurrentXY[1]++) { // y
		Cur += "Y" + CurrentXY[1] ;
		for (CurrentXY[0] = 0 ; CurrentXY[0] < XY[0] ; CurrentXY[0]++) { // x
			RowColumnXY[0] = CurrentXY[0] ;
			Calculation =  RowColumnXY[0] + RowColumnXY[1] ; // number of cells from
			var pos = Current + Calculation	
			NewData[pos] = item
			
			// Cur += "\t :" + CurrentXY[1] + " Current:" + Calculation + " (" + Data[Current] + ")\n" ;
		}
	RowColumnXY[1] += CurrentTile.XY[0] ;
}

// end calculation	
 }
}
 	// alert(Cur) ;
	return NewData ;
}

function LoadTile() {
// loads tile into memory
	this.Data = ReadTile(this.Data) ;
}

function DevLoadTile() {
// draws tile objects	
	var Cur ;
	for (CurrentSquare=0 ; CurrentSquare < this.DevData.length ; CurrentSquare++) {
		Cur = this.DevData[CurrentSquare] ;
		if (Cur >= 0) {
			Square = ApplyOffset( CellToPixel(CellNumbertoXY(CurrentSquare)) ) ;
			ShadeTile( this.DevData[CurrentSquare] , Square )
			/* alert("Final Position: " + Square + "\n" + 
			"Cell Number to XY :" + CellNumbertoXY(CurrentSquare) 
		) ; */
			}
	}
}

function RemoveDevBoxes() {
	var boxes = getElementsByClass("shader",Mapper[_pageobj],"div") ;
	for( curbox = 0 ; curbox < boxes.length ; curbox++ )
		Mapper[_pageobj].removeChild( boxes[curbox] );
}




function CancelTile() {
	TileStart = 0 ;
	Collider[_style].visibility = "hidden" ;
	setOpacity(FollowTest,10) ;
	FollowTest[_style].backgroundColor = "";
	FollowTest[_style].borderColor = "#FFFF00"
}

function ApplyTile( TileObject ) {
// assigns tile object to selector's point of memory

	XFrom = XYtoCellNumber(SelectorrXY) ; // cells from top left
	var tc = GetTileContents(CurrentTile.Data[XFrom]);
	var dtc = GetTileContents(CurrentTile.DevData[XFrom]);
	tc.TileItem = TileObject;
	dtc.TileItem = TileObject;
	
	CurrentTile.Data[XFrom] = ToRawContents(tc);
	CurrentTile.DevData[XFrom] = ToRawContents(dtc);

	/*
	if (isPlayer(CurrentTile.Data[XFrom])) {
		CurrentTile.DevData[XFrom] = TileObject ;
		CurrentTile.Data[XFrom] = [ CurrentTile.Data[XFrom][0] , TileObject] ;
	}
	else CurrentTile.DevData[XFrom] = TileObject ;
	*/
	
	MapText.value = CurrentTile.DevData ;
	ShadeTile(TileObject, SelectorpxXY) ; // shade tile
	
	// CurrentTile.Data = CurrentTile.DevData;
	// CurrentTile.Load();
}

function SelectedTile() {
document.onmouseup = null ; 
// shows tile selection box
	TileStart = 1 ;
	
	SelectorXY = SolidCursor.XY ;
	SelectorrXY = SolidCursor.rXY ;
	 SelectorpxXY = ApplyOffset( CellToPixel( SelectorXY ) ) ;

	// SetPos(Collider, [SelectorpxXY[0],SelectorpxXY[1]+Y] ) ; // move collider to correct position
	
	// SetPos(Collider, [Math.floor(XLimit/2) ,Math.floor(YLimit/2)] ) ;

	SetPos(Collider, [0, YLimit-32] ) ;
	
	with(Collider[_style]) {
	visibility = "visible" ;
						}
	FollowTest[_style].borderColor = "white";
	FollowTest[_style].backgroundColor = "orange";
	setOpacity(FollowTest,5)
	BeginTileFill() ;
}
