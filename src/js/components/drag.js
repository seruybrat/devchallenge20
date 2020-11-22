export default class Drag {
  draw(context, x, y, mouse) {
    if (mouse.isDown) {
      context.beginPath();
      context.moveTo(x, y);
      context.lineWidth = 1;
      context.lineTo(mouse.x, mouse.y);
      context.strokeStyle = "#fff";
      context.stroke();
      context.closePath();
    }
  }
}
