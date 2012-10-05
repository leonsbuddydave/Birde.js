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
	CanvasCache : {},
	ContextCache : {},
	TopContext : 0,
	SetupCanvas : function(TargetCanvasID)
	{
		this.CanvasCache[0] = document.getElementById(TargetCanvasID);
		this.Width = this.CanvasCache[0].width;
		this.Height = this.CanvasCache[0].height;
		this.CanvasCache[0].style.zIndex = 0;
		this.ContextCache[0] = this.CanvasCache[0].getContext('2d');
	},
	
	/*
		Clear
		
		This method clears the canvas each frame
	*/	
	Clear : function()
	{
		this.ContextCache[0].fillStyle = this.Flags.CLEARCOLOR;
		this.ContextCache[0].fillRect(0, 0, this.Width, this.Height);
	}
}