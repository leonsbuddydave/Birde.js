Assets =
{
	AssetCache : [],
	AddSprite : function(spr)
	{
		this.AssetCache.push(spr);
		return (this.AssetCache.length - 1);
	}
};