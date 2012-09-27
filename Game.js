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

Game = {
	Running : false,
	Settings :
	{
		FPS : 60,
		TargetCanvasID : null
	},
	
	Setup : function(TargetCanvasID)
	{
		Graphics.SetupCanvas(TargetCanvasID);
		EventDelegate.Initialize(TargetCanvasID);
		return this;
	},
	
	Start : function(TargetCanvasID)
	{
		// If debugging is turned off, just get rid of console.log completely
		if (!DEBUG)
			console.log = function(){ /* This function does nothing */ };
			
		if (typeof TargetCanvasID == 'undefined' || TargetCanvasID == null)
			if (typeof this.Settings.TargetCanvasID == 'undefined' || this.Settings.TargetCanvasID == null)
				return null;
			else
				TargetCanvasID = this.Settings.TargetCanvasID;
		else
			this.Settings.TargetCanvasID = TargetCanvasID;
		
		
		console.log("Starting engine.");
		
		// Call the setup method to get everything in place
		this.Setup(TargetCanvasID);
		
		// Start the game loop
		this.Running = true;
		this.Update( 0 );
		return this;
	},
	
	Stop : function()
	{
		this.Running = false;
		return this;
	},

	Input : 
	{
	
	},
	Update : function(lastTime)
	{
		
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
		
		if (DEBUG)
		{
			Debug.FPS = Math.floor( 1000 / dt );
			Debug.Draw();
		}
		
		if (!this.Running) // Game has been told to stop
			return;

		this.LoopHandle = setTimeout( function() { Game.Update(newTime); }, 1000 / Game.Settings.FPS);
	},
};