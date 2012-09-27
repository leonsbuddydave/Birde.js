Math.slope = function(x1, y1, x2, y2)
{
	var SlopeX = x2 - x1;
	var SlopeY = y2 - y1;
	var ratio = 0;
	
	// if (SlopeX <= SlopeY)
	// {
		// ratio = 1 / SlopeX;
		// SlopeX = 1;
		// SlopeY *= ratio;
	// }
	// else
	// {
		// ratio = 1 / SlopeY;
		// SlopeY = 1;
		// SlopeX *= ratio;
	// }
	
	return { x: SlopeX, y: SlopeY }
}