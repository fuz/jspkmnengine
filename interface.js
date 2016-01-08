// interface.js, bridges gamelogic and pokelib to the interface

var PausedText ;
var FinishedText ;

interfaces = [ // interface names, turn off, turn on
			  ["battleshell",,[EnableText]],
			  ["map",[DisableMap], [EnableMap] ],
			  ["titlescreen",,[DisableText]],
			  ["newgame",,[EnableText,AskToChoose]],
			  ["loginscreen",,[EnableText]],
			  ["loadgame",,[EnableText]],
			  ["inventories",[DisableInventory],[EnableInventory]]
			  ] ;

function INTERFACE() {
	// player independant
	var BattleShell = document.getElementById("battle") ;
	this.BattleShell = [BattleShell, BattleShell.style] ;

	var Conversation = document.getElementById("conversation") ;
	this.Conversation = [Conversation, Conversation.style] ;
	
	var TextOutput = document.getElementById("textoutput") ;
	this.Convo = TextOutput ;
	
	var Arrow = document.getElementById("arrow") ;
	this.MoreText = [Arrow,Arrow.style] ;
	
	var Continued = document.getElementById("continue") ;
	this.Continue = [Continued, Continued.style] ;
	
	this.EncounterSide = [] ;
	this.RenderZoomedEncounters = RenderZoomedEncounters ;
	
	this.SetEncounterImage = SetEncounterImage ;
	this.ClearEncounterImage = ClearEncounterImage ;

	this.RenderText = RenderText ;
	this.SetBack = SETBACK ;
	this.ToggleText = ToggleConversation ;

	this.Output = Output ;
	
	this.RenderText() ;
	this.RenderZoomedEncounters(_left) ;
	this.RenderZoomedEncounters(_right) ;
	RenderNewGames() ; // game list
	RenderSavedGames() ;
	// this.PutText("lol") ;
}

function ClearOutput() {
	// clear out text from texoutput
	INTERFACE.ClearEncounterImage() ;
	var len = INTERFACE.Convo.childNodes.length ;
	for( var i=len - 1; i > -1; i-- ) // taken from website, forgot where
	 INTERFACE.Convo.removeChild(INTERFACE.Convo.childNodes[i]) ;
}

function Output(Input, Finished, Depth, CurLength, Element, Continue) {
	var TextString = Input[Depth] ;
	var Start = 0 ;
	
	if (Continue > 0) { 
		Start = Continue ;
		// window.status = "continuing" ;
	}

	if (typeof TextString == "string") {
		TextString += " " ;
		if (!Element) {
				if (Continue === undefined)  {
					CurLength = 0 ;
				}
				var te = this.Convo.appendChild( document.createElement("span") ) ;
				Element = te.appendChild(
									   document.createTextNode( new String() )
									   ) ;
				
			}
		if (CurLength < TextString.length) {
			// window.status ="L " + TextString.length + " " +  Start + "/" + (CurLength+1) + Element.nodeValue
			Element.nodeValue = TextString.substring(Start, ++CurLength) ;
		} if (CurLength == TextString.length) {
			Depth++ ;
			Element = undefined ;
		}
	}
	
	else {
		this.Convo.appendChild( TextString ) ;
		Depth++
		Element = undefined ;
		}
		
	if (this.Convo.offsetHeight >= 54 && CurLength-Start > 120 && Depth < Input.length) {
	 Element = 0 ;
	 PauseText( [Input, Finished, Depth, CurLength, Element, CurLength] ) ;
	 return ;
	}
		
	if (Depth < Input.length) {
	 add_action(Output, [Input, Finished, Depth, CurLength, Element, Continue], this) ;
	} else if (Finished) {
	 FinishText(Finished) ;
	}
}

function FinishText(Do) {
	// will be called when output has finished
	FinishedText = Do ;
	SHOW(INTERFACE.Continue) ;
}

function DismissText() {
	DisableText() ;
	HIDE(INTERFACE.Continue) ;
	if (FinishedText.length) {

	 if (!FinishedText[1])
	 	FinishedText[1] = this ;
	 FinishedText[0].apply(FinishedText[1],[]) ;
	}
	else FinishedText() ;
	FinishedText = null ;
}

function PauseText(Data) {
	// prevent more text from reaching screen
	PausedText = Data ;
	ShowMore() ;
}

function PlayText() {
	// unpauses paused text so it continues to flow
	HideMore() ;
	ClearOutput() ;
	
	add_action(Output, PausedText, INTERFACE) ;
	// continue animation of text
	
	PausedText = undefined ;
	// we delete the paused text
}

function ActionButton() {
	// interact with environment or accept and dismiss menus and text
	if (PausedText)
	 PlayText() ;
	else if (FinishedText) {
		DismissText() ;
	} else if (STATE.ActiveInterface == 1) { // if on map
	 ActiveCharacterAction() ;
	}
}

function HideMore() {
	HIDE(INTERFACE.MoreText) ;
}

function ShowMore() {
	SHOW(INTERFACE.MoreText) ;
}

function SHOW(What) {
	What[_style].display ="" ;
}

function HIDE(What) {
	What[_style].display = "none" ;
}

function ToggleConversation(OnOff) {
	if (OnOff) this.Conversation[_style].display = ""
	else this.Conversation[_style].display = "none" ;
}

function RenderText() {
	var TextArea = document.getElementById("textoutput") ;
	
	this.TextArea = [TextArea, TextArea.style] ;

	var Text = TextArea.appendChild( document.createTextNode( new String() ) ) ;
	
	// Text.nodeValue = "testing" ;
}

function SETBACK(BackType) {
	// change background of battleshell
	SetBack(this.BattleShell, Img+"bgs/" + BackTypes[BackType] + ".png") ;
}

function SIDE(LeftOrRight) {
	// handles interactions to page objects
	this.Side = LeftOrRight ;
	this.Character = null ;
	this.Pokemon = null ; // wild pokemon
	
	this.Render = RenderSide ; // adds objects to screen
	this.Update = UpdateSide ; // updates those objects with character data
	
	this.Name = [] ;
	this.Team = new Array(TeamSize+1) ;

	var PokemonArea = document.getElementById("poke" + LeftOrRight) ;
	this.PokemonArea = [PokemonArea, PokemonArea.style] ;

	this.InventoryArea = document.getElementById("inventories") ;

	/* Battle Shell Objects */
	this.ActivePokemon = [] ;	// sprite of pokemon/character
	this.PokemonBack = [] ;		// 
	this.GoPokeball = [] ;		// pokeball thrown to catch/release
	this.Mini = [] ;			// mini icon
	this.Gender = [] ;			// gender icon
	this.Name = [] ;
	
	this.Health = [] ;
	this.HealthBar = [] ;
	
	this.AttackList = [] ;
	this.Attacks = [] ; // attack cell, attack name, current pp, maximum pp
	this.AttackLabels = [] ;
	this.CurrentPP = [] ;
	this.MaxPP = [] ;
	
	this.GameMenu = [] ;
	this.MenuArea = [] ;
	
	this.PocketLabel = [] ;	// label for pockets
	this.Pockets = [] ;		// contains label and pocketlist
	this.PocketList = [] ;	// table containing each pocket
	this.PocketItems = [] ;	// table containing items for each pocket
	
	
	/* Object Renderers */
	
	
	this.RenderName = RenderName ;
	this.RenderTeam = RenderPokeballs ;
	this.RenderMini = RenderMini ;
	this.RenderGender = RenderGender ;
	this.RenderPokemons = RenderPokemons ; 
	this.RenderAttacks = RenderAttacks ;
	this.RenderHealthBars = RenderHealthBars ;
	this.RenderGoPokeball = RenderGoPokeball ;
	this.RenderBattleMenu = RenderBattleMenu ;
	this.RenderInventory = RenderInventory ;
	this.RenderPocket = RenderPocket ;
	this.RenderPocketItems = RenderPocketItems ;
	
	this.RenderMainMenu = RenderMainMenu ;
	
	this.Render() ;

	/* Side Interface:
	Capitals are used to differentiate between character and UI functions */
	
	this.SwitchToPokemon = SwitchToPokemon ;
	this.SwitchToCharacter = SwitchToCharacter ;
	
		this.UpdatePokemonDisplay = UpdatePokemonDisplay ;
		this.UpdateCharacterDisplay = UpdateCharacterDisplay ;
		
		this.UpdatePokemonName = UpdatePokemonName ;
		this.UpdateCharacterName = UpdateCharacterName ;
		
		this.UpdatePokemonGender = UpdatePokemonGender ;
		this.UpdateCharacterGender = UpdateCharacterGender ;


	this.AddPokemon = ADDPOKEMON ;
	this.UpdateCurrentPP = UpdateCurrentPP ;
	this.UpdateMaximumPP = UpdateMaximumPP ;
	this.UpdateLabel = UpdateLabel ;
	this.UpdateAttack = UpdateAttack ;
	this.UpdateAttacks = UpdateAttacks ;
	this.SetHealth = SetHealth ;
	
	this.DecreaseHealth = DecreaseHealth ;
	
	this.UpdateInventory = UpdateInventory ; // cycles through every pocket and loads items to screen
	this.UpdateInventoryPocket = UpdateInventoryPocket ;
	this.UpdateItem = UpdateItem ;
	this.NewItem = NewItem ;
	
	// Raw Setters
	this.SetName = SETNAME ;
	this.SetGender = SETGENDER ;
	
	// graphic setters
	this.ChangePokemonImage = ChangePokemonImage ;
	this.ChangeTrainerImage = ChangeTrainerImage ;
	
	
	this.UpdateTeamMember = SETTEAM ;
	this.UpdateTeam = UPDATETEAM ;
	this.SlideTeam = SlideTeam ;
	this.SetGround = SETGROUND ;
}

function UpdateInventory() {
	// updates all pockets within the inventory
	for (var cur_pocket = 0 ; cur_pocket < item_pockets.length ; cur_pocket++) {
	 this.UpdateInventoryPocket(cur_pocket) ;	
	}
}

function UpdateInventoryPocket(PocketNumber) {
	
	
	if ( !this.Character.Data.Items[PocketNumber] ) return ; // no items within pouch
	
	
	var ItemCount = this.Character.Data.Items[PocketNumber].length ;
	
	var Pocket = this.PocketItems[PocketNumber][_pageobj] ;
	var cur_item;
	for (cur_item = 0 ; cur_item < ItemCount && cur_item < Pocket.rows.length ; cur_item++) {
	// reuse previous item slots
	 this.UpdateItem( Pocket, PocketNumber, cur_item ) ;
	}
	
	
	
	for (var cur_item_offset = cur_item ; cur_item_offset < ItemCount; cur_item_offset++) {
	// these are new items
	 this.NewItem(PocketNumber) ;
	 this.UpdateItem(Pocket, PocketNumber, cur_item_offset) ;
	}
	
}

function UpdateItem(PocketObj, PocketNumber, ItemPosition) {
	var ItemNumber = this.Character.Data.Items[PocketNumber][ItemPosition] ;
	var ItemAmount = this.Character.Data.ItemQuantity[PocketNumber][ItemPosition] ;
	
	var ItemArea = PocketObj.rows[ItemPosition] ;
	var ItemIcon = ItemArea.cells[0] ;
	
	ItemIcon.firstChild.src = Img + "sprites/items/rsitem" + ItemNumber + ".png" ;
	
	var ItemName = ItemArea.cells[1] ;
	ItemName.firstChild.nodeValue = poke_items[ItemNumber][0] ;
	var ItemQuantity = ItemArea.cells[2] ;
	ItemQuantity.firstChild.nodeValue = "x" + ItemAmount ;
	
}

function NewItem(PocketNumber) {
	// adds an item to the visible list
	var Pocket = this.PocketItems[PocketNumber][_pageobj] ;
	var ItemRow = Pocket.insertRow(-1) ;

	var ItemIcon = ItemRow.insertCell(-1) ;
	ItemIcon.appendChild( new Image() ) ;
	ItemRow.insertCell(-1).appendChild( document.createTextNode("") ) ; // name
	ItemRow.insertCell(-1).appendChild( document.createTextNode("") ) ; // quantity

}

function SetHealth(Current) {
	this.Health[_style].width = Math.ceil( 68 * (Current / this.Pokemon.Stats.Maximum[0]) ) + Px ;
	window.status = this.Health[_style].width ;
}

function DecreaseHealth(New, Current) {
		if (Current == New) return ;
		
		Current -= DamageRate ;
		if (Current < New) Current = New ;
		
		this.SetHealth( Current ) ;
		
		if (Current != New)
			add_action( this.DecreaseHealth, [New, Current], this) ;
}

function SETTEAM(TeamNumber) {
	SetSource( this.Team[TeamNumber], Img + "sprites/items/rsitem4.png" ) ;
	var My = this.Character.getTeam(TeamNumber) ;
	
	this.Team[TeamNumber][_pageobj].title = My.Name + "\t  (" +
											toSpecies(My.Number) + ")\n " +
											"L:" + My.Level + "\n  Health:" +
											My.Stats.Current[0] + "/" +
											My.Stats.Maximum[0] ;
	// onmouse over title, newlines for IE
}

function UPDATETEAM() {
	// updates entire team
	for (CurTeam = 0 ; CurTeam < this.Character.Data.Team.length ; CurTeam++) {
		this.UpdateTeamMember(CurTeam) ;
	}
}

function SlideTeam() {
// slides the team onto the screen
	var ThisSide = this ;
	var Direction = -1 ;
	if (this.Side == _right) {
		Direction = 1 ;
	}

	var Offscreen = (8 * Direction) * 24 + Px  ;

	for (var curteam = this.Character.Data.Team.length-1 ; curteam > -1  ; curteam--) {
		this.Team[curteam][_style].left = Offscreen ;
		// swoop( (curteam * 6), parseInt(Offscreen), curteam) ;
		
		swoop(6, parseInt(Offscreen), curteam) ;
		
		MapText.value += "target for " + curteam + " is " + (Direction * curteam) * 24 + "\n"
	}
		function swoop(Target, Current, TeamNo) {
		 	if (Current == Target) {
			// ThisSide.Team[TeamNo][_style].left = 0 + Px ;
				ActiveBattle
				return ;
			}
			Current -= Direction * 6; // multiple of 24
			ThisSide.Team[TeamNo][_style].left = Current + Px ;
			add_action(swoop,[Target, Current, TeamNo]) ;
		}
}

function TextUpdate(What, With) {
	What.nodeValue = With ;
}

function UpdateAttack(AttackNo) {
	// updates all attack related
	this.UpdateLabel(AttackNo) ;
	this.UpdateCurrentPP(AttackNo) ;
	this.UpdateMaximumPP(AttackNo) ;
	SHOW(this.Attacks[AttackNo]) ;
}

function UpdateLabel(AttackNo) {
	TextUpdate(this.AttackLabels[AttackNo],
			attacks[ this.Pokemon.Attacks.Type[AttackNo] ][0]) ;
}

function UpdateCurrentPP(AttackNo) {
	// updates graphical pp of a move
	TextUpdate(this.CurrentPP[AttackNo],
			this.Pokemon.Attacks.CurrentPP[AttackNo] ) ;
}

function UpdateMaximumPP(AttackNo) {
	var DefaultMaxPP = pp_list[ attacks[this.Pokemon.Attacks.Type[AttackNo]][4] ] ;
	TextUpdate(this.MaxPP[AttackNo],
			this.Pokemon.Attacks.MaxPP[AttackNo]
			| DefaultMaxPP ) ;
}

function toSpecies(PokemonNumber) { // species name rather than user specified nickname
	return pokemon[PokemonNumber][0] ;
}

function ADDPOKEMON(Pokemon) {
	var positionInTeam = this.Character.AddPokemon(Pokemon) // add pokemon to character
	if (positionInTeam !== false) this.UpdateTeamMember(positionInTeam) ;	// update interface if on team
}

function SETGROUND(GroundType) {
	SetBack( this.PokemonArea,
			Img+"undergraphics/" + BackTypes[GroundType] + ".png"
			) ;
}

function UpdateSide() {
	// the contents of a side are updated
	
	if (this.Pokemon) // a pokemon is active
		this.UpdatePokemonDisplay() ;
	else
		 this.UpdateCharacterDisplay() ;

	this.SetGround(0) ; // needs to be dependent on character position`
}

function UpdatePokemonDisplay() {
	this.UpdatePokemonName() ;
	this.UpdatePokemonGender() ;
	this.ChangePokemonImage( this.Pokemon.Number ) ;
}

function UpdateCharacterDisplay() {
	this.UpdateCharacterName() ;
	this.UpdateCharacterGender() ;
	this.ChangeTrainerImage() ;
}

function SETNAME(Name) {
	// raw set name
	this.Name[_pageobj].firstChild.nodeValue = Name ;
}

	function UpdatePokemonName() {
	// updates to active pokemon name
		this.SetName( this.Pokemon.Name ) ;
		// nickname or default pokemon name
	}
	
	function UpdateCharacterName() {
	// updates to trainer's name
		this.SetName(this.Character.Data.Name) ;
	}

function SETGENDER(GenderNumber) {
	// raw set gender
	this.Gender = ResetImage(this.Gender) ;
	SetSource( this.Gender,
			  Img+Genders[ GenderNumber ]+".gif"
			  ) ;
}

	function UpdatePokemonGender() {
		this.SetGender( this.Pokemon.Gender ) ;
	}

	function UpdateCharacterGender() {
		this.SetGender( this.Character.Data.Gender ) ;
	}

function ChangeTrainerImage() {
	var My = this.Character.Data ;

	this.ActivePokemon = ResetImage(this.ActivePokemon) ;
	
	SetSource(this.ActivePokemon,
			  TrainerImage(My.Sprite)
			  ) ;
}

function TrainerImage(TrainerNumber) {
	
	Filename = _blank ; // default
	if ( Sprites[TrainerNumber] ) // make sure the sprite exists
		Filename = Img + "sprites/trainers/" + Sprites[TrainerNumber][0].toLowerCase() + ".png"
	
	return Filename  ;
}

function SwitchToCharacter() {
	/* javascript:alert(SIDES[_right].ActivePokemon[_style].left=(parseInt(SIDES[_right].ActivePokemon[_style].left)|0) + 1 + Px) */
	
	this.UpdateCharacterDisplay() ;
}


function SetEncounterImage(LeftOrRight, Source) {

	this.EncounterSide[LeftOrRight] = ResetImage(this.EncounterSide[LeftOrRight]) ;

	this.EncounterSide[LeftOrRight][_pageobj].className = "worldview" + LeftOrRight ;

	SetSource(this.EncounterSide[LeftOrRight], Source) ;
}

function ClearEncounterImage() {
	this.SetEncounterImage(_left, _blank) ;
	this.SetEncounterImage(_right, _blank) ;
}

function isPokemon(Side) {
	if (!Side.Character) { // no character assigned to pokemon
		return true ;
	}
	else {
		return false ;
	}
}

function SwitchToPokemon(TeamNumber) {
	var pokemonSwitched = false ;
	
	if ( isNaN(TeamNumber) ) {
		this.Character.Activate() ;
		pokemonSwitched = true ;
	}
	else if ( this.Character.ChangePokemon(TeamNumber) ) {
		pokemonSwitched = true ;
	}
	else {
		return pokemonSwitched ;
	}
	
	this.Pokemon = this.Character.getActive() ;

		// rather than calling get active every time, perhaps it should be passed to helper functions
	// Put(["Go " + this.Pokemon.Name + "!"]) ;
	this.UpdatePokemonDisplay() ;

	return pokemonSwitched ;
}

function UpdateAttacks() {
	// update all attacks for pokemon
	for (curattack = 0 ; curattack < this.Pokemon.Attacks.Type.length ; curattack++) {
		this.UpdateAttack(curattack) ;
	}
}

function ChangePokemonImage(PokemonNumber) {
	// changes pokemon graphic
	var PokemonNumber = toHouen( PokemonNumber ) ; // images in houen/data in national
	
	var ImageTypes = [
	Img+"pokemon/rusa/pkrs" + PokemonNumber + ".gif", // front image
Img+"pokemon/rusa/rsicon" + PokemonNumber+ ".gif" // mini Icon
			] ;

	this.ActivePokemon = ResetImage(this.ActivePokemon) ;
	// Internet explorer workaround - reloads the image rather than sets source

	SetSource(this.ActivePokemon, ImageTypes[0] ) ;
	this.Mini = ResetImage(this.Mini) ;
	SetSource(this.Mini, ImageTypes[1] ) ;
}


/* 
Screen Renders
*/


function RenderSide() {
	// collectively responsibile for drawing all dynamic objects to screen for a side
	this.RenderTeam() ;
	this.RenderMini() ;	
	this.RenderName() ;
	this.RenderGender() ;
	this.RenderPokemons() ;
	this.RenderGoPokeball() ;
	
	this.RenderBattleMenu() ;
	this.RenderAttacks() ;
	
	this.RenderMainMenu() ;
	this.RenderInventory() ;
	
	this.RenderHealthBars() ;
}

function RequestData(Scope, CallNext) {
	var Form = document.createElement("form") ;
	var box = document.createElement("input") ;
	box.type = "text" ;
	Form.appendChild(box) ;
	// should be recoded so it doesn't use this stupid hack - just set callnext to the form!
	
	Form.CallNext = CallNext ; 
	Form.scope = Scope ;
	

	Form.onsubmit = function() {
		this.nextValue = Form.elements[0].value;
		this.CallNext.apply( this.scope, [this.nextValue] );
		return false;
	}
	/*
	Form.onsubmit = (function(Scope, CallNext) {
			return function() {
				CallNext.apply(Scope, [this.elements[0].value]) ;
				return false ;
				}
				
			})(Scope, CallNext) ;
	*/
	return Form ;
}

function AskToChoose() {
	Put( ["Choose a new adventure."] ) ;
}
