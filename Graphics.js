Graphics =
{
	Width : null,
	Height: null,
	/*
		ContextCache stores all the layers that things will be drawn on
		It's an object instead of an array because all intervening layers may not
		exist
	*/
	CanvasCache : {},
	ContextCache : {},
	SetupCanvas : function(TargetCanvasID)
	{
		this.CanvasCache[0] = document.getElementById(TargetCanvasID);
		this.Width = this.CanvasCache[0].width;
		this.Height = this.CanvasCache[0].height;
		this.CanvasCache[0].style.zIndex = 0;
		this.ContextCache[0] = this.CanvasCache[0].getContext('2d');
	},
	
	/*
		CheckLayer:
		// LayerID: Integer id of the layer to check the existence of
		
		This checks for the existence of a canvas/context corresponding to a layer,
		and creates it if it does not already exist.
	*/
	
	CheckLayer : function(LayerID)
	{
		if (typeof this.ContextCache[LayerID] !== 'undefined' || typeof this.CanvasCache[LayerID] !== 'undefined')
			return; // This level of the cache already exists
		else
		{
			// Create the element
			var Canvas = document.createElement('canvas');
			
			// Position and size it like the original canvas
			Canvas.style.position = "absolute";
			Canvas.style.zIndex = LayerID;
			Canvas.style.left = this.CanvasCache[0].offsetLeft;
			Canvas.style.top = this.CanvasCache[0].offsetTop;
			Canvas.width = this.Width;
			Canvas.height = this.Height;
			
			// Add each element to its respective cache
			this.ContextCache[LayerID] =  Canvas.getContext('2d');
			this.CanvasCache[LayerID] = Canvas;
			
			// Add the canvas itself to the document
			this.CanvasCache[0].parentNode.insertBefore(Canvas, this.CanvasCache[0]);
		}		
	},
	
	/*
		This method clears all the buffers each frame.
	*/	
	
	Clear : function()
	{
		for (var ContextID in this.ContextCache)
		{
			this.ContextCache[ContextID].clearRect(0, 0, this.Width, this.Height);
		}
	},
}