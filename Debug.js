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
		
		c.fillText("SCENE: " + World.SceneGraph.length + " OBJECTS", 20, 40);

		if (!Game.Running)
		{
			c.fillText("PAUSED", 20, 40);
		}
	},

	DrawCollisionPoly : function(obj)
	{
		var c = Graphics.Context;
		if (obj.Collision.type == CollisionType.BOX)
		{
			c.strokeStyle = "#f00";
			c.strokeRect(obj.x + obj.Collision.origin.x - 1, obj.y + obj.Collision.origin.y - 1, obj.Collision.width + 2, obj.Collision.height + 2);
		}
	}
}