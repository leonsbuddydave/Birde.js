KEYSTATE =
{
	UP : 0,
	DOWN : 1
}

KEYCODES =
{
	"space" : 32,
	"backspace" : 8,
	"up" : 38,
	"left" : 37,
	"right" : 39,
	"down" : 40,

}

Keyboard =
{
	KeyStates : [],
	IsDown : function(KeyCode)
	{
		if (typeof KeyCode == "string")
			KeyCode = KEYCODES[KeyCode.toLowerCase()];

		if (this.KeyStates[KeyCode] == KEYSTATE.DOWN)
			return true;

		return false;
	},
	IsUp : function(KeyCode)
	{
		if (typeof KeyCode == "string")
			KeyCode = KEYCODES[KeyCode.toLowerCase()];

		if (typeof this.KeyStates[KeyCode] == 'undefined' || this.KeyStates[KeyCode] == null || this.KeyStates[KeyCode] == KEYSTATE.UP)
			return true;

		return false;
	},
	SetState : function(KeyCode, State)
	{
		this.KeyStates[KeyCode] = State;
	}
}