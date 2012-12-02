EXCEPTION =
{
	FRAMEINDEXEXCEPTION : "FRAMEINDEXEXCEPTION",
	DRAWSPRITEEXCEPTION : "SPRITEEXCEPTION"
}

Exception =
{
	Throw : function(type, location)
	{
		console.log("Exception of type " + type + " in " + location);
		if (arguments.length > 2)
		{
			console.log("Relevant info: ");
			var i = 2;
			while (i < arguments.length)
			{
				console.log(arguments[i]);
				i++;
			}
		}

		
		Game.Stop();
	}
}