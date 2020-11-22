export default class Asteroid {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.width = radius * 2;
    this.height = radius * 2;
    this.color = color;
  }
  draw(context, xView, yView) {
    context.beginPath();
    context.arc(this.x - xView, this.y - yView, this.radius, 0, 2 * Math.PI, false);
    context.fillStyle = this.color;
    context.fill();
  }
}
