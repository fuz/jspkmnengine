aCharacter = {
	// our crash test dummy of sorts
	Name:"Fuz",
	Sprite:2,
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
		XY:[4,4],
		Tile:0 // what tile the player is on
		}
	}

// raw pokemon object used to manipulate pokemon AND dump
// condition - confusion etc
// status - semipermanent until poke center/item

aPokemon = {
	Name: "Gyarados",
	Number:130,
	Level:100,
	Gender:2,
	Status: POISON,
	Condition:null,
	Nature:20,
	Stats: {
		Individual:[0,0,0,0,0,0],
		Effort:[0,0,0,0,0,0],
		Current:[],
		Maximum:[],
		Modifiers:[],
		Nature:[]
			},
	Attacks: {
		Type:[],
		MaxPP:[],
		CurrentPP:[]
			}
}

Pikachu = {
	Name: "Pikapi",
	Number:25,
	Level:100,
	Gender:2,
	Status:null,
	Condition:null,
	Nature:ADAMANT,
	Stats: {
		Individual:[11,0,0,0,0,0],
		Effort:[100,252,24,0,200,34],
		Current:[],
		Maximum:[],
		Modifiers:[],
		Nature:[]
			},
	Attacks: {
		Type:[],
		MaxPP:[],
		CurrentPP:[]
			}
}
DefaultAttacks(Pikachu) ;
DefaultAttacks(aPokemon) ;
