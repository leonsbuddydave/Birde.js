/**
* Drawing module. Keeps an internal reference to the canvas and context currently in use, and provides a higher-level interface
* to drawing things on the canvas to keep it simple. A reference to this module gets passed to every draw method.
*/
var Drawing =
{
	/**
	* Initializes the drawing area and stores some useful information about it - Width, Height, ClearColor, etc.
	*/
	init : function(props)
	{
		this.Canvas = document.getElementById( props.Canvas );
		this.Context = props.Context = this.Canvas.getContext('2d');
		this.ClearColor = props.ClearColor;
		this.Width = this.Canvas.width;
		this.Height = this.Canvas.height;

		this.StartSettings.Width = this.Width;
		this.StartSettings.Height = this.Height;

		// Prepare the drawing cache
		this.Cache.rebuild = function()
		{
			this.gatherAndSortScene();
		}

		this.Cache.gatherAndSortScene = function()
		{
			this.length = 0;
			for (var key in EventRegistry.draw)
			{
				this.push(EventRegistry.draw[key]);
			}

			this.sort(function(a, b)
			{
				return a.target.z - b.target.z;
			});
		}
	},

	Canvas : null,
	Context : null,
	ClearColor : "#fff",
	Width : 0,
	Height : 0,
	isFullscreen : false,

	Cache : new Cache(),

	Step : function()
	{
		this.Clear();

		this.Cache.updateIfInvalid();

		var i = 0;
		while (i < this.Cache.length)
		{
			var a = this.Cache[i];
			a.response.call(a.target, this);
			i++;
		}
	},

	/**
	* Clears the visible canvas with the stored ClearColor.
	*/
	Clear : function()
	{
		this.Context.fillStyle = this.ClearColor;
		this.Context.fillRect(0, 0, this.Width, this.Height);
		this.Context.fill();
	},

	/**
	* Draws the default collision boundaries for an object using its x, y, w and h properties.
	* Currently does NOT support drawing custom collision polygons generated at runtime.
	*/
	DrawBounds : function(actor)
	{
		this.Context.fillStyle = actor.color || "#f00";

		var pos = actor.getScreenPos();

		this.Context.fillRect(pos.x, pos.y, actor.w, actor.h);
		this.Context.fill();
	},

	/**
	* Used as backup when changes need to be made to the canvas (such as fullscreening it)
	*/
	StartSettings :
	{
		Width : 0,
		Height : 0
	},

	/**
	* Temporary prototype method used for "fullscreening" the canvas area.
	*/
	ToggleFullscreen : function()
	{
		if (!this.isFullscreen)
		{
			var newWidth = document.body.scrollWidth;
			var newHeight = document.body.scrollHeight;

			if (newWidth == 0 || newHeight == 0)
				return;

			this.StartSettings.Width = this.Width;
			this.StartSettings.Height = this.Height;

			this.Canvas.style.position = "absolute";
			this.Canvas.style.top = "0";
			this.Canvas.style.left = "0";
			this.Canvas.width = newWidth;
			this.Canvas.height = newHeight;
			this.Width = this.Canvas.width;
			this.Height = this.Canvas.height;
		}
		else
		{
			this.Canvas.width = this.StartSettings.Width;
			this.Canvas.height = this.StartSettings.Height;
			this.Width = this.Canvas.width;
			this.Height = this.Canvas.height;
		}

		this.isFullscreen = !this.isFullscreen;
	}
}