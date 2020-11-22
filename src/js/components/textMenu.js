export default class TextMenu {
  draw(ctx, text, position) {
    ctx.font = "20px Impact";
    ctx.fillStyle = "white";
    ctx.fillText(text, position.x, position.y);
  }
}