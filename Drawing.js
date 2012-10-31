Drawing = 
 {
	RawContext : null,
	
	Okay : function()
	{
		if ( typeof this.RawContext == 'undefined' || this.RawContext == null )
			return false;

		return true;
	},

	/*
		wo is a WorldObject that has sprites
	*/
	DrawSprite : function(wo)
	{
		if (!this.Okay())
			return this;

		if (wo.SpriteData.CurSprite !== "")
		{
			var frame = Assets.AssetCache[wo.Sprites[wo.SpriteData.CurSprite]].Frames[wo.SpriteData.CurFrame];
			if (!frame)
				Exception.Throw(EXCEPTION.DRAWSPRITEEXCEPTION, "Drawing.DrawSprite", wo, frame)
			this.RawContext.drawImage( frame, wo.x, wo.y, frame.width * wo.Scale, frame.height * wo.Scale );
		}
	}
 };