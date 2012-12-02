EventDelegate = 
{
	EventShield : null,

	MouseDeltaManager :
	{
		Update : function(ev)
		{
			this.DeltaX = ev.offsetX - this.LastX;
			this.DeltaY = ev.offsetY - this.LastY;
			this.LastX = ev.offsetX;
			this.LastY = ev.offsetY;
		},
		LastX : 0,
		LastY : 0,
		DeltaX : 0,
		DeltaY : 0
	},

	Initialize : function(TargetElementID)
	{
		var EventElement = document.getElementById(TargetElementID);
	
		if (EventElement.nodeName !== 'CANVAS')
		{
			console.log("EventDelegate initialization failed. Bad event target: " + EventElement.nodeName);
			return;
		}
		
		var EventShield = EventElement;
		EventShield.tabIndex = -1;
		EventShield.onselectstart = function(){};
		
			
		// Register element for all supported events, to be handled by HandleLiveEvent
		EventShield.onclick = 
		EventShield.onmousedown =
		EventShield.onmouseup = 
		EventShield.onmouseover = 
		EventShield.onmouseout = 
		EventShield.onmousemove = 
		EventShield.onkeyup = 
		EventShield.onkeydown = 
		EventShield.onkeypress = 
		EventShield.onblur = 
		EventShield.onfocus = 
		this.HandleLiveEvent;
		
		EventShield.focus();
	},
	CreateEventShield : function(EventElement)
	{
		/*
			Attaches events to the canvas
		*/
		
		// Create the element
		var EventShield = document.createElement('div');
		
		// Position and size it like the canvas
		EventShield.style.position = "absolute";
		EventShield.style.zIndex = 101;
		EventShield.style.left = EventElement.offsetLeft;
		EventShield.style.top = EventElement.offsetTop;
		EventShield.style.width = EventElement.offsetWidth;
		EventShield.style.height = EventElement.offsetHeight;
		
		return this.EventShield;
	},
	RegisterObject : function(TargetObject)
	{
		// Given an object, this method automatically registers it for all events
		// that it's capable of handling
		for (var Event in TargetObject.Events)
		{
			if (typeof this.EventRegistries[Event] !== 'undefined')
				this.EventRegistries[Event].push(TargetObject);
		}
	},
	HandleLiveEvent : function(EventObject)
	{
		//arguments[0].preventDefault();
		EventDelegate.MouseDeltaManager.Update(EventObject);

		if (EventObject.type == "keyup")
			Keyboard.SetState(EventObject.keyCode, KEYSTATE.UP);
		else if (EventObject.type == "keydown")
			Keyboard.SetState(EventObject.keyCode, KEYSTATE.DOWN);

		var MatchingEvents = EventDelegate.EventRegistries[EventObject.type];
		
		//console.log("Handling live event: ", EventObject.type);
		for (var Object in MatchingEvents)
		{
			// Fire each objects event, passing it the event object
			MatchingEvents[Object].Events[EventObject.type](MatchingEvents[Object], EventDelegate.ConvertEvent(EventObject));
		}
	},
	ConvertEvent : function(e)
	{
		var ev = {};
		
		ev.Alt = e.altKey;
		ev.Ctrl = e.ctrlKey;
		ev.Meta = e.metaKey;
		ev.Shift = e.shiftKey;
		ev.MouseButton = e.button;
		ev.CharCode = e.charCode;
		ev.KeyCode = e.keyCode;
		ev.x = e.offsetX;
		ev.y = e.offsetY;
		ev.Type = e.type;
		ev.MouseDelta = { 
			x : EventDelegate.MouseDeltaManager.DeltaX,
			y : EventDelegate.MouseDeltaManager.DeltaY
		};
		ev.WorldMouse = {
			x : -1 * World.x + e.offsetX,
			y : -1 * World.y + e.offsetY
		};

		return ev;
	},
	EventRegistries :
	{
		"click" : [],
		"mousedown" : [],
		"mouseup" : [],
		"mouseover" : [],
		"mouseout" : [],
		"mousemove" : [],
		"keyup" : [],
		"keydown" : [],
		"keypress" : [],
		"blur" : [],
		"focus" : []
	}
 }