// handles conversations between characters

/* function AnimateText(Text, Length, CurLength) { // obsolete
	if (CurLength++ > Length) CurLength = Length ;
	
	INTERFACE.PutText( Text.substr(0, CurLength) );
	
	if (CurLength < Length)
	 add_action(AnimateText, [Text, Length, CurLength]) ;
} */

STATEMENTS = 0 ;
REPLY = 1 ;

function CharacterSpeech(SpeechNumber, Behaviour) {
	EnableText() ;
	var speechlist = Behaviour || "random";
	console.log("Speech Number:", SpeechNumber, "Speech Mode: ", Behaviour);
	var myspeech = speech[this.NPCNumber];
	var mode = myspeech[speechlist];
	console.log("Speech...");
			   
	Put( [ mode[SpeechNumber] ],[RunQueue, this] ) ;
}

function Put(Data, Do) {
	// alert("PASSED : " + Do) ;
	if (!Do) {
		Do = undefined ;
	}
	INTERFACE.Output(Data, Do, 0) ;
}

function EnableText() {
	ShowText() ;
	AcceptKeys() ;	// causes walk to recalled all the while button is held down, enabletext needs some intelligence
}

function ShowText() { // we assume the buttons are active
	ClearOutput() ;
	INTERFACE.ClearEncounterImage() ;
	INTERFACE.ToggleText(1) ;
}

function DisableText() {
	INTERFACE.ToggleText(0) ;
}
