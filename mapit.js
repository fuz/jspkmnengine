Px = "px" ;

C = 25 ; R = 13 ; CellGrid = C * R ;
X = 14 ; Y = 19 ;
Xlimit = X * C ; YLimit = Y * R ;
var CurrentTile ; 
SelectorXY = [0,0] ;
SelectorpxXY = [0,0] ;
TileStart = 0 ;

SpriteIcons = "images/sprites/trainers/icons/" ; 

// %&'(
// left, up, right, down
Key = new Array() ;
Key["W"] = 1 ; //  up
Key["A"] = 3 ; // left
Key["S"] = 6 ; // down
Key["D"] = 4 ; // right

for (a in Key) {

} ;

// Panel Text Boxes
Data = document.data ;

AccMenu = Data.acceleration ;

CellOffsetBox = Data.celloffset ;
OffSetBox = Data.offset ;

PlayerLoc = Data.playerloc ;

MapText = Data.map_text ;

Cursor = Data.cursor ;
CursorXandY = Data.cursorxandy

GlobalCell = Data.globalcell ;
XandY = Data.xandy ;
PlayerLocation = Data.playerloc ;

GlobalCellBox = Data.globalcell ;

// Elements
Collider = document.getElementById("collider") ;
ColliderStyle = Collider.style ;

Player = document.getElementById("player") ;
PlayerStyle = Player.style ;

Mapper = document.getElementById("tile") ;
MapperStyle = Mapper.style ;

FollowTestStyle = document.getElementById("selection").style ;

MapperPos = new ElementPosition(Mapper);
MapperX = MapperPos.x ;
MapperY = MapperPos.y ;


// 0 = x left		1 = y top
Positions = [
[-1,-1], // North West 0
[0,-1], // North 1
[1,-1], // North East 2
[-1,0], // West 3
[1,0], // East 4
[-1,1], // South West 5
[0,1],  // South 6
[1,1] // South East 7
] ;
// direction effects upon XY

document.onkeydown = KeyHandle ;
// capture keypresses

function Tile( N ) {
	// [Loc, Offset, XY]
	// filename, global offset, size, playerpos
	this.Number = N ;
	this.Loc = Tiles[N][0] // URL of tile
	this.Offset = Tiles[N][1] ; // pixels
	this.XY = Tiles[N][2] ;

	this.Data = TileData[N] ; // raw data of the tile
	this.CurrentOffset = [0,0] ; // pixels
	this.Load = LoadTile ; // expand the tiledata for collision detection using the referenced tileobject's XY
	this.PlayerPos = Tiles[N][3] ; // initial player positions
	this.Render = RenderTile ; // draws tile image to screen
	
// Development	
	this.DevData = new Array(this.XY[1]*this.XY[0]) ; // development data
	this.DevLoadTile = DevLoadTile ; // development load (draws square guides to screen)
	
}

function Sprite(N, PageObject) {
// player sprite
	this.Number = N ; // referenced sprite of Sprites.js Sprites
	this.What = PageObject ;
	this.XY = [0,0] ;
	this.Render = RenderSprite ;
	this.Move = MovePlayer ;
	this.Animate = AnimateMove ;
	this.SetDirection = ChangeDirection ;
}

function CursorBox() {
// the box that follows the cursor
	this.XY = [0,0] ;
}

SolidCursor = new CursorBox() ;

function setOpacity(What, Value) {
// sets an object's opacity 
// thanks http://www.quirksmode.org/js/opacity.html
	What.opacity = Value/10 ;
	What.filter = "alpha(opacity=" + Value*10 + ")" ;
}

function IsNegative(number) {
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

function SetPos( WhatStyle, XY) {
// sets the left and right style properties of an object
	// XY = ApplyOffset(XY) ;
	WhatStyle.left = XY[0] + Px ; WhatStyle.top = XY[1] + Px ;
}

function CurPos( WhatStyle ) {
// obtains the left and right style properties of an object
	return [parseInt(WhatStyle.left), parseInt(WhatStyle.top)] ;
}

function SetBack(What, To) {
// sets the background image
	What.backgroundImage = "url(" + To + ")" ;
}

function IsEven(Number) {
// returns true if even and false if odd
	if (Number % 2) return false ;
	else return true ;
}

function RenderSprite() {
// places a sprite to the screen
	RPos = ApplyOffset(CellToPixel(this.XY)) ;

	PlayLocation = this.XY ;
	SetPos(this.What.style, RPos ) ;
	Loc = SpriteIcons + Sprites[this.Number][0].toLowerCase() + "6.gif" ;
	SetBack(this.What.style, Loc) ;
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
	//SetBack(MapperStyle, "images/tiles/" + this.Loc)
	document["tiler"].src = "images/tiles/" + this.Loc ;
	// SetPos(MapperStyle, this.Offset)
	Current = CellToPixel(this.XY) ;

	MapperStyle.width = Current[0] + Px ; MapperStyle.height = Current[1] + Px ;
}

function Tester() {
// tester function to test out mapper
	CurrentTile = new Tile( 0 ) ;
	CurrentTile.Load() ;
	CurrentTile.Render() ;
	FollowTestStyle.width = X + Px ; FollowTestStyle.height = Y + Px;
	MyPlayer = new Sprite(0, Player) ;
	MyPlayer.XY = CurrentTile.PlayerPos ;
	MyPlayer.Render() ;
	UpdateOffsets() ;
}

function KeyHandle(e) {
// handles the captured keypress
	Code = String.fromCharCode( GetKeyCode(e) )
	if (Key[Code]) MyPlayer.Animate(Key[Code]) ;
	return false ;
}

function ChangeSprite_old(What, Loc) {
// changes sprite
	What.style.backgroundImage = "url(" + SpriteIcons + Loc + ".gif)" ;
	// document["player_img"].src = SpriteIcons + Loc + ".gif" ;
}

function ChangeSprite(ImageObject, Location) {
	ImageObject.src = location ;
}

function ChangeDirection(What, Direction) {
// change player's sprite direction
	ChangeSprite(/*What*/ this.PlayerImage, Sprites[this.Number][0].toLowerCase() + Direction) ;
}

function MovePlayer(Code) { //Cur = CurPos( this.What.style ) ;
// moves player in a direction
	// CollisionDetect
	var Cur = CellToPixel(this.XY) ;
	
	var pxXY = [ Cur[0] + ( Positions[Code][0] * X ) , Cur[1] + ( Positions[Code][1] * Y ) ] ;
	// final XY of character
	
	var XY = PixelToCell( pxXY ) ;
	var TileItemNumberInFront = CurrentTile.Data[ XYtoCellNumber(XY) ] ;
	var TileItemInFront = TileItems[ TileItemNumberInFront ] ;
	
	Solid = 0 ;
	
	if (TileItemInFront && TileItemInFront.length) {
		Solid = TileItemInFront[2] ;
	}
	if (!Solid) { // solidity detection
		SetPos( this.What.style, ApplyOffset( pxXY) );
		this.XY = XY ;
	}
	
	// PlayerLocation.value = this.XY ;
}

function XYtoCellNumber(XY) {
// convert XY into Cells from the left, reversal of CellNumbertoXY
return ( (XY[1] * CurrentTile.XY[0]) + XY[0]) ; // cells from top left
}

function CellNumbertoXY(CellNumber) {
// convert cells from top left to an X and Y, reversal of XYtoCellNumber
	XY = [] ;
	XY[1] = Math.floor(CellNumber / CurrentTile.XY[0]) ;
	XY[0] = CellNumber % CurrentTile.XY[0]
	/* alert(XY) ; */
	return XY ;
}



function AnimateMove(Code) {
// invoke animation event to slowly move character forward
	this.SetDirection( this.What, Code ) ;
	this.Move(Code) ;
}

function GetKeyCode(e) {
// capture keypress
	var Code;
	if (!e) e = window.event ;
	return e.keyCode || event.which ;
}

function Panel(Mouse) { document.onmouseup = null
// every time the mouse is moved, make selector follow mouse
	XandY.value = Mouse ;
	UMouse = UnApplyOffset(Mouse) ;
	Cells = PixelToCell( UMouse ) ;
	Position = CellToPixel( Cells ) ;
	UPosition = ApplyOffset( Position ) ; 
	// Position[0] >= 0 && Position[1]
	if ( Position[0] >=0 && Position[1] >= 0 && TileStart == 0) {
		SetPos( FollowTestStyle , UPosition ) ;
		document.onmouseup = SelectedTile ;
	}

	SolidCursor.XY = Cells ;
	Cursor.value = Position ;
	SolidCursor.rXY = PixelToCell( UMouse ) ;
	Data.currentcell.value = SolidCursor.rXY ;
}

function Pos(Direction) {
// move the map and update offsets
	Acceleration = parseInt(AccMenu.options[AccMenu.selectedIndex].text) ;
	MapMove( Direction, Acceleration ) ;
	UpdateOffsets() ;
}

function UpdateOffsets() { // Current = CurPos(MapperStyle) ;
// update panel text box offset values
	OffSetBox.value = CurrentTile.Offset ;
	CellOffsetBox.value = PixelToCell( CurrentTile.Offset ) ;
	GlobalCellBox.value = PixelToCell( CurrentTile.CurrentOffset ) ;
}

function MapMove( Direction, Acceleration) {
// move the map
	CurrentTile.CurrentOffset[0] = CurrentTile.CurrentOffset[0] + Positions[Direction][0] * Acceleration
	CurrentTile.CurrentOffset[1] = CurrentTile.CurrentOffset[1] + Positions[Direction][1] * Acceleration
	SetPos(MapperStyle, CurrentTile.CurrentOffset) ;
}

function Keypoint( Where ) {
	MapperStyle.backgroundPosition = Where ;
}

function TileList() {
// fills the list of potential objects for selection
	ListBox = document.forms["tileselector"].tileobjects ;
	List = ListBox.options ;
	for ( CurrentItem = 0 ; CurrentItem < TileItems.length ; CurrentItem++) {
		List[List.length] = new Option(TileItems[CurrentItem][0],CurrentItem) ;
	}
}


function ShadeTile(TileObjectNumber,pxXY) { 
// gives a tileobject a black outline
	TileObject = TileItems[TileObjectNumber] ;
	Shaded = document.createElement("div") ;
	// Text = document.createTextNode(TileObject[0].charAt(0)) ;
	Current =  CellToPixel( TileObject[1] ) ;
	
	Shaded.style.width = Current[0] + Px ;
	Shaded.style.height = Current[1] +  Px ;
	
	Shaded.className = "shader" ;

	Shaded.style.left = pxXY[0] + Px ;
	Shaded.style.top = pxXY[1] + Px ;
	Mapper.appendChild(Shaded)
	// appendChild(Text) ;
	CancelTile() ;
}

function ReadTile(Data) {
// expands raw tile data into collision system friendly detectable data
// TODO: comment this so i understand this while NOT in the flow
	var XY ; var NewData = new Array() ; var Current ; Cur = "" ; var CurrentXY= [0,0] ;
	CurrentEntries = Data.length ;
	var Previous = [0,0] ;
	var RowColumnXY = [0,0] ;
	for (Current=0 ; Current < CurrentEntries ; Current++) {
	Cur += "Data " + Current
	 CurrentData = TileItems [ Data[Current] ] ;
	 if (CurrentData) {
	 XY = CurrentData[1] ;
	 Cur += " - XY:" + XY + "\n";

RowColumnXY[1] = 0 ;
Previous[0] = Current ;
for (CurrentXY[1] = 0 ; CurrentXY[1] < XY[1] ; CurrentXY[1]++) { // y
		Cur += "Y" + CurrentXY[1] ;
		for (CurrentXY[0] = 0 ; CurrentXY[0] < XY[0] ; CurrentXY[0]++) { // x
			RowColumnXY[0] = CurrentXY[0] ;
			Calculation =  RowColumnXY[0] + RowColumnXY[1]
				NewData[ Current + Calculation ] = Data[Current]
				Cur += "\t :" + CurrentXY[1] + " Current:" + Calculation + " (" + Data[Current] + ")\n" ;
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


function CancelTile() {
	TileStart = 0 ;
	ColliderStyle.visibility = "hidden" ;
	
}

function ApplyTile( TileObject ) {
// applies selected tile to memory
	// Add Object here
	// alert(CurrentTile.XY) ;
	XFrom = (SelectorrXY[1] * CurrentTile.XY[0] + SelectorrXY[0]) ; // cells from top left
	// alert(SelectorXY[1] + "*" + SelectorXY[0] + "\n" + XFrom + "\n" + SelectorXY ) ;
	CurrentTile.DevData[XFrom] = TileObject ;
	
	MapText.value = CurrentTile.DevData ;
	ShadeTile(TileObject,SelectorpxXY) ; // shade tile
}

function SelectedTile() {
document.onmouseup = null ; 
// shows tile selection box
	TileStart = 1 ;
	
	SelectorXY = SolidCursor.XY ;
	SelectorrXY = SolidCursor.rXY ;
	 SelectorpxXY = ApplyOffset( CellToPixel( SelectorXY ) ) ;
	// SelectorpxXY =  CellToPixel( SelectorXY ) ;
	SetPos(ColliderStyle, SelectorpxXY ) ;
		
	with(ColliderStyle) {
	visibility = "visible" ;
						}
	FollowTestStyle.borderColor = "white";
	FollowTestStyle.backgroundColor = "orange";
	setOpacity(FollowTestStyle,5)
}
