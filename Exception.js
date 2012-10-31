EXCEPTION =
{
	FRAMEINDEXEXCEPTION : "FRAMEINDEXEXCEPTION"
}

Exception =
{
	Throw : function(type, location, fatal)
	{
		console.log("Exception of type " + type + " in " + location);

		if (fatal)
			Game.Stop();
	}
}