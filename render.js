function RenderName() {
	NameArea = document.getElementById("name" + this.Side) ;
	
	var NameObj =  document.createElement("div") ;
	var Text = NameObj.appendChild( document.createTextNode( new String() ) ) ;
	NameObj.className = "pokeNames" ;
	NameObj = [NameObj, NameObj.style] ;
	
	Text.nodeValue = "lol" ;

	NameObj[_pageobj] = NameArea.appendChild( NameObj[_pageobj] ) ;
	this.Name = NameObj ;
}

function RenderItemList() {
	
}

function RenderMainMenu() {
	// each player receives it's own in game menu
	var MenuArea = document.getElementById("gamemenu") ;
	
	var GameMenu = MenuArea.appendChild( document.createElement("table") ) ;
	MenuArea.classname = "hiddenMenu";	
	GameMenu.className = "" ;
	
	for (var current_option = 0 ; current_option < menu_items.length ; current_option++) {
			var OptionData = menu_items[current_option] ;
			
			var row = GameMenu.insertRow(-1) ;
			row.MenuNumber = current_option ;
			row.onmouseover = function() {
				SelectMenu(this.MenuNumber) ;
			}
			row.onmouseout = function() {
				// DeselectMenu(this.MenuNumber) ;
			}
			
			row.onclick = UseMenuOption ;
			
			var option_icon = new Image() ;
			option_icon.src = Img+OptionData[1] ;
			
			row.insertCell(0).appendChild(option_icon) ; // add icon to menu list
			
			row.insertCell(-1).appendChild( document.createTextNode(OptionData[0] ) ) ;
	}
	
	this.GameMenu = PageObject(GameMenu) ;
	this.MenuArea = PageObject(MenuArea) ;
	HIDE(this.GameMenu) ;
	HIDE(this.MenuArea) ;
}

function RenderInventory() {
	var InventoryListArea = this.InventoryArea.appendChild( document.createElement("div") ) ;
	InventoryListArea.className = "itemlist" ;
	this.InventoryListArea = PageObject(InventoryListArea) ; 
	HIDE(this.InventoryListArea) ;
	
	var PocketArea = this.InventoryArea.appendChild( document.createElement("div") ) ;
	PocketArea.className = "pocketlist" ;
	this.Pockets = PageObject(PocketArea) ;
	
	this.PocketList = PocketArea.appendChild( document.createElement("table") ) ;
	this.PocketList.insertRow(-1) ;
	
	var LabelArea = PocketArea.appendChild( document.createElement("div") ) ;
	LabelArea.className = "pocketLabel" ;
	var PocketLabel = LabelArea.appendChild( document.createTextNode("") ) ;
	this.PocketLabel = PageObject(PocketLabel) ;
	
	for (var each_pocket = 0 ; each_pocket < default_pocket_order.length ; each_pocket++) {
	 this.RenderPocket( each_pocket ) ;
	 this.RenderPocketItems( each_pocket ) ;
	}
	this.PocketList = PageObject(this.PocketList) ;
	HIDE(this.Pockets) ;
}

function RenderPocketItems(PocketNumber) {
	// renders list of items inside the pocket
	var PocketItems = this.InventoryListArea[_pageobj].appendChild( document.createElement("table") ) ;
	this.PocketItems[PocketNumber] = PageObject(PocketItems) ;
	HIDE( this.PocketItems[PocketNumber] ) ;
	
}

function RenderPocket(PocketPosition) {
	PocketNumber = default_pocket_order[PocketPosition] ;
	// var row = this.PocketList.insertRow(-1) ;
	row = this.PocketList.rows[0] ;

	var pocket_icon = new Image() ;
	pocket_icon.src = Img+"sprites/items/rsitem" + item_pockets[PocketNumber][1] +".png" ; // exemplar item
	
	var cell = row.insertCell(-1) ;
	cell.appendChild(pocket_icon) ;
	cell.PocketNumber = PocketPosition ;

	cell.onclick = function() {
		ChangePocket(this.PocketNumber) ;
	}
}

function RenderMini() {
	// create mini icons
	IconArea = document.getElementById("mini" + this.Side) ;
	
	var Icon = new Image() ;
	// Icon.className = "" ;
	Icon = [Icon, Icon.style] ;
	
	SetSource(Icon, _blank) ;
	Icon[_pageobj] = IconArea.appendChild( Icon[_pageobj] ) ;
	
	this.Mini = Icon ;
}

function RenderGoPokeball() {
// renders the pokeball the player throws during a battle
	var Pokeball = new Image() ;
	
	Pokeball.className = "thrownpokeball" ;
	
	if (this.Side == _right)
		this.PokemonArea[_pageobj].insertBefore(Pokeball, this.ActivePokemon[_pageobj] ) ;
	else
		this.PokemonArea[_pageobj].appendChild(Pokeball) ;
	Pokeball = PageObject(Pokeball) ;		
	SetSource(Pokeball, "graphics/aniball.gif") ;
	this.GoPokeball = Pokeball ;
}

function RenderPokeballs() {
// creates pokeballs on the battle shell
	Team = document.getElementById("team" + this.Side) ;
	// we only do this once so it doesn't matter

	for (var current_pokemon = 0; current_pokemon < this.Team.length ; current_pokemon++) {

		var Pokeball = new Image() ;
		Pokeball.className = "team" ;
		Pokeball = [Pokeball, Pokeball.style] ;
		
		SetSource(Pokeball, _blank ) ;
		Pokeball = PageObject( Team.appendChild( Pokeball[_pageobj] ) ) ;

		this.Team[current_pokemon] = Pokeball ;
	// PAGEOBJ[_pageobj].src = "images/sprites/items/rsitem004.png" ;
	}
}

function RenderGender() {
	var GenderArea = document.getElementById("gender" + this.Side) ;
	
	var Gender = new Image() ;
	Gender.className = "gendersymbol" ;
	Gender = [Gender, Gender.style] ;
	
	SetSource(Gender, _blank ) ;
	
	Gender[_pageobj] = GenderArea.appendChild( Gender[_pageobj] ) ;
	
	this.Gender = Gender ;
}

function RenderPokemons() {
	var ActivePokemonArea = document.getElementById("poke" + this.Side) ;
	
	var Pokemon = new Image() ;
	Pokemon = [Pokemon, Pokemon.style ] ;
	
	SetSource(Pokemon, _blank) ;
	
	Pokemon[_pageobj] = ActivePokemonArea.appendChild( Pokemon[_pageobj] ) ;
	
	this.ActivePokemon = Pokemon ;
}

/* worldmap confrontation:
javascript:var Mentor = new Image() ;Mentor.src = "images/sprites/trainers/rstrainer28.png";Mentor.className="worldview";INTERFACE.Output([Mentor,"Hello there, I am your mentor. The pokemon world is a large and marvelous place.","many stupid"],0);alert("test");
*/

function RenderZoomedEncounters(LeftOrRight) {
	// icons on left and right, use SetEncounterImage to set
	var Encounter = new Image() ;
		
	Encounter = this.EncounterSide[LeftOrRight] = this.Conversation[_pageobj].insertBefore(Encounter, this.Convo ) ;
	Encounter = [Encounter, Encounter.style] ;

	SetSource(Encounter, _blank) ;

	this.EncounterSide[LeftOrRight] = Encounter ;
}

function NewGame(GameMode) {
	STATE.Mode = GameMode ;
	GAME_MODES[GameMode].New() ; // start a new game with game mode
}

function RenderBattleMenu() {
	var MenuArea = document.getElementById("battlemenu") ;
	
	var BattleMenu = MenuArea.appendChild( document.createElement("table") ) ;
	BattleMenu.className = "battlemenu" ;
	this.BattleMenu = PageObject(BattleMenu) ;
	
	HIDE(this.BattleMenu) ;
	
	var row = BattleMenu.insertRow(-1) ;
	row.Side = this.Side ;
	row.Menu = this.BattleMenu ;
	for (var current_command = 0 ; current_command < 4 ; current_command++) {
	 var cell = row.insertCell(-1) ;
	 
	 cell.command = commandlist[current_command][0] ;
	 
	 
	 cell.onclick = function() {
		 // alert(this.parentNode.Side) ;
		this.command.apply(ActiveBattle, [this.parentNode.Side] ) ;
		HIDE(this.parentNode.Menu) ;
	 }
	
	 var CommandName = cell.appendChild( document.createTextNode(commandlist[current_command][1]) ) ;
	 
	}
}

function RenderAttacks() {
// creates an attack list for each side
	var AttackList = document.getElementById("attacklist") ;
	AttackList = AttackList.appendChild( document.createElement("table") ) ;
	AttackList.className = "attacklist" ;
	this.AttackList = [AttackList,AttackList.style] ;
	
	HIDE(this.AttackList) ;
	
	var row = AttackList.insertRow(-1) ;
	row.Side = this ;

	row.AttackList = this.AttackList ;
	
	for (var CurrentAttack = 0 ; CurrentAttack < AttackCount ; CurrentAttack++) {
		
		var cell = row.insertCell(-1) ;
		this.Attacks[CurrentAttack] = PageObject(cell) ;
		
		HIDE( this.Attacks[CurrentAttack] ) ;
		
		
		cell.AttackNo = CurrentAttack ; 
		
		cell.onclick = function() {
				HIDE(this.parentNode.AttackList) ;
				ActiveBattle.AddAttack(
							this.AttackNo,
							this.parentNode.Side.Pokemon,
							this.parentNode.Side.Enemy.Pokemon,
							this.parentNode.Side) ;
		}
		
		var AttackName = document.createElement("h4") ; // attack name
		var AttackText = AttackName.appendChild(
									document.createTextNode("")
												) ;
		
		this.AttackLabels[CurrentAttack] = AttackText ;
		
		cell.appendChild(AttackName) ;
		cell.style.backgroundImage= "url(images/bgs/grass.PNG)" ;
		
		var PP = document.createElement("div") ;
		PP.className = "PPcontainer" ;
		
		var currentPP = document.createElement("span") ;
		currentPP.className = "curPP" ;
		currentPP = PP.appendChild(currentPP).appendChild(document.createTextNode("")) ;
		this.CurrentPP[CurrentAttack] = currentPP ;

		PP.appendChild( 
					   document.createElement("span").appendChild( document.createTextNode("/") )
					   ) ; // current and maximum pp divider
		
		cell.appendChild( PP ) ;
		
		var maxPP = document.createElement("span") ;
		maxPP.className = "maxPP" ;
		maxPP = PP.appendChild(maxPP).appendChild(document.createTextNode("")) ;
		this.MaxPP[CurrentAttack] = maxPP ;
			
	}
	
}

function RenderSavedGames() {
		
}

function RenderNewGames() {
	// makes game list under new game
		var GameTable = document.getElementById("gameslist") ;
		for (var CurrentGame = 0 ; CurrentGame < GAME_MODES.length ; CurrentGame++) {
			

			GAME_MODES[CurrentGame] = new GAME_MODES[CurrentGame]() ;
			var ThisGame = GAME_MODES[CurrentGame] ;
			
			var row = GameTable.insertRow(-1) ;
			var cell = row.insertCell(0) ;
		
		Title = document.createElement("h4") ;
		Title.appendChild( document.createTextNode(ThisGame.Name) ) ;
		cell.appendChild(Title) ;
		
		Author = document.createElement("b") ;
		Author.appendChild (document.createTextNode("by " + ThisGame.Author) ) ;
		cell.appendChild(Author) ;
		
		row.MODE = CurrentGame ;
		row.onclick = function() { NewGame(this.MODE)  }
		
		// removed scope hack
		/* row.onclick = (function(Mode) {
			return function() {
			NewGame(Mode) ;
			}
			})(CurrentGame) ;
		*/
		
		Description = document.createElement("p")
		Description.appendChild( document.createTextNode(ThisGame.Description) ) ;
		cell.appendChild(Description) ;
		
		cell.onmouseover = function() {
			this.style.backgroundImage = "url(images/bgs/grass2.png)";
		}

		cell.onmouseout = function() {
			this.style.backgroundImage = "url(images/bgs/grass.png)";
		}

		}
}

function RenderHealthBars() {
	var HealthArea = document.getElementById("health" + this.Side) ;
	var Bar = document.createElement("div") ;
	Bar.className = "emptyHP" ;
	var HP = Bar.appendChild( document.createElement("div") ) ;

	HP.className = "HP" ;
	
	this.Health = PageObject( HP ) ;
	this.HealthBar = PageObject( Bar) ;
	
	HealthArea.appendChild(Bar) ;
	
}
