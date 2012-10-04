function DeepCopy(p, c)
{
	if (p == window)
		return;
	var c = c||{};
	for (var i in p)
	{
		if (typeof p[i] === 'object' && p[i] != null)
		{
			c[i] = ( p[i].constructor === Array ) ? [] : {};
			DeepCopy( p[i] , c[i] );
		}
		else if (typeof c[i] == 'undefined')
		{
			c[i] = p[i];
		}
	}
	return c;
}