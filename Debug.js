DEBUG = true;
// If this file is included, this flag will be set to true
// To turn off debug mode, do not change this flag, just remove the reference to this file

Debug = {
	FPS : 0,
	Draw : function()
	{
		var c = Graphics.ContextCache[ 0 ];
		c.fillStyle="#000";
		c.lineStyle="#fff";
		c.font="18px sans-serif";
		c.fillText("FPS: " + this.FPS, 20, 20);
	}
}