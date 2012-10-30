DEBUG = true;
// If this file is included, this flag will be set to true
// To turn off debug mode, do not change this flag, just remove the reference to this file

Debug = {
	FPS : 0,
	// Draw gives us the debugging hud if it's called
	Draw : function()
	{
		var c = Graphics.Context;
		c.fillStyle="#000";
		c.lineStyle="#fff";
		c.font="18px sans-serif";
		c.fillText("FPS: " + this.FPS, 20, 20);
		
		if (!Game.Running)
		{
			c.fillText("PAUSED", 20, 40);
		}
	}
}