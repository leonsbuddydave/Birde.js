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

			var x, y;

			if (wo.Positioning == POSITION.SCREEN)
			{
				x = wo.x;
				y = wo.y;
			}
			else if (wo.Positioning == POSITION.WORLD)
			{
				x = World.x + wo.x;
				y = World.y + wo.y;
			}
			this.RawContext.drawImage( frame, x, y, frame.width * wo.Scale, frame.height * wo.Scale );
		}
	}
 };