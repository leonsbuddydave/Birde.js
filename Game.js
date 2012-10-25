// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
		  window.webkitRequestAnimationFrame || 
		  window.mozRequestAnimationFrame    || 
		  window.oRequestAnimationFrame      || 
		  window.msRequestAnimationFrame     || 
		  function( callback ){
			window.setTimeout(callback, 1000 / 60);
		  };
})();

Game =
{
	/*
		Running
		
		Game only runs if this is true. Calling Game.Start() sets this to true.
	*/
	Running : false,
	
	/*
		Setup
		-- TargetCanvasID (the ID of the canvas to put the game on)
		
		Calls the initialization events for everything else.
	*/
	Setup : function(CanvasID)
	{
		Graphics.SetupCanvas(CanvasID);
		EventDelegate.Initialize(CanvasID);
		return this;
	},
	
	/*
		Options
		
		Things that can be set by the user or data that needs to be held onto by the engine.
	*/
	Options :
	{
		FPS : 60,
		CanvasID : null,
		OnBlur : function() { Game.Stop(); },
		OnFocus : function() { Game.Start(); }
	},
	
	/*
		Start
		-- TargetCanvasID (the ID of the canvas to put the game on)
		
		Initializes everything and starts the game loop.
	*/
	Start : function(options)
	{	
		if (this.Running == true)
		{
			console.log("Start failed - game already running.");
			return this;
		}
		
		// If debugging is turned off, just get rid of console.log completely
		if (!DEBUG)
			console.log = function(){ /* This function does nothing */ };
			
		options = options || {};
			
		// Use the new canvas if one has been provided, otherwise check for a stored one
		this.HandleOptions(options);
		
		this.SetGameEvents(options);
		
		console.log("Starting game.");
		
		// Call the setup method to get everything in place
		this.Setup(this.Options.CanvasID);
		
		// Start the game loop
		this.Running = true;
		this.Update( 0 );
		
		return this;
	},
	
	/*
		HandleOptions
		-- options (options object)
		
		Handles the initial arguments passed to the game
	*/
	HandleOptions : function(options)
	{
		if (typeof options.OnBlur !== 'undefined' && options.OnBlur !== null)
			Options.OnBlur = options.OnBlur;
			
		this.ChooseCanvas(options);
	},
	
	SetGameEvents : function(options)
	{
		// Register the window to it too, so we catch tab changes
		window.onblur = Game.Options.OnBlur;
		
		// Creates a game controller object for events
		// this will be added to the SceneGraph automatically
		var EvController = WorldObject.Extend({
			Events :
			{
				click : function(Me, Evt)
				{
					Game.Options.OnFocus();
				},
				blur : function(Me, Evt)
				{
					Game.Options.OnBlur();
				}
			},
			Draw : function(){}
		});
		
		World.Add(EvController.New());
	},
	
	ChooseCanvas : function(options)
	{
		if (typeof options.CanvasID == 'undefined' || options.CanvasID == null)
		{
			if (typeof this.Options.CanvasID == 'undefined' || this.Options.CanvasID == null)
			{
				console.log("Game failed to start - no canvas provided.");
				return null;
			}
			else
			{
				console.log("No CanvasID provided - using stored ID " + options.CanvasID);
				options.CanvasID = this.Options.CanvasID;
			}
		}
		else
			this.Options.CanvasID = options.CanvasID;
	},
	
	/*
		Stop
		
		Halts execution.
	*/
	Stop : function()
	{
		this.Running = false;
		return this;
	},

	/*
		Update
		-- lastTime (the start time of the last frame)
		
		The core game loop - loops through and calls the update and draw events for everything.
	*/
	Update : function(lastTime)
	{
		if (!this.Running) // Game has been told to stop
			return;
			
		// Get the time this frame starts at
		// subtract the last frame's start time
		var newTime = new Date().getTime();
		
		var dt;
		if (lastTime == 0) // first frame
			dt = 0;
		else
			dt = newTime - lastTime;
		
		// Clear the buffers
		Graphics.Clear();
		
		// Loop through the whole scene graph, updating and drawing
		var i = 0;
		while (i < World.SceneGraph.length)
		{
			if (typeof World.SceneGraph[i]["Update"] !== 'undefined')
			{
				World.SceneGraph[i].Update(World.SceneGraph[i], dt / 1000);
				World.SceneGraph[i].Draw(World.SceneGraph[i], Graphics.ContextCache[0]);
			}
			i++;
		}
		
		// Collision checking
		i = 0;
		while ( i < World.SceneGraph.length )
		{
			var j = i + 1;
			while ( j < World.SceneGraph.length )
			{
				if (Collision.Happened(World.SceneGraph[i], World.SceneGraph[j]))
				{
					if (World.SceneGraph[i].Events.oncollision)
						World.SceneGraph[i].Events.oncollision( World.SceneGraph[i], World.SceneGraph[j] );
					
					if (World.SceneGraph[j].Events.oncollision)
						World.SceneGraph[j].Events.oncollision( World.SceneGraph[j], World.SceneGraph[i] );
				}
				j++;
			}
			i++;
		}
		
		if (DEBUG)
		{
			Debug.FPS = Math.floor( 1000 / dt );
			Debug.Draw();
		}

		// Call the loop again
		//this.LoopHandle = setTimeout( function() { Game.Update(newTime); }, 1000 / Game.Options.FPS);
		requestAnimFrame(function()
		{
			Game.Update(newTime);
		});
	}
};