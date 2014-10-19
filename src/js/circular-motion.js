var CircularMotion = function () {
  var velx = 0,
    new_velx = 1,
    vely = 0,
    new_vely = 2,
    radiusx = 0,
    new_radiusx = 50,
    radiusy = 0,
    new_radiusy = 100,
    angx = 0,
    angy = 0,
    pi180 = Math.PI / 180,
    loopCount = 0,
    centerx = 0,
    new_centerx = 0,
    centery = 0,
    new_centery = 0,
    centery = 0;

  this.x = 0;
  this.y = 0;

  this.maxOffsetX = 150;
  this.maxOffsetY = 200;
  this.minRadiusX = 20;
  this.maxRadiusX = 200;
  this.minRadiusY = 20;
  this.maxRadiusY = 200;

  this.minVelX = 0.2;
  this.maxVelX = 4;
  this.minVelY = 0.2;
  this.maxVelY = 4;

  this.update = function() {
    angx += velx;
    if (angx >= 360) {
      angx %= 360;

      loopCount++;

      if (loopCount > 1) {
        loopCount = 0;
        // newValues
        new_centerx = (Math.random() * this.maxOffsetX - (this.maxOffsetX >> 0)) >> 0;
        new_centery = (Math.random() * this.maxOffsetY - (this.maxOffsetY >> 0)) >> 0;
        new_radiusx = (Math.random() * this.maxRadiusX + this.minRadiusX) >> 0;
        new_radiusy = (Math.random() * this.maxRadiusY + this.minRadiusY) >> 0;
        new_velx = Math.random() * this.maxVelX + this.minVelX;
        new_vely = Math.random() * this.maxVelY + this.minVelY;
      }
    }

    centerx += (new_centerx - centerx) * 0.01;
    centery += (new_centery - centery) * 0.01;

    radiusx += (new_radiusx - radiusx) * 0.01;
    radiusy += (new_radiusy - radiusy) * 0.01;
    
    velx += (new_velx - velx) * 0.01;
    vely += (new_vely - vely) * 0.01;

    angy += vely;
    angy %= 360;

    this.x = Math.sin(angx * pi180) * radiusx + centerx; 
    this.y = Math.sin(angy * pi180) * radiusy + centery; 
  }

  return  this;
};
