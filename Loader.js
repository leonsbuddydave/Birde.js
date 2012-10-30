Loader =
{
	onload : function()
	{
		console.log("All content loaded.");
	},
	IsLoaded : false,
	ContentTypes : ["Sprites"],
	IncreaseLoadTarget : function(ContentType)
	{
		this[ContentType].LoadedTarget++;
	},
	UpdateLoaded : function(ContentType)
	{
		this[ContentType].Loaded++;
		this.CheckIsLoaded();
	},
	CheckIsLoaded : function()
	{
		for (type in this.ContentTypes)
		{
			if (this.ContentTypes[type].Loaded !== this.ContentTypes[type].LoadedTarget)
				return false;
		}
		this.IsLoaded = true;
		this.onload();
	},
	Sprites :
	{
		LoadedTarget : 0,
		Loaded : 0
	}
}