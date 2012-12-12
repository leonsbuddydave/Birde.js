var imageFileRegex = /\.(jpg)|(jpeg)|(bmp)|(gif)|(png)$/gi;

var audioFileRegex = /\.(mp3)|(ogg)$/gi;

var Loader =
{
	/**
	* Denotes how many nodes have finished loading
	*/
	NodesComplete : 0,

	Load : function(filename)
	{
		var el;

		if ( filename.match(imageFileRegex) )
		{
			el = new MediaElement(filename, "image", this.NodeLoaded);
		}
		else if ( filename.match(audioFileRegex) )
		{
			el = new MediaElement(filename, "audio", this.NodeLoaded);
		}
		else
		{
			el = new MediaElement(filename, "fucking", this.NodeLoaded);
		}

		this.Content[filename] = el;
	},

	Content : {},

	NodeLoaded : function()
	{
		Loader.NodesComplete++;

		for (var key in EventRegistry.contentloadupdate)
		{
			var a = EventRegistry.contentloadupdate[key];
			a.response.call(a.target, Loader.NodesComplete, 4)
		}
	}	
}

var MediaElement = function(filename, type, callback)
{
	this.filename = filename;
	this.type = type;
	this.callback = callback;
	this.element;
	
	switch(this.type)
	{
		case "image":
			this.element = new Image();
		case "audio":
			this.element = new Audio();
	}
	
	this.element.onload = this.callback;
	this.element.src = filename;
}
