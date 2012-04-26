// controls the battle graphically

function GraphicalBattle() {
	this.SwitchPokemon = gSwitchPokemon ;
	this.Engage = gEngage ;
	this.Sendout = gSendout ;
	this.ThrowPokeballs = ThrowPokeballs ;
	this.SlideCharacters = SlideCharacters ;
	this.ShowBattleMenu = ShowBattleMenu ;
	
	this.RunStatus = gRunStatus ;
	this.AddStatus = gAddStatus ;
	this.StatusInjury = StatusInjury ;
	
	this.Fight = Fight ; // battle menu options
	this.Attack = gAttack ;
	this.RunTurns = gRunTurns ;
	
	this.RunTurn = RunTurn ; // runs a turn in the battle queue
	
	this.NextTurn = gNextTurn ;
	this.Faint = gFaint ;
}

function gAddStatus( Pokemon, StatusNumber, Side) {
	
}


function StatusInjury(Pokemon, Side, newHP, oldHP) {
	EnableText() ;
	if (newHP <= 0) { // pokemon is fainted
	 newHP = 0 ;
	 this.ClearQueue() ; // cancel further attacks, the pokemon is fainted
	 this.AddQueue( this.Faint, [Side, Pokemon] ) ;
	}
	var StatusName = statuses[Pokemon.Status].Name ;
	Side.DecreaseHealth(newHP, oldHP) ;
	Put( [Pokemon.Name,"is hurt by its",StatusName], [RunQueue, this] ) ;
}

function gRunStatus(Pokemon, Side) {
	if ( Pokemon.Status != null ) {
	 this.iRunStatus(Pokemon, Side) ;
	}
	else {
		this.RunQueue() ;
	}
}

function gNextTurn() {
	for (var EachSide = _left ; EachSide <= _right ; EachSide++) {
	if ( !isPokemon(SIDES[EachSide]) ) {	
		if ( STATE.Sides[EachSide] == STATE.ActiveCharacter ) {
			 ShowBattleMenu( EachSide, SIDES[EachSide] ) ;
		}
		
	}
	}
}

function RunTurn() {
	// runs the player's actions
	if (this.BattleQueue.length > 0) {	// turns remain
		var nextTurn = this.BattleQueue.shift() ;
		nextTurn[0].apply( this, nextTurn[1] ) ;
	}
	else {
		this.NextTurn() ;	
	}
}

function gRunTurns() {
	for (var cur_event = 0 ; cur_event < this.BattleQueue.length ; cur_event++) {
	 	var Event = this.BattleQueue[cur_event] ;
		this.AddQueue( Event[0], Event[1] ) ;
	}
	this.ResetBattleQueue() ;
	this.RunQueue() ;
	this.AddQueue( this.NextTurn,[]) ;
	this.Turns++ ;
}

function gAttack(AttackNumber, From, Against, Side) {
// runs graphical attack on enemy pokemon
	EnableText() ;
	var oldHP = Against.Stats.Current[0] ;
	this.iAttack(AttackNumber, From, Against) ; // run the attack
	var newHP = Against.Stats.Current[0] ;
	
	Side.Enemy.DecreaseHealth( newHP, oldHP ) ;
	var AttackID = From.Attacks.Type[AttackNumber] ;


	if (newHP == 0) { // pokemon fainted
		this.Faint(Side, Against) ;
		return ;
	}
	this.AddQueue( this.RunStatus, [From, Side] ) ;
	Put([From.Name,"uses",attacks[AttackID][0] ],[RunQueue,this]) ;
	this.AddQueue( this.RunTurn,[] ) ;
	
}

function ResetBattleQueue() {
	this.BattleQueue = [] ;	
}

function gFaint(Side, Pokemon) {
	// pokemon faints
	EnableText() ;
	ResetBattleQueue() ;
	Put( [Pokemon.Name,"has fainted!"] ) ;
}

function Fight(Side) {
	SHOW( SIDES[Side].AttackList ) ;
}

function gEngage() {
	// the narrator engages members of a battle
	var Message = [] ;	
	for (var EachSide = _left ; EachSide <= _right ; EachSide++) {
		if ( isPokemon(SIDES[EachSide]) ) {
			Message.push("Wild",getPokemonSpecies(SIDES[EachSide].Pokemon) ) ;
		} else {
			Message.push("Trainer",SIDES[EachSide].Character.Data.Name) ;
			SIDES[EachSide].UpdateTeam() ;
			SIDES[EachSide].SlideTeam() ; // slide team into battle
			// Playback( SIDES[EachSide].Gender,pokeball,EachSide) ; // animate gender into screen
		}
		Message.push("and") ;
	}
	Message.pop() ;
	Message.push("are battling!") ;
	Put(Message, [this.SlideCharacters, this] ) ;
}

function ShowBattleMenu(Side, My) {
	EnableText() ;
	Put(["What should",My.Pokemon.Name,"do?"]) ;
	// show the battle menu
	SHOW(My.BattleMenu) ;
	// this.RunQueue() ; // continue
}

function SlideCharacters() {
	
for (var EachSide = _left ; EachSide <= _right ; EachSide++) {
	var Me = SIDES[EachSide] ;
	if (!isPokemon(Me) ) {
		this.AddQueue( Playback, [ Me.ActivePokemon,trainerslideout,EachSide, [RunQueue, this] ] ) ;
		this.AddQueue( this.gSendout, [Me] ) ;
		
		// alert(STATE.ActiveCharacter + " " + STATE.Sides[EachSide] + " " + EachSide ) ;
		
		
		
		if ( STATE.Sides[EachSide] == STATE.ActiveCharacter ) {
			var PlayerSide = EachSide ;
		}
	}
}
 
if (PlayerSide) {
 	this.AddQueue( this.ShowBattleMenu, [PlayerSide, SIDES[PlayerSide] ] ) ;
}
	this.RunQueue() ;

}

function ThrowPokeballs(Side) {
	 this.gSendout( SIDES[Side] ) ;
}

function gSendout(Me) {
	EnableText() ;
	
	Me.SwitchToPokemon() ;
	Me.UpdateAttacks() ; // update the attack list
	HIDE(Me.ActivePokemon) ;
	
	Playback( Me.GoPokeball, pokeball, Me.Side, [gSwitchPokemon,this,[Me,0]] ) ;
	
	if ( STATE.Sides[Me.Side] == STATE.ActiveCharacter ) {
		Put(["Go", Me.Pokemon.Name,"!"], [RunQueue,this] ) ;
	} else {
		Put([Me.Character.Data.Name,"sends out",Me.Pokemon.Name], [RunQueue,this] ) ;
	}
}

function gSwitchPokemon(Who, TeamNumber) {
	HIDE(Who.GoPokeball) ;
	SHOW(Who.ActivePokemon) ;
}
