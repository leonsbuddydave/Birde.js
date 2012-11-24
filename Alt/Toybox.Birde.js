(function(w)
{
	Birde.mod.Toybox = function()
	{
		console.log(this);

		this.ActorGroup.prototype.orbitParent = function(distance, speed)
		{
			this.addComponent(function(dt)
			{
				if (this.orbit_angle == null)
					this.orbit_angle = 0;

				this.orbit_angle += speed * dt;

				this.x = Math.cos(this.orbit_angle) * distance;
				this.y = Math.sin(this.orbit_angle) * distance;
			});
		}

		this.ActorGroup.prototype.bob = function(amplitude, wavelength)
		{
			this.addComponent(function(dt)
			{
				if (this.wave_theta == null)
					this.wave_theta = 0;

				this.wave_theta += wavelength * dt;

				this.y += Math.sin( this.wave_theta ) * amplitude;
			});
		}

	}
})(window);