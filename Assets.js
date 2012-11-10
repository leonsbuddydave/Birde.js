Assets =
{
	AssetCache : [],
	AddSprite : function(spr)
	{
		this.AssetCache.push(spr);
		return (this.AssetCache.length - 1);
	},

	AddSound : function(sound)
	{
		this.AssetCache.push(sound);
		return (this.AssetCache.length - 1);
	}
};