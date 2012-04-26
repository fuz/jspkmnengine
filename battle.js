var ITEM = 1 ;
var ATTACK = 0 ;


function BATTLE(BattleMode) {
	this.Turns = 0 ;
	this.Left = SIDES[_left] ;
	this.Right = SIDES[_right] ;
	
	this.Queued = [] ;
	this.RunQueue = RunQueue ;
	this.AddQueue = AddQueue ;
	this.ClearQueue = ClearQueue ;
	
	this.ResetBattleQueue = ResetBattleQueue ;
	
	this.BattleQueue = [] ;

	this.Left.Enemy = this.Right ;
	this.Right.Enemy = this.Left ;
	

	
	// graphical modes
	this.gSwitchPokemon = gSwitchPokemon ;
	this.gEngage = gEngage ;
	this.gSendout = gSendout ;
	
	this.AddAttack = iAddAttack ; // there is nothing graphical about adding an attack to the queue
	
	// invisible
	this.iRunStatus = iRunStatus ;
	this.iAddStatus = iAddStatus ;
	this.iAttack = iAttack ;
	this.gAttack = gAttack ;
	

	this.iSwitchPokemon = iSwitchPokemon ;
	
	if (BattleMode) {
	 this.setBattleType = InvisibleBattle ;
	} else {
	 this.setBattleType = GraphicalBattle ;
	}
	
	this.setBattleType() ;
	
	this.Engage() ;
	
	this.Setup = SetupBattle ;		// used to set up graphical UI
	this.Draw = DrawBattle ;
}

function AddQueue(Run, Param) {
	this.Queued.push([Run,Param]) ;

}

function ClearQueue() {
	this.Queued = [] ;
}

function RunQueue() {
	if (this.Queued.length > 0) {
	 var Instruction = this.Queued.shift() ;
	 Instruction[0].apply(this, Instruction[1]) ;
	}
}


commandlist = [
			   [Fight, "Fight"],
			   [PokemonList, "Pokemon"],
			   [Bag,"Bag"],
			   [Run,"Run"]
			   ] ;

function Bag() {

}

function Run() {
	
}

function PokemonList() {
	
}

function DrawBattle() {
	for (var EachSide = _left ; EachSide <= _right ;	EachSide++) {
		SIDES[EachSide].SlideTeam() ;
		Playback( SIDES[EachSide].Gender,pokeball,EachSide) ;
	}
}

function ApplyStatus(Pokemon, StatusNumber) {
	// applies a status to a pokemon
	var StatusData = statuses[ StatusNumber ].UponGetting ;
	if (StatusData.NewStat) {
		var StatNumber = StatusData.NewStat.length-1 ;
		var modifiedStat = Pokemon.Stats.Current[StatNumber] * StatusData.NewStat[StatNumber] ;
		Pokemon.Stats.Current[StatNumber] = Math.ceil(modifiedStat) ;
	}
}

function RunStatus(Pokemon, StatusNumber) {
	// applies perturn status effects to Pokemon
	var StatusData = statuses[ StatusNumber ].PerTurn ;
	
	if ( StatusData && StatusData.ReduceByMax ) {
		var StatNumber = StatusData.ReduceByMax.length-1 ;
		var ReduceBy = Pokemon.Stats.Maximum[StatNumber] * StatusData.ReduceByMax[StatNumber] ;
		
		var modifiedStat = Pokemon.Stats.Current[StatNumber] - ReduceBy ;
		Pokemon.Stats.Current[StatNumber] = Math.floor( modifiedStat ) ;
	}
	
}

function SetupBattle() {
	ThisSide = this ;
	var ControlledSide ;
	switch(STATE.ActiveCharacter) {
		case STATE.Sides[0]:
			this.Controlled = SIDES[_left] ;
			this.Enemy = SIDES[_right] ;
		
	break ;	case STATE.Sides[1]:
			this.Controlled = SIDES[_right] ;
			this.Enemy = SIDES[_left] ;
	break }
	
	var Message ;

if ( isPokemon(this.Enemy) ) {
		Message = ["Wild",getPokemonSpecies(this.Enemy.Pokemon),"appeared!"] ;
	} else {
		Message = ["Trainer",this.Enemy.Character.Data.Name,"wants to battle!"] ;
		DrawBattle() ;
	}
	
	Put(Message, Sendout ) ;
	this.Enemy.UpdateTeam() ;
	this.Controlled.UpdateTeam() ;
	
	function DrawAttacks() {
		ShowText() ;
		ThisSide.Controlled.SwitchToPokemon() ;
		ThisSide.Controlled.UpdateAttacks() ;
		SHOW( ThisSide.Controlled.AttackList ) ;
		
		// update attacks and other UI related to battle beginning
		// might save sides state data in the STATE.Sides[0] so that _left and _right match	
	}
	
}


/*
Attack list

aPokemon.Number = 266 ;
DefaultAttacks(aPokemon) ;
SHOW(SIDES[_left].AttackList) ;
SIDES[_left].UpdateAttacks();
ClearOutput()
Put([pokemon[aPokemon.Number][0]])
*/