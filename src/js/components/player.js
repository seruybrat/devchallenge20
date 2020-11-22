export default class Player {
  constructor(x, y, radius, mass) {
    this.x = x;
    this.y = y;
    this.prevY = y;
    this.prevX = x;
    this.angle = 0;
    this.velocity = { x: 10, y: 0 };
    this.mass = mass;
    this.radius = radius; // 1px = 1cm
    this.restitution = -0.8;
    this.Cd = 0.47;  // Dimensionless
    this.rho = 0.4; // kg / m^3
    this.A = Math.PI * this.radius * this.radius / (10000); // m^2
    this.ag = 9.81;  // m / s^2
    this.width = radius * 2;
    this.height = radius * 2;
  }

  update({ frameRate, worldWidth, worldHeight, mouse, canvas }) {
    this.prevY = this.y;
    this.prevX = this.x;

    if (!mouse.isDown) {
      // Do physics
      // Drag force: Fd = -1/2 * Cd * A * rho * v * v
      let Fx = -0.5 * this.Cd * this.A * this.rho * this.velocity.x * this.velocity.x * this.velocity.x / Math.abs(this.velocity.x);
      let Fy = -0.5 * this.Cd * this.A * this.rho * this.velocity.y * this.velocity.y * this.velocity.y / Math.abs(this.velocity.y);

      Fx = (isNaN(Fx) ? 0 : Fx);
      Fy = (isNaN(Fy) ? 0 : Fy);

      // Calculate acceleration ( F = ma )
      const ax = Fx / this.mass;
      const ay = this.ag + (Fy / this.mass);
      // Integrate to get velocity
      this.velocity.x += ax * frameRate;
      this.velocity.y += ay * frameRate;

      // Integrate to get position
      this.x += this.velocity.x * frameRate * 100;
      this.y += this.velocity.y * frameRate * 100;
    }

    // don't let player leaves the world's boundary
    if (this.x - this.width / 2 < 0) {
      this.velocity.x *= this.restitution;
      this.x = this.width;
    }
    if (this.y - this.height / 2 < 0) {
      this.velocity.y *= this.restitution;
      this.y = this.height;
    }
    if (this.x + this.width / 2 > worldWidth) {
      this.velocity.x *= this.restitution;
      this.x = worldWidth - this.width / 2 - this.radius;
    }
    if (this.y + this.height / 2 > worldHeight) {
      this.velocity.y *= this.restitution;
      this.y = canvas.height - this.radius;
    }
    if (mouse.isDown) {
      this.angle = Math.atan2(this.y - mouse.y, this.x - mouse.x);

    } else {
      this.angle = Math.atan2(this.y - this.prevY, this.x - this.prevX);
    }
  }

  draw({ context, xView, yView, playerImg }) {
    context.setTransform(1, 0, 0, 1, this.x - xView, this.y - yView);
    context.rotate(this.angle);
    context.drawImage(playerImg, -this.radius, -this.radius, this.width, this.height);
  }
}
