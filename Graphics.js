Graphics =
{
	Flags :
	{
		CLEARCOLOR : "#555"
	},
	SetFlag : function(flag, value)
	{
		this.Flags[flag] = value;
	},
	Width : null,
	Height: null,
	
	/*
		ContextCache stores all the layers that things will be drawn on
		It's an object instead of an array because all intervening layers may not
		exist
	*/
	Canvas : null,
	Context : null,
	TopContext : 0,
	SetupCanvas : function(TargetCanvasID)
	{
		this.Canvas = document.getElementById(TargetCanvasID);
		this.Width = this.Canvas.width;
		this.Height = this.Canvas.height;
		this.Canvas.style.zIndex = 0;
		this.Context = this.Canvas.getContext('2d');
		Drawing.RawContext = this.Context;
	},
	
	/*
		Clear
		
		This method clears the canvas each frame
	*/	
	Clear : function()
	{
		this.Context.fillStyle = this.Flags.CLEARCOLOR;
		this.Context.fillRect(0, 0, this.Width, this.Height);
	}
}