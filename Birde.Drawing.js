/**
* Drawing module. Keeps an internal reference to the canvas and context currently in use, and provides a higher-level interface
* to drawing things on the canvas to keep it simple. A reference to this module gets passed to every draw method.
*/
var Drawing =
{
	/**
	* Initializes the drawing area and stores some useful information about it - Width, Height, clearColor, etc.
	*/
	init : function(props)
	{
		this.canvas = document.getElementById( props.canvas );
		this.context = props.context = this.canvas.getContext('2d');
		this.clearColor = props.clearColor;
		this.Width = this.canvas.width;
		this.Height = this.canvas.height;

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

	canvas : null,
	context : null,
	clearColor : "#fff",
	Width : 0,
	Height : 0,
	isFullscreen : false,

	Cache : new Cache(),

	step : function()
	{
		this.clear();

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
	* clears the visible canvas with the stored clearColor.
	*/
	clear : function()
	{
		this.context.fillStyle = this.clearColor;
		this.context.fillRect(0, 0, this.Width, this.Height);
		this.context.fill();
	},

	/**
	* Draws the default collision boundaries for an object using its x, y, w and h properties.
	* Currently does NOT support drawing custom collision polygons generated at runtime.
	*/
	drawBounds : function(actor)
	{
		var pos = actor.getScreenPos();

		this.context.save();
		this.context.fillStyle = actor.color || "#f00";
		this.context.fillRect(pos.x, pos.y, actor.w, actor.h);
		this.context.restore();
	},

	/**
	* Draws a given actor's collision boundaries
	*/
	drawCollisionBounds : function(actor)
	{
		if (!(actor instanceof Actor))
		{
			b.log("Birde.Drawing.js : Drawing.DrawCollisionBounds : Invalid argument.");
			return;
		}

		var pos = actor.getScreenPos();
		var origin = actor.origin;
		var shape = actor.collisionShape;

		if (shape == null)
			return;

		this.context.save();

		this.context.strokeStyle = actor.color || "#00f";
		this.context.fillStyle = "";
		this.context.lineWidth = 2;
		this.context.translate( pos.x + origin.x, pos.y + origin.y );
		this.context.rotate( BMath.degToRad( actor.rotation ) );

		if (shape instanceof Shape.Rectangle)
		{
			this.context.beginPath();
			this.context.strokeRect(shape.x1, shape.y1, shape.w, shape.h);
			this.context.closePath();
		}
		else if (shape instanceof Shape.Circle)
		{
			this.context.beginPath();
			this.context.arc( shape.centerPoint.x, shape.centerPoint.y, shape.radius, 0, BMath.TAU, false );
			this.context.closePath();
			this.context.stroke();
			//this.context.fill();
		}
		else if (shape instanceof Shape.Polygon)
		{
			// not implemented yet
		}
		else
		{
			// why
		}

		this.context.restore();
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

			this.canvas.style.position = "absolute";
			this.canvas.style.top = "0";
			this.canvas.style.left = "0";
			this.canvas.width = newWidth;
			this.canvas.height = newHeight;
			this.Width = this.canvas.width;
			this.Height = this.canvas.height;
		}
		else
		{
			this.canvas.width = this.StartSettings.Width;
			this.canvas.height = this.StartSettings.Height;
			this.Width = this.canvas.width;
			this.Height = this.canvas.height;
		}

		this.isFullscreen = !this.isFullscreen;
	}
}