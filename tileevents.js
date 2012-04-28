// stores generic events objects for tiles
TileEvents = new Array() ;

// arguments: tile data, additional arguments from the tile (they SHOULD exist) for the ontop


TileEvents[1] = function(){
	this.Action={
		Description:["A rock?"]
	}
}

TileEvents[4] = function(t){
	this.Action={
		Description: ["It's a",t.Name,"."]
			},
	this.Ontop={
		Description: "Hmm, this is a comfortable chair! Better not get distracted though."
			}
} ;
			
TileEvents[7] = function(){
	this.Action={
		Description:["A potted plant."]
	}
}

TileEvents[10] = function(t,EnemyCharacter) { // battle
	this.Ontop={
		Battle:[ Confrontation, [EnemyCharacter] ]
	}
}
