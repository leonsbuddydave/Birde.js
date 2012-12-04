var Selector = function(selector)
{
	selector = selector.replace(/\s/g, "");

	this.parts = [""];

	this.cur_index = 0;

	var i = 0;
	while ( i < selector.length )
	{
		// iterates the selector character by character to break it into manageable chunks

		// adds letters, hyphens, and underscores (all valid parts of classes)
		if ( selector[i].match(/[\w+\-\_]/gi) )
			this.parts[this.cur_index] += selector[i];

		// Breaks and adds selector identifiers
		else if (selector[i].match(/[\.#>\:]/g))
		{
			if (i != 0)
				this.cur_index++;
			this.parts[this.cur_index] = selector[i];
		}
		i++;
	}

	this.iterator = this.parts.length - 1;

	/**
	* When called repeatedly, iterates over each part of the selector
	*/
	this.Next = function()
	{
		if (this.iterator == -1)
		{
			this.iterator = this.parts.length - 1;
			return false;
		}
		else
			return this.parts[this.iterator--];
	}
}