function DeepCopy(p, c)
{
	if (p == window)
		return;
	var c = c || {};
	for (var i in p)
	{
		if (typeof p[i] === 'object' && p[i] != null && p[i].nodeName != "IMG")
		{
			c[i] = ( p[i].constructor === Array ) ? [] : {};
			DeepCopy( p[i] , c[i] );
		}
		else if (typeof p[i] === 'object' && p[i] != null && p[i].nodeName == "IMG")
		{
			// Special case for image
			// Might turn into a special case for all HTML elements?
			c[i] = new Image();
			c[i].src = p[i].src;
		}
		else if (typeof c[i] == 'undefined')
		{
			c[i] = p[i];
		}
	}
	return c;
}