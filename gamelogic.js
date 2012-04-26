// bridges the map and pokemon logic together

function GAME() {
	INTERFACE = new INTERFACE() ;
	SIDES = [,new SIDE(_left), new SIDE(_right) ] ;
}

function init() {

	new GAME() ;
	
	FollowTest[_style].width = X + Px ; FollowTest[_style].height = Y + Px;
	// ActivateTile(0) ;
	var player = new CHARACTER(aCharacter) ;
	var playern = player.Number 	
	ActivateCharacter(playern) ;
	STATE.ThePlayer = playern ;
	character_pool[STATE.ActiveCharacter].Sprite.Render() ;
	
	SetCharacterPlace( ActiveCharacter , 0 , 0) ; // teleport player
	
	changeinterface(2) ;
	HIDE(INTERFACE.Continue ) ;
	HideMore() ;
	// AcceptKeys() ;
	// INTERFACE.ToggleText(0) ; // turn text off
}

function Confrontation(Enemy) {
	// NPC confronts other player
	var Enemy = character_pool[Enemy] ;
	
	Enemy.Sprite.ClearSight() ;
	// prevent LoS from calling again, from enemy trainer themselves, as they walk on it
	
	var enemyInfront = GetObjectAt( GetXYinFront(Enemy.Data.Positioning.XY,
				 Enemy.Data.Positioning.Facing) ) ;
	
	if ( isPlayer(enemyInfront) ) { // player is directly infront
		// alert("player is directly infront!") ;
		this.Sprite.SetDirection( Positions[Enemy.Data.Positioning.Facing][2] ) ;
		Apprehend(this, Enemy) ;
		return ;
	}
	
	var newEnemyPos = GetXYinFront(this.Data.Positioning.XY,
				this.Data.Positioning.Facing
				) ;
	
	EnemySprite = Enemy.Sprite ;
	
	// this.Sprite.AddQueue( Enemy.Sprite.WalkTo,[newEnemyPos] ) ;
	EnemySprite.AddQueue( SpriteWalkTo, [newEnemyPos] ) ;
	// walk to the enemy
	EnemySprite.AddQueue(Apprehend,[this,Enemy]) ;
	
	EnemySprite.RunQueue() ;
	
	// character approaches player
	// alert([this.Data.Name,"vs",character_pool[Enemy].Data.Name]) ;

}

function Apprehend(Me, Enemy) {
		Enemy.Sprite.SetDirection( Positions[Me.Data.Positioning.Facing][2] ) ;
		// make enemy face player
		//CharacterAction(Enemy.Number) ;
		Enemy.Action() ;
}

function CharacterAction(CharacterNumber) {
// an action was issued by a character, lets handle it

	// var Me = character_pool[CharacterNumber] ;
	Me = this ;
	var Infront = GetXYinFront(
				Me.Data.Positioning.XY,
				Me.Data.Positioning.Facing
				) ;
	Infront = GetObjectAt(Infront) ;
	
	if (isPlayer(Infront)) {
		
		var Their = character_pool[ Infront[0]] ;
		EnableText() ;
		INTERFACE.SetEncounterImage(_left, TrainerImage(Their.Data.Sprite) ) ;
		
		Their.Sprite.SetDirection( /*Their.Sprite.What,*/ Positions[Me.Data.Positioning.Facing][2] ) ;
		
		Put( ["Speaking to",Their.Data.Name] ) ;
		return ;
		
		}
	
	else {
		if (Infront > 0 && TileEvents[Infront]) {
			InfrontObject = GetTileObject(Infront) ;
		}
		else return ;
	}
	
	if ( CharacterNumber == STATE.ActiveCharacter ) {
	

			var TileEvent = new TileEvents[Infront](InfrontObject) ;
			// create an instance of the tile infront
			
			InvokeTile(TileEvent, CharacterNumber, Infront) ;
			delete TileEvent ;
		}
}



function InvokeTile(TileInstance, Me, TileNumber) {
	if (!TileInstance.Action) return ;
	
	var ThisTile = TileInstance.Action ;
	
	if (ThisTile.Description) {
		INTERFACE.ClearEncounterImage() ;
		EnableText() ;
		Put( ThisTile.Description ) ;
	}
}

function OnTile(TileInstance, CharacterNumber, TileNumber) {
	if (!TileInstance.Ontop) return ; // tile item has no ontop event
	
	var ThisTile = TileInstance.Ontop ;
	
	// window.status = ThisTile ;
	
	if (ThisTile.Description) {
		INTERFACE.ClearEncounterImage() ;
		ShowText() ;
		Put( [ ThisTile.Description ] ) ;
	}
	else if (ThisTile.Battle) {
		ThisTile.Battle[0].apply( character_pool[CharacterNumber], ThisTile.Battle[1] ) ;	
	}
}

function ActiveCharacterAction() {
	// CharacterAction(STATE.ActiveCharacter) ;
	ActiveCharacter.Action() ;
	// an action issued by character controlled by the player
}

function CHAR(NEWCHAR) {
	var NextChar = character_pool.length ;
	NEWCHAR.Number = NextChar ;
	character_pool[NextChar] = NEWCHAR ;
	return NextChar ;
}

function CHARACTER(Raw) { // create character from raw object
	this.Mode = NPCCharacter ; // computer controlled
	this.Mode() ;
	
	var NextChar = character_pool.length ;
	this.Number = NextChar ;
	
	character_pool[NextChar] = this ;
	
	this.nAction = nAction ; //
	this.Say = CharacterSpeech ;
	
	this.Listen = ListenTo ;
	
	this.Data = Raw ;
	// activepokemon refers to the team position
	// team position refers to pokemons
	
	var Container = document.createElement("div") ;
	var PlayerImage = new Image() ;
	PlayerImage.src = _blank ;
	Container.appendChild(PlayerImage) ;
	/* Container = */ Mapper[_pageobj].insertBefore(Container, document.getElementById("player") ) ;
	Container.className = "player" ;
	PlayerImage = PageObject(PlayerImage) ;
	Container = PageObject( Container ) ;
	// sprite creation should probably be moved to the sprite object (we can have a sprite pool)
	
	
	for (var curpoke=0; curpoke < this.Data.Pokemons.length ; curpoke++) {
	 UpdateStats( this.Data.Pokemons[curpoke] ) ;
	}
	// update pokemon's stats
	
	this.Sprite =  new Sprite(
					Raw.Sprite, // what the sprite will look like
					Container, // what page object to draw 
					Raw.Positioning, // its data
					this.Number,
					PlayerImage) ; 

	this.ChangePokemon = ChangePokemon ;
	this.getActive = getActive ;
	this.getTeam = getTeam ;
	this.Deactivate = DeactivatePokemon ;
	this.Activate = ActivatePokemon ;
	
	this.UpdatePokemon = UpdatePokemon ;
	this.Position = PositionCharacter ;
	this.Dispose = DisposeCharacter ;
	
	this.SetXY = SetCharacterXY ;
	this.SetTile = SetTile ;
	
	this.AddPokemon = AddPokemon ;
	// this.Sprite.Render() ; // add player's sprite to screen
}

function DisposeCharacter() {
	// alert(this.Number + " " + STATE.ActiveCharacter);
	// assert( STATE.ActiveCharacter != this.Number , "erased character remains in control!" ) ;
	
	this.Sprite.Destroy() ;
	delete character_pool[this.Number] ;
	// probably gonna replace with a character pool
}

function PositionCharacter(Position, Tile) {
	if (Tile >= 0) this.SetTile(Tile) ;
	this.SetXY(Position) ;
	if (this.Sprite.Active) this.Sprite.Center() ;
}

function SetTile(TileNumber) {
	this.Data.Positioning.Tile = TileNumber ;
}

function SetCharacterXY(XY) {
	ClearCharacter(this.Data.Positioning.XY) ; // remove previous position
	this.Data.Positioning.XY = XY ;
	this.Sprite.Render() ; // repositions the player on screen
}

function UpdatePokemon(PokemonNumber) {
	UpdateStats( this.Data.Pokemons[PokemonNumber] ) ;
}

function DeactivatePokemon() {
	this.Data.ActivePokemon = null ;
}

function ActivatePokemon(NextActive) {
	if (!NextActive) var NextActive = 0 ; // first pokemon on team
		
	if ( this.getTeam(NextActive).Stats.Current[0] >= 1 ) {
		this.Data.ActivePokemon = NextActive ;
		return true ;
	}
	return false ;
}

function AddPokemon(Pokemon) {
	// add pokemon to character, will join team if enough team space available
	
	var NextPokemon = this.Data.Pokemons.length ;
	var NextTeam = this.Data.Team.length ;
		
	this.Data.Pokemons[ NextPokemon ] = Pokemon ;
	// add Pokemon to list
	
	this.UpdatePokemon(NextPokemon) ;
	// update its stats - since it may have been randomly generated
	
	if (NextTeam <= TeamSize) { // pokemon can fit into team
	 this.Data.Team[NextTeam] = NextPokemon ; 
	 return NextTeam ; // pokemon is now also in team, so the interface needs to be updated
	}
	return false ;
}

function getTeam(TeamNumber) {
	return this.Data.Pokemons[
							  this.Data.Team[TeamNumber]
							  ] ;
}

function getActive() {
	// if (isNaN(this.Data.ActivePokemon) ) return false ;
	return this.Data.Pokemons[
							  this.Data.Team[this.Data.ActivePokemon]
							  ] ;
}

function ChangePokemon(TeamNumber) {
	if ( this.Data.Team[TeamNumber] >= 0 && !this.Data.cantSwitch) {
	 return this.Activate(TeamNumber) ; // succesful Pokemon change
	}
	return false ;
}



function ENGAGE(left, right, state) {
		// engages the battleshell with characters (which may have activepokemon) or wild pokemon
	
	STATE.Sides = [state, left, right] ;
	
	if (left >= 0) {
	 	SIDES[_left].Character = character_pool[left] ;
	} else {
		SIDES[_left].Pokemon = left ;
	}
	
	if (right >= 0) {
		SIDES[_right].Character = character_pool[right] ;
	} else {
		SIDES[_right].Pokemon = right ;
	}
	
	SIDES[_left].Update() ;
	SIDES[_right].Update() ;
	
	// InvokeBattle() ;
	ActiveBattle = new BATTLE() ;
	// ActiveBattle.Setup() ;
}

function CONFRONT(left, right) {
	
	
	SIDES[_left].Character = character_pool[left] ;
	SIDES[_right].Character = character_pool[right] ;
	
	SIDES[_left].Update() ;
	SIDES[_right].Update() ;
	// update the interface to reflect loaded characters
}

/*
function POKEMON(Raw) { // pokemon encapsulator
	// verify raw pokemon data
	Raw.Level = (Level>=LowestLevel && Level<=HighestLevel) ? Level : LowestLevel
	this.Data = Raw ;
	
	this.Update = UpdateStats;
} */

