Sprite =
{
	// Notes: probably make this take an object at some point - let it have some defaults to make things easier
	// Ideally get it simplified so that it can accept (filename, width, height) and we'll figure the rest out for you
	New : function(filename, width, height, offsetX, offsetY, count, margin, vertical)
	{
		Loader.IncreaseLoadTarget("Sprites");
		var im = new Image();
		var spr = {
			Frames : [],
			OriginalImage : new Image(),
			Loaded : false,
			SpriteData :
			{
				Filename : "",
				Width : 0,
				Height: 0,
				OffsetX : 0,
				OffsetY : 0,
				Count : 0,
				Margin : 0,
				Vertical : false
			},
			onload : function(){}
		};
		if (arguments.length == 1)
		{
			spr.OriginalImage.onload = function()
			{
				spr.Frames.push(spr.OriginalImage);
				spr.Loaded = true;
			}

			// Only filename has been provided, assume everything else
			spr.OriginalImage.src = filename;

			return Assets.AddSprite(spr);
		}
		else if (arguments.length >= 7)
		{
			// We've got everything
			if (!vertical)
				vertical = false;

			spr.SpriteData =
			{
				Filename : filename,
				Width : width,
				Height: height,
				OffsetX : offsetX,
				OffsetY : offsetY,
				Count : count,
				Margin : margin,
				Vertical : vertical
			}
				
			spr.OriginalImage.onload = function()
			{
				spr.Frames = Sprite.DivideSpriteSheet(
					spr.SpriteData.Filename,
					spr.SpriteData.Width,
					spr.SpriteData.Height,
					spr.SpriteData.OffsetX,
					spr.SpriteData.OffsetY,
					spr.SpriteData.Count,
					spr.SpriteData.Margin,
					spr.SpriteData.Vertical
				);
				spr.Loaded = true;
				Loader.UpdateLoaded("Sprites");
			}

			spr.OriginalImage.src = filename;

			return Assets.AddSprite(spr);
		}
		else
		{
			// Shit got fucked up. What do you think you're doing?
			// What are you, Hitler?
		}
		
		return spr;
	},
	
	DivideSpriteSheet : function(filename, width, height, offsetX, offsetY, count, margin, vertical)
	{
		console.log("Dividing sprite sheet " + filename);
		// Load the sprite as an image
		var sheet = new Image();
		sheet.src = filename;
		
		// Create a canvas in memory to draw to
		var canvas = document.createElement("canvas");
		canvas.width = sheet.width;
		canvas.height = sheet.height;
		
		var SourceContext = canvas.getContext('2d');
		SourceContext.drawImage( sheet, 0, 0 );
		
		var Frames = [];
		
		var FrameCanvas = document.createElement("canvas");
		FrameCanvas.width = width;
		FrameCanvas.height = height;
		var FrameContext = FrameCanvas.getContext('2d');
		
		if (!vertical)
		{
			// Default. horizontal cutting
			var i = 0;
			while (i < count)
			{
				Frames.push( new Image() );
				
				var x = offsetX + (i * width) + (i * margin);
				var y = offsetY;
				
				// transfer section to context
				var data = SourceContext.getImageData(x, y, width, height);
				
				//console.log(data);
				
				FrameContext.putImageData( data, 0, 0 );
				
				// convert to data url
				Frames[i].src = FrameCanvas.toDataURL();
				i++;
			}
		}
		else
		{
			// Vertical cutting, yeah
		}
		
		return Frames;
	}
}