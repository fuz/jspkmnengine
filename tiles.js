// Tiles Document
TileData = new Array() ;
TileObject = new Array() ;
TilePlaces = new Array() ;


// filename, global offset, size, music
Tiles = [
		 ["safari.png",[0,-3],[80,80]],
		 ["mentorlab.png",[0,0],[13,13], 2]
		 ] ;

TilePlaces[0] = [ // x,y
				 [72,74] // entrance
				 ] ;

TilePlaces[1] = [
				 [6,4]
				 
				 ] ;

TileNpcs = new Array() ;
// contain a list of npcs for each tile and their respective positions on the map

TileNpcs[0] = [ // x, y, character number, eye range, behaviour
			[69,74, 0, 3, TRAINER ] // timo
			] ;

TileNpcs[1] = [
			[5,4, 1, 0, MENTOR] // mentor
			] ;

// name, [x,y], entirely solid, solidity direction

TileItems = [
	{name: "Normal", xy: [1,2], solid: false, dsolid: false},
	{name: "Rock", xy: [1,1], solid: true, dsolid: false },
	{name: "Tree", xy: [2,2], solid: true, dsolid: false },
	{name: "Crates", xy: [2,2], solid: true, dsolid: false },
	{name: "Chair", xy: [1,1], solid: false, dsolid: false },
	{name: "Pokeball Computer", xy: [2,2], solid: true, dsolid: false },
	{name: "Bookshelf", xy: [2,3], solid: true, dsolid: false },
	{name: "Potted Plant", xy: [1,1], solid: true, dsolid: false },
	{name: "Horizontal Desk", xy: [2,1], solid: true, dsolid: false },
	{name: "Vertical Desk", xy: [1,3], solid: true, dsolid: false },
	{name: "Line Of Sight", xy: [0,0], solid: false, dsolid: false },
	{name: "Grassland", xy: [4,4], solid: false, dsolid: false, wildpokemon: true },
	{name: "Water", xy: [5,5], solid: true, dsolid: false }
];

NonePresent = [];

ValidGameReference = function(reference) {
	return ((typeof reference === "undefined" || reference < 0) ? undefined : reference);
};

isValidReference = function(reference, what) {
	return (typeof reference !== "undefined" && reference >= 0);
}

TileContents = function(data) {
	if (data && data.length) {
		this.Character = ValidGameReference( data[0] ) ;
		this.TileItem = ValidGameReference( data[1] ) ;
		this.LoS = ValidGameReference( data[2] ) ;
	}
	else if (data >= 0) {
		this.TileItem = ValidGameReference ( data );
	}

	this.hasCharacter = function() { return isValidReference(this.Character) } ;
	this.hasTileItem = function() { return isValidReference(this.TileItem) } ;
	this.hasLoS = function() { return isValidReference(this.LoS) } ;
};

GetTileContents = function(data) {
	return new TileContents(data);
};

ToRawContents = function(data) {
 if (data.hasCharacter() || data.hasLoS()) {
	return [data.Character, data.TileItem, data.LoS];
 } else {
	return data.TileItem;
 }
};

isPlayerPresent = function (TileContents) {
	return (TileContents.Character >= 0 ? true : false); 	
}

// TileData[0] = new Array(6210) ;
TileData[0] = [,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,2,,2,,2,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,,,,,,,2,,2,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,,2,,2,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,,,,,,2,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,2,,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2] ;

TileData[1] = [6,,,,,,,,,,,,,,,,,,,8,,8,,,,,,,7,,,,,,,,,,,,,,,4,,,,,3,,,,,,,,,,,,,,,,,6,,6,,,,,,,,,,,,,,,,,,,,,5,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,9,,,,,,,,,,9,7,,,4,,,,,,,,4,,,,,,,,,,,,,,,,,,,7,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1] ;
/*
[-1,-1], // North West 0
[0,-1], // North 1
[1,-1], // North East 2
[-1,0], // West 3
[1,0], // East 4
[-1,1], // South West 5
[0,1],  // South 6
[1,1] // South East 7
*/
