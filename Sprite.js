Sprite =
{
	New : function(filename, width, height, offset, count)
	{
		var im = new Image();
		var spr = {
			frames : []
		};
		if (typeof width == 'undefined' || width == null)
		{
			// Only filename has been provided, assume everything else
			im.src = filename;
			
			spr.frames.push( im );
		}
		
		return spr;
	}
}