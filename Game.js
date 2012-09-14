Game = {
	Settings :
	{
		DEBUG : true,
		FPS : 300
	},
	Setup : function(TargetCanvasID)
	{
		Graphics.SetupCanvas(TargetCanvasID);
		EventDelegate.Initialize(TargetCanvasID);
	},
	Start : function(TargetCanvasID)
	{
		// If debugging is turned off, just get rid of console.log completely
		if (!this.Settings.DEBUG)
			console.log = function(){};
		
		console.log("Starting engine.");
		
		// Call the setup method to get everything in place
		this.Setup(TargetCanvasID);
		
		// Start the game loop
		this.Update( new Date(0).getTime() );
	},
	World : 
	{
		SceneGraph : [],
		Position :
		{
			// X and Y world positions determine the world's position relative to the canvas
			// in turn, elements in SceneGraph will be affected
			x : 0,
			y : 0
		},
		Add : function(Obj)
		{
			// Registers an object for events and then pushes it onto the scene graph
			EventDelegate.RegisterObject( Obj );
			this.SceneGraph.push( Obj );
		}
	},
	Input : 
	{
	
	},
	Update : function(lastTime)
	{
		// Get the time this frame starts at
		// subtract the last frame's start time
		var newTime = new Date().getTime();
		var dt = newTime - lastTime;
		
		// Clear the buffers
		Graphics.Clear();
		
		// Loop through the whole scene graph, updating and drawing
		var i = 0;
		while (i < this.World.SceneGraph.length)
		{
			if (typeof this.World.SceneGraph[i]["Update"] !== 'undefined')
			{
				this.World.SceneGraph[i].Update(dt);
				Graphics.CheckLayer( this.World.SceneGraph[i].Position.z );
				this.World.SceneGraph[i].Draw(Graphics.ContextCache);
			}
			i++;
		}
		setTimeout( function() { Game.Update(newTime); }, 1000 / Game.Settings.FPS);
	},
};