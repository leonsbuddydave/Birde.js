ParticleEmitter = WorldObject.Extend({
	// Acknowledged props
	// x
	// y
	// density
	// type

	x: 500,
	y: 500,
	density : 0,
	enabled : 0,
	Particles : [],
	Type : "Simple",

	Class : "ParticleEmitter",

	Init : function(Me, props)
	{
		props = props || {};
		Me.x = props.x || 0;
		Me.y = props.y || 0;
		Me.density = props.density || 0;
		Me.enabled = props.enabled || 0;

		Me.Particles = [];

		Me.Type = props.type || "Simple";
	},

	AddParticle : function(Me, type)
	{
		Me.Particles.push( new Particle[type](Me.x, Me.y) );
	},

	Update : function(Me, dt)
	{
		// Add new particles Me second
		var NumParticlesToCreate = dt * Me.density;
		var i = 0;
		while (i < NumParticlesToCreate)
		{
			Me.AddParticle(Me, Me.Type);
			i++;
		}

		// Now update all the particles that are there
		i = 0;
		var NewParticles = [];
		while (i < Me.Particles.length)
		{
			var p = Me.Particles[i];
			p.update(dt);
			if (!p.lifetime || p.lifetime >= 0)
			{
				if (!p.kill)
					NewParticles.push(p);
			}
			i++;
		}

		Me.Particles = NewParticles;
	},

	Draw : function(Me, c)
	{
		var i = 0;
		while (i < Me.Particles.length)
		{
			var p = Me.Particles[i];
			p.draw(c);
			i++;
		}
	}
});

Particle =
{
	Simple : function(x, y)
	{
		var color = "#f00";
		var x = x;
		var y = y;
		var vx = Math.floor( Math.random() * 50) - 25;
		var vy = -1 * Math.floor( Math.random() * 200);
		var radius = 1;

		this.lifetime = 1000;

		this.update = function(dt)
		{
			x += vx * dt;
			y += vy * dt;

			this.lifetime -= 1000 * dt;
		}

		this.draw = function(c)
		{
			c.fillStyle = color;
			//c.fillRect(p.x, p.y, 5, 5);
			c.globalAlpha = 1.0;
			c.beginPath();
			c.arc(x, y, radius, 0, (Math.PI * 2), false);
			c.closePath();
			c.fill();
		}
	},
	ScorchedEarth : function(x, y)
	{
		var color = "#f00";
		var x = x;
		var y = y;
		var vx = Math.floor( Math.random() * 50) - 25;
		var vy =  Math.floor( Math.random() * 200) - 100;
		var radius = 1;

		this.lifetime = 1000;

		this.update = function(dt)
		{
			x += vx * dt;
			y += vy * dt;

			this.lifetime -= 1000 * dt;
		}

		this.draw = function(c)
		{
			c.fillStyle = color;
			//c.fillRect(p.x, p.y, 5, 5);
			c.globalAlpha = .02;
			c.beginPath();
			c.arc(x, y, radius, 0, (Math.PI * 2), false);
			c.closePath();
			c.fill();
		}
	},
	Scanlines : function(x, y)
	{
		var color = "#fefd99";
		var x = x;
		var y = y;
		var vx = Math.random() * 200 - 100;
		var vy = 400;
		var opacity = .9;

		this.update = function(dt)
		{
			x += vx * dt;
			y += vy * dt;

			opacity -= .1 * dt;
		}

		this.draw = function(c)
		{
			c.fillStyle = color;
			c.globalAlpha = opacity;
			c.beginPath();
			c.arc(x, y, 1, 0, (Math.PI * 2), false);
			c.closePath();
			c.fill();
		}

	},
	Strand : function(x, y)
	{
		var color = "#fefd99";
		var x = x;
		var y = y;
		var vx = (Math.random() < 0.5 ? -1 : 1) * 200;
		var vy = (Math.random() < 0.5 ? -1 : 1) * 200;
		var opacity = .9;
		this.kill = false;

		this.update = function(dt)
		{
			x += vx * dt;
			y += vy * dt;

			opacity -= .1 * dt;

			if (opacity <= 0)
			{
				opacity = 0;
				this.kill = true;
			}
		}

		this.draw = function(c)
		{
			c.fillStyle = color;
			c.globalAlpha = opacity;
			c.beginPath();
			c.arc(x, y, 1, 0, (Math.PI * 2), false);
			c.closePath();
			c.fill();
		}
	},
	Water : function(x, y)
	{
		var color = "#24a0dc";
		var x = x + Math.random() * 40 - 20;
		var y = y;
		var vx = 0;
		var vy = 300 * Math.random();

		this.lifetime = 2000;

		this.update = function(dt)
		{
			x += vx * dt;
			y += vy * dt;

			this.lifetime -= dt * 1000;

			if (this.lifetime < 200)
				color = "#a9ddf6";
		}

		this.draw = function(c)
		{
			c.fillStyle = color;
			c.globalAlpha = 1.0;
			c.beginPath();
			c.arc(x, y, 1, 0, (Math.PI * 2), false);
			c.closePath();
			c.fill();
		}
	},
	Glitch : function(x, y)
	{
		var color = "#277231";
		var x = x;
		var y = y;
		var vx = Mouse.deltaX * 100 * Math.random() * (Math.random() < .5 ? -1 : 1);
		var vy = Mouse.deltaY * 100 * Math.random() * (Math.random() < .5 ? -1 : 1);

		this.lifetime = 1000;

		this.update = function(dt)
		{
			x += vx * dt;
			y += vy * dt;

			this.lifetime -= dt * 1000;

			if (this.lifetime < 200)
				color = "#334f37";
		}

		this.draw = function(c)
		{
			c.fillStyle = color;
			c.globalAlpha = 1.0;
			c.beginPath();
			c.arc(x, y, 1, 0, (Math.PI * 2), false);
			c.closePath();
			c.fill();
		}
	},
	Sparks : function(x, y)
	{
		var color = "#fefd99";
		var x = x;
		var y = y;
		var vx = Math.random() * 200 - 100;
		var vy = Math.random() * 200 - 100;
		var opacity = .9;
		this.lifetime = 1000;

		this.update = function(dt)
		{
			x += vx * dt;
			y += vy * dt;

			opacity -= .1 * dt;

			if (this.lifetime < 500)
				color = "#fff";

			this.lifetime -= dt * 1000;
		}

		this.draw = function(c)
		{
			c.fillStyle = color;
			c.globalAlpha = opacity;
			c.beginPath();
			c.arc(x, y, 1, 0, (Math.PI * 2), false);
			c.closePath();
			c.fill();
		}

	},
	Rain : function()
	{
		var color = "#145b7d";
		var x = 2000 * Math.random() - 1000;
		var y = -100 * Math.random();
		var vx = 50;
		var vy = 500;
		this.kill = false;

		this.update = function(dt)
		{
			x += vx * dt;
			y += vy * dt;

			if (y > 800)
				this.kill = true;
		}

		this.draw = function(c)
		{
			c.fillStyle = color;
			c.beginPath();
			c.arc(x, y, 1, 0, (Math.PI * 2), false);
			c.closePath();
			c.fill();
		}
	},
	SimpleFire : function(x, y)
	{
		var color = "#fefefe";
		var x = x;
		var y = y;
		var vx = Math.floor( Math.random() * 50) - 25;
		var vy = -1 * Math.floor( Math.random() * 200);
		var radius = 1;
		var opacity = 1.0;
		this.kill = false;

		this.lifetime = 3000;

		this.update = function(dt)
		{
			x += vx * dt;
			y += vy * dt;

			//this.lifetime -= 1000 * dt;

			opacity -= 1.0 * dt;
			this.lifetime -= 1000 * dt;

			if (opacity <= .9)
				color = "#fdf885";
			if (opacity <= .7)
				color = "#e02b13";
			if (opacity <= .1)
				color = "#000";

			if (opacity <= .05)
			{
				this.kill = (Math.random() * 10 < 1 ? true : false);
				opacity = .05;
				radius = 2;
			}
		}

		this.draw = function(c)
		{
			c.fillStyle = color;
			c.globalAlpha = opacity;
			c.beginPath();
			c.arc(x, y, radius, 0, (Math.PI * 2), false);
			c.closePath();
			c.fill();
		}
	}
}