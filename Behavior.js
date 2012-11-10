Behavior =
{
	New : function(props)
	{
		props = props || {};

		/*
			Possible props:

			Step
			Start
			Complete
		*/


		return
		{
			Step : props.Step,
			Start : props.Start,
			Complete : props.Complete,
			Duration : 0.0
			Data :
			{
				TimelineEnd : 0.0
			}
		};
	}
}