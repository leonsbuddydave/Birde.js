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

		if (wo.Sprites.Idle.Loaded && wo.SpriteData.CurSprite !== "")
		{
			var frame = wo.Sprites[wo.SpriteData.CurSprite].Frames[wo.SpriteData.CurFrame];
			this.RawContext.drawImage( frame, wo.x, wo.y, frame.width * wo.Scale, frame.height * wo.Scale );
		}
	}
 };