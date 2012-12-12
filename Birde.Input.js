var MOUSE_LEFT = 0;
var MOUSE_WHEEL = 1;
var MOUSE_RIGHT = 2;

/**
* Monitors events related to keyboard and mouse input. Internally stores the state of keys and mouse buttons, as well.
* Is also tasked with delegating these events each step.
*/
var Input =
{
	/**
	* Stores the state of the individual mouse buttons - array should only contain three elements
	* but is left uncapped in case your mouse is fucking weird.
	*/
	Mousestates : [],

	/**
	* Mouse object stores everything else about the cursor - where it is, where it was last frame, and its deltas between this frame and the last.
	*/
	Mouse : 
	{
		lastX : 0,
		lastY : 0,
		x : 0,
		y : 0,
		deltaX : 0,
		deltaY : 0
	},

	/**
	* Initializes the input storage objects and attaches events to the document to capture input about the mouse and keyboard.
	*/
	init : function(props)
	{
		// Register mouse events
		Drawing.canvas.addEventListener("mousemove", function(e)
		{
			var Mouse = Input.Mouse;
			Mouse.lastX = Mouse.x;
			Mouse.lastY = Mouse.y;
			Mouse.x = e.offsetX;
			Mouse.y = e.offsetY;
			Mouse.deltaX = Mouse.x - Mouse.lastX;
			Mouse.deltaY = Mouse.y - Mouse.lastY;
		});

		Drawing.canvas.addEventListener("mousedown", function(e)
		{
			FireMouseEvent("mousedown", e);
		});

		Drawing.canvas.addEventListener("mouseup", function(e)
		{
			FireMouseEvent("mouseup", e);
		});

		Drawing.canvas.addEventListener("click", function(e)
		{
			FireMouseEvent("click", e);
		});

		// Initialize keystates
		var i = 0;
		while (i < 128)
		{
			this.Keystates[i] = false;
			i++;
		}

		document.body.addEventListener("keydown", function(e)
		{
			// Sets key-down state
			Input.Keystates[e.keyCode] = true;
		});

		document.body.addEventListener("keyup", function(e)
		{
			// Sets key-up state
			Input.Keystates[e.keyCode] = false;
		});
	},

	/**
	* Stores the state of each key (true for pressed, false for not pressed)
	*/
	Keystates : [],

	/**
	* Checks to see if literally any key is pressed down - this information is used for firing the generic keydown event.
	*/
	isKeyDown : function()
	{
		// Returns a non-false value if any key is pressed down
		var i = 0;
		while (i < this.Keystates.length)
		{
			if (this.Keystates[i] == true)
				return true;
			i++;
		}

		return false;
	},

	/**
	* Retrieves a shortlist of all the keys that are currently pressed down - used for firing keydown subevents.
	*/
	getAllKeysDown : function()
	{
		// Retrieves a list of all the keys currently pressed down
		var keysDown = [];

		var i = 0;
		while (i < this.Keystates.length)
		{
			if (this.Keystates[i] == true)
				keysDown.push(i);
			i++;
		}

		return keysDown;
	},

	/**
	* Fires every step and determines if any bound events need to be fired.
	*/
	step : function(dt)
	{
		/**
		* Fires keydown events
		*/
		var keysDown = this.getAllKeysDown();
		var i = 0;
		while (i < keysDown.length)
		{
			var evt = new Event({
				keyCode : keysDown[i]
			});
			FireEvent("keydown", evt);
			i++;
		}
	}
}
