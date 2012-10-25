function ColorRGB(r, g, b)
{
	this.type = "RGB";
	this.r = r;
	this.g = g;
	this.b = b;
	
	this.toHex = function()
	{
		// Converts this color to hex
		var h = "#";
		h += parseInt(this.r, 16);
		h += parseInt(this.g, 16);
		h += parseInt(this.b, 16);
		return h;
	}
	
	this.toRGB = function()
	{
		// Returns an RGB string that can be used for canvas drawing, etc
		return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
	}
	
	this.asRGBA = function(a)
	{
		// returns this color as RGBA (adds alpha channel, defaults to 255)
		a = a || 255;
		return new ColorRGBA(this.r, this.g, this.b, 255);
	}
	
	this.Equals = function(Other)
	{
		if (Other.type == "RGB") // Comparing two RGB colors
			return ( this.r == Other.r && this.g == Other.g && this.b == Other.b );
		else if (Other.type == "RGBA") // will only return true if all colors match and Other is opaque
			return ( this.r == Other.r && this.g == Other.g && this.b == Other.b && Other.a == 255);
		else
			return false;
	}
	
	this.toString = this.toRGB;
}

function ColorRGBA(r, g, b, a)
{
	this.type = "RGBA";
	this.r = r;
	this.g = g;
	this.b = b;
	this.a = a;
	
	this.toHex = function()
	{
		// returns this color as hex
		var h = "#";
		h += parseInt(this.r, 16);
		h += parseInt(this.g, 16);
		h += parseInt(this.b, 16);
		h += parseInt(this.a, 16);
		return h;
	}
	
	this.toRGBA = function()
	{
		// Returns an RGBA string that can be used for canvas drawing, etc
		return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
	}
	
	this.toString = this.toRGBA;
	
	this.asRGB = function()
	{
		// returns this color as RGB (WARNING: Results in loss of alpha channel, obviously)
		return new ColorRGB(this.r, this.g, this.b);
	}
	
	this.Equals = function(Other)
	{
		if (Other.type == "RGBA") // Comparing two RGB colors
			return ( this.r == Other.r && this.g == Other.g && this.b == Other.b && this.a == Other.a);
		else if (Other.type == "RGB") // will only return true if all colors match and Other is opaque
			return ( this.r == Other.r && this.g == Other.g && this.b == Other.b && this.a == 255);
		return false;
	}
}