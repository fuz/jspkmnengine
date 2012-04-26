// controls the internals of a battle

function InvisibleBattle() {
	// by avoiding all access to the interface, battles can happen without visibility or intervention
	this.SwitchPokemon = iSwitchPokemon ;
	
	// attacking:
	this.iAddAttack = iAddAttack ;
	this.Attack = iAttack ;
	
	this.AddStatus = iAddStatus ;
	this.RunStatus = iRunStatus ;
	this.StatusInjury = iStatusInjury ;
}

function iStatusInjury() {

}

function iAddStatus(Pokemon) {
	ApplyStatus(Pokemon) ;
}

function iRunStatus(Pokemon, Side) {
	var oldHP = Pokemon.Stats.Current[0] ;
	RunStatus(Pokemon, Pokemon.Status) ;
	var newHP = Pokemon.Stats.Current[0] ;
	
	if (newHP != oldHP) {
		this.StatusInjury(Pokemon, Side, newHP, oldHP) ;
	}
}



function getPokemonTypes(PokemonNumber) {
	return pokemon[PokemonNumber][1] ;
}

function iAttack(AttackNumber, From, Against) {
	// executes an attack against a Pokemon
	var Attack = From.Attacks.Type[AttackNumber] ;
	var AttackType = attacks[Attack][1] ;
	var AttackPower = attacks[Attack][2] ;
	
	var MyTypes = getPokemonTypes(From.Number) ;
	
	if (AttackType == MyTypes[0] || AttackType == MyTypes[1] ) { // check if attack is one of the two Pokemon types
	 TypeBonus = 1.5 ; // same type bonus
	} else {
	 TypeBonus = 1 ; // no type bonus
	}
	
	if (AttackType < 11) { // physical attack
		var Offensive = From.Stats.Current[1] ; // attack
		var Defensive = Against.Stats.Current[2] ;
	} else if (AttackType >= 11) { // special attacks
		var Offensive = From.Stats.Current[4] ; // special attack  
		var Defensive = Against.Stats.Current[5] ; // special defence
	}
	
	if (AttackPower > 0) { // if a damaging attack
		var EnemyTypes = getPokemonTypes(Against.Number) ;
		var Afflictions = pk_types[AttackType][2] ;
		var Effectiveness = 1 ;
		
		for (var cur_type = 0 ; cur_type < EnemyTypes.length ; cur_type++ ) {
			var TypeNumber = EnemyTypes[cur_type]-2 ;
			Effectiveness *= effect_list[ Afflictions[TypeNumber] ]  ;
		}
		
			var Damage = ((((2 * From.Level / 5 + 2) * Offensive * AttackPower / Defensive) / 50) + 2) * TypeBonus * Effectiveness * ranNum(85,100) / 100
		
		// alert(attacks[Attack][0] + "\nAttack Power: " + Offensive + "\nDefensive Power: " + Defensive + "\nEffectiveness: " + Effectiveness + "\nDamage: " + Damage) ;
		
		// var Damage = ((((2 * Level / 5 + 2) * AttackStat * AttackPower / DefenseStat) / 50) + 2) * STAB * Weakness/Resistance * RandomNumber / 100
		newHP = Against.Stats.Current[0] - Math.ceil(Damage) ;

		if (newHP < 0) {
			// pokemon fainted
			newHP = 0 ;
		}
		Against.Stats.Current[0] = newHP ;
	}
	
	
}

function ranNum(nFrom,nTo) {
return Math.floor(nFrom + (nTo-nFrom + 1) * Math.random()) ;
// returns a random number
}

function iSwitchPokemon() {
	
}

function iAddAttack(AttackNumber, From, Against, Side) { // side really shouldn't be here for now
	// adds attack to queue
	this.BattleQueue.push( [this.Attack, [AttackNumber, From, Against, Side] ] ) ; // adds attack to queue
	
	if (this.BattleQueue.length == 2 && this.BattleQueue[0][0] == this.Attack) {
	// an attack is already in the queue, swap it and continue
	 var EnemySpeed = Against.Stats.Current[3] ;
	 var MySpeed = From.Stats.Current[3] ;
	 if (MySpeed > EnemySpeed) { // compare speeds to determine who attacks first
		var nextTurn = this.BattleQueue[1] ;
		this.BattleQueue[1] = this.BattleQueue[0] ;
		this.BattleQueue[0] = nextTurn ;
	 }
	this.RunTurn() ;
	}
}
