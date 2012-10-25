Array2D =
{
	New : function(def, width, height)
	{
		var a = [];
		var i = 0;
		while (i < width)
		{
			a.push([]);
			var j = 0;
			while (j < height)
			{
				a[i].push(def);
				j++;
			}
			i++;
		}
		
		return a;
	},
	
	Copy : function(source)
	{
		var dest = this.New(0, source.length, source[0].length);
		var x = 0;
		while (x < source.length)
		{
			var y = 0;
			while (y < source[0].length)
			{
				dest[x][y] = source[x][y];
				y++;
			}
			x++;
		}
		
		return dest;
	}
}