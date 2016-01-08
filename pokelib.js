// Numbers usually refer to 'magic numbers' - usually a list acompanies it to explain meanings
// Declarations:
var Images = document.images ;

Stats = [] ; for (var nw=0;nw<pokemon[0][4].length;nw++)
	Stats [ pokemon[0][4][nw].toLowerCase() ] = nw ;
// creates english representation of stats

DamageRate = 3 ;
// speed of damage decrease, the larger it is, the quicker health goes down, the lower, the slower health goes down

var BackTypes = ["grass","water"] ; // Ground Types
var Filters = ["FlipH()"] ; // Internet Explorer Filters


/*
0 = genderless
1 = male
2 = female
*/

// Static Settings

var Browser = (navigator.userAgent.toLowerCase().indexOf("msie")+1) ? 1 : Browser ;

function SetHealthBar(Pokemon, Current) {
	var HealthBar = document.getElementById("hp" + Pokemon.Player.Player) ;
	// health bar we're manipulating
	
	var Percentage = Current /  Pokemon.Stats[0].Value * 100 ;
	HealthBar.style.width = Math.floor(Percentage) + "px";
	 // percentage
	return Percentage ;
}

function UpdateHealthBar(Pokemon, Current, New) {
	if (Current == New) return ;
	
		Current-= DamageRate ;
		if (Current < New) Current = New ;
	window.status = SetHealthBar(Pokemon, Current) ;

	if (Current != New) // continue
		add_action( UpdateHealthBar, [Pokemon, Current, New]) ;
}

function Audio(Type, Track) {
	if (!OPTIONS.Music) return false ;
	Track = audio[Type][0][Track] ; // track to play

	Container = document.getElementById("m" + Type) ;
	Container.innerHTML = "<embed src='" +
	audio[Type][1] + "/" + Track[1]
	+ "' id='musicsounds" + Type + "' hidden='true' autostart='true' width='0' height='0'>"
}

function Stat(Parent, StatNumber, IV, Effort, NatureModifier, Modifier) { // Stat Object
	this.StatNumber = StatNumber ;
	this.Value = 1 ; // max value
	this.Current = 1 ; // current value
	this.Pokemon = Parent ; // Pokemon
	this.Effort = Effort ; // Effort Value
	this.Individual = (IV>=LowestIV && IV<=HighestIV) ? IV : 0 ; // IV Value
	
	if ( isUndefined(Modifier) ) var Modifier = 6 ; // Stat Modifier
	this.Modifier = Modifier ;
	
	this.Calculate = StatCalculate ;
	
	if ( isUndefined(NatureModifier) ) NatureModifier = 0 ;
	this.NatureModifier =  NatureModifier ;
	}


function StatCalculate() { var StatNumber = this.StatNumber ;
Value = 
(
  (2 * pokemon[this.Pokemon.Number][4][StatNumber] + // base stats
  this.Individual + // individual value/deter value
  	Math.floor(
	this.Effort / 4
	)
  		// effort score
  )
  	*
	this.Pokemon.Level / 100
) ;

if (StatNumber != 0) {
 Value += 5 ;
 Value = Math.floor(Value) ;
 Value *= NatureModifiers[this.NatureModifier] ;
 }
else
 Value += (10 + this.Pokemon.Level) ;

this.Value = Math.floor(Value) ;
this.Current = this.Value ;
}

function DefaultAttacks(Pokemon) {
	// sets default attacks up to level
	var AttacksLevels = pokemon[Pokemon.Number][8][1] ;
	var AllAttacks = pokemon[Pokemon.Number][8][0] ;
	
	TestAt = "" ;
	
	for (cur_learned=0 ; cur_learned < AllAttacks.length; cur_learned++) {
		if (AttacksLevels[cur_learned] <= Pokemon.Level || isNaN(AttacksLevels[cur_learned]) ) {
			AddAttack(Pokemon,AllAttacks[cur_learned] ) ;
		}
	}
	// alert(TestAt) ;
}

function AddAttack(Pokemon, AttackNo) {
	TestAt += AttackNo + "\n" ;

	var NextAttack = Pokemon.Attacks.Type.length ;
	if ( NextAttack == AttackCount ) {
			Pokemon.Attacks.Type.shift() ;
			Pokemon.Attacks.CurrentPP.shift() ;
			Pokemon.Attacks.MaxPP.shift() ;
			NextAttack = Pokemon.Attacks.Type.length ;
		}
	Pokemon.Attacks.Type[NextAttack] = AttackNo ;
	Pokemon.Attacks.CurrentPP[NextAttack] = pp_list[ attacks[AttackNo][4] ] ; 
	delete Pokemon.Attacks.MaxPP[NextAttack] ;
}

function UpdateStats(Pokemon) {
// todo: make sure it doesn't heal pokemon if current already exists
	var Nature = nature_list[Pokemon.Nature] ;
	
	for (var Current=1;Current < Nature.length; Current++) {
		 if (NatureModifiers[Current]) {
			 Pokemon.Stats.Nature[ Nature[Current] ] = Current ;
		 }
	}
	
	var RemainingEffort = TotalEffort ;
	effort_list = [] ;
	stat_list = [] ;
	for (WhichStat=0; WhichStat < pokemon[0][4].length ; WhichStat++) {
		
		if (isNaN(Pokemon.Stats.Effort[WhichStat]))
		 Pokemon.Stats.Effort[WhichStat] = 0 ;		// untrained pokemon
		
		if (isNaN(Pokemon.Stats.Nature[ WhichStat ]))	// the stats which are not affected by nature
			Pokemon.Stats.Nature[ WhichStat ] = NEUTRAL_NATURE_MODIFIER ;

		var MyEffort = Pokemon.Stats.Effort[WhichStat] ;

		if (MyEffort > HighestEffort) Pokemon.Stats.Effort[WhichStat] = 0 ;
		// illegal effort value, too high
		else if (RemainingEffort >= MyEffort) RemainingEffort -= MyEffort ;
		// enough remaining to go here 
		else if (MyEffort > RemainingEffort) {
			Pokemon.Stats.Effort[WhichStat] = RemainingEffort ;
			RemainingEffort = 0 ;
		}
		// to much effort
		
		if (Pokemon.Stats.Individual[WhichStat] > HighestIV ||
			Pokemon.Stats.Individual[WhichStat] < LowestIV ) {
			Pokemon.Stats.Individual[WhichStat] = 0 ;	
		}
		
		var Value = (
	  (2 * pokemon[Pokemon.Number][4][WhichStat] + // base stats
	  Pokemon.Stats.Individual[WhichStat] + // individual value/deter value
		Math.floor(
		Pokemon.Stats.Effort[WhichStat] / 4
		)
			// effort score
	  )
		* Pokemon.Level / 100
	) ;
	
	if (WhichStat != 0) { // other than HP
	 Value += 5 ;
	 Value = Math.floor(Value) ;
	 Value *= NatureModifiers[ Pokemon.Stats.Nature[WhichStat] ] ;
	 }
	else	 { // hp only
		Value += (10 + Pokemon.Level) ;
	}
	
	Value = Math.floor(Value) ;
	
	if (!Pokemon.Stats.Modifiers[WhichStat]) Pokemon.Stats.Modifiers[WhichStat] = 6 ;

	Pokemon.Stats.Maximum[WhichStat] = Value ;
	Pokemon.Stats.Current[WhichStat] = Value * StatModifier[ Pokemon.Stats.Modifiers[WhichStat] ] ;
	
	effort_list.push( Pokemon.Stats.Effort[WhichStat] ) ;
	stat_list.push( Pokemon.Stats.Maximum[WhichStat] ) ;
	
	}
	
	/* alert("Nature:"+Nature[0]+"\nImproves:"
								 +pokemon[0][4][ Nature[1] ]+"\nReduces: " +
								 pokemon[0][4][ Nature[2] ]) ; */
	// alert(effort_list + "\n" + stat_list + "\nRemaining Effort: " + RemainingEffort) ;
}


function StatusAffliction( Affliction ) {

}

function PokemonAttack ( AttackNumber, Position, Parent ) { // attack Object, holds Power Points
	this.Pokemon = Parent ;
	this.Position = Position ; // position for drawing purposes
	this.Number = AttackNumber ;
	this.PP = pp_list[ attacks[this.Number][4] ] ;
	this.CurrentPP = this.PP ;
	this.Attack = Attack ; // deals the attack
}

function Attack() { 
	if (this.CurrentPP > 0) {
	this.CurrentPP-- ;
	
	if (this.Pokemon.Player.Player == 1) // if player 1
	UpdateAttack(this.Pokemon, this.Position) ; // update PP data for this particular attack
	
	}
}




function UpdateAttack(Pokemon, Attack) { // updates attack information
	if (Pokemon.Attacks[Attack]) {
		CurrentAttack = Pokemon.Attacks[Attack] ;
		
		CurrentPP = document.getElementById("pp" + Attack) ;
		CurrentPP.innerHTML = CurrentAttack.CurrentPP ;
		
		if (CurrentAttack.CurrentPP < (CurrentAttack.PP*.3) ) {
			CurrentPP.style.color = "red" ;	
		}
		else if (CurrentAttack.CurrentPP < (CurrentAttack.PP*.5) ) {
			CurrentPP.style.color = "orange" ;
		}
		
		document.getElementById("pp2" + Attack).innerHTML = CurrentAttack.PP ;
	}
}

function UpdateAttacks(Pokemon) { // updates attack information for all attacks
	for (AttackNumber=0;AttackNumber < Pokemon.Attacks.length;AttackNumber++)
		UpdateAttack(Pokemon, AttackNumber) ;
}

function battle_interface( PlayerNumber ) {
	// Controls the battle interface of the battle
this.Player = (PlayerNumber == 1) ? 1 : 2
this.Opponent = (PlayerNumber == 1) ? 2 : 1
this.ActivePokemon = 0 ; // pokemon on team that is currently active.

this.Turn = 0 ;
this.RenderInterface = RenderInterface ;
// this.ChangePokemon = ChangePokemon ;
this.ChangeImage = ChangeImage ;
this.ChangeGround = ChangeGround ;
this.bgChange = bgChange ;
this.ChangeBack = ChangeBack ;

this.Team = new Array(6) ;
this.Pokemons = new Array() ;
// data

this.GenderImage = GenderImage ;
this.SetGender = SetGender ;
this.SwitchPokemon = SwitchPokemon ;
this.applyFilter = applyFilter ;
this.SetName = SetName ;
}

function RenderInterface ( Where , What ) {
// Renders HTML
	document.getElementById( Where + this.Player ).innerHTML = What ; }

function SetGender( PokemonOrTrainer ) {
// Changes the fed Pokemon or Players gender image
 this.GenderImage( PokemonOrTrainer.Gender ) ;
}

function GenderImage( Gender ) {
// Changes the Gender Image
 this.ChangeImage( "gender", Img + Genders[ Gender ] + ".gif", 1) ;
}

function SwitchPokemon( Pokemon ) {
// Changes the player's active Pokemon
 this.ActivePokemon = Pokemon ;
 tmp = this.ChangePokemon ( Pokemon.Number, 0 ) ;
  if (this.Player == 1) { this.applyFilter( tmp, 0 ) ; } 
  this.SetName( Pokemon ) ;
}

function SetName(Whom) {
	document.getElementById("name" + this.Player).innerHTML = Whom.Name ;
}

function bgChange( Where, Location) {
// Changes the background image
if ( !isUndefined(this.Player) ) Where = Where + this.Player ;
 document.getElementById(Where).style.backgroundImage = "url(" + Location + ")" ;
}

function ChangeImage( Name, Location) {
// Changes an image
if ( isUndefined(Location) ) Location = "images/pixel.gif" ;
if (!isUndefined(this.Player)) Name = Name + this.Player
Cur = Images[Name] ;
 Cur.src = Location ;
 return [Cur, document.getElementById("i" + Name)] ;
}

function applyFilter( Where, What ) {
// Applies a 'filter', MS Internet Explorer only
for ( var a=0; a < Where.length ; a++) {
 Where[a][1].style.filter = Filters[What] ; }
}

function ChangeGround( GroundType ) {
// Changes the ground IMAGE underneath a player/pokemon

// SetBack(WhatStyle, To)

	SetBack(
			[document.getElementById("poke" + this.Player),
			document.getElementById("poke" + this.Player).style],			
	Img+"undergraphics/" + BackTypes[GroundType] + ".png")

 // document.getElementById("poke" + this.Player).style.backgroundImage = "url(\"images/undergraphics/" + BackTypes[GroundType] + ".PNG\")" ;
}


function ChangeBack( BackType ) {
// Changes the battle interface background
 var Cur = "images/bgs/" + BackTypes[BackType] + ".png" ;
 bgChange("battle", Cur ) ;
}

function toHouen( PokemonNumber) {
	return pokemon[PokemonNumber][7] ;
}


/*
function ChangePokemon ( PokemonNumber, ImageType ) {
// Changes the Pokemon on the screen
 
 var PokemonNumber = toHouen( PokemonNumber ) ;
var ImageTypes = ["images/pokemon/rusa/pkrs" + PokemonNumber + ".gif", // Normal front image
"images/pokemon/rusa/rsicon" + PokemonNumber+ ".gif" // Mini Icon
]
	  return [this.ChangeImage( "poke",ImageTypes[ImageType]),
	this.ChangeImage("mini", ImageTypes[1]) ] ;
	 
	; }
*/

// Players[1].ChangeImage("poke") ;
// Players[1].ChangePokemon(3,0) ;

function changeImages() {
 for (n in Images) document.images[n].src = "images/sprites/items/rsitem004.png" ;
}

// Lets go!
var Players = [0,new battle_interface(1),new battle_interface(2)] ;
// Creates the Player objects
