Sound =
{
	New : function(filename)
	{
		var sound =
		{
			Sound : document.createElement("audio"),
			Filename : filename,
			Loaded : false,
			onload : function(){}
		}
		sound.Sound.onload = function()
		{
			sound.Loaded = true;
		}
		sound.Sound.src = filename;
	}
}