// attack data
// stores secondary effects of an attack

// status effects:
BURNED = 0 ;
FREEZE = 1 ;
PARALYSIS = 2 ;
POISON = 3 ;
BPOISON = 4 ; // extra strong poison
SLEEP = 5 ;

statuses = [] ;

statuses[BURNED] = {
	Name:"burn",
	UponGetting:{
		NewStat:[,.5] // reduce attack by half
		},
	PerTurn:{
		ReduceByMax:[1/8] // reduce hp by 1/8
	}
}

statuses[PARALYSIS] = {
	Name:"paralyzed",
	UponGetting:{
		NewStat:[,,,.75] // reduce speed by 25%
	}
}

statuses[POISON] = {
	Name:"poison",
	PerTurn:{
		ReduceByMax:[1/8] // reduce hp by 1/8
	}
}