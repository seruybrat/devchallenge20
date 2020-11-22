export default class WorldMap {
	constructor(image) {
		// world texture
		this.image = image;
	}

	draw(context, xView, yView) {
		// easiest way: draw the entire map changing only the destination coordinate in canvas
		// canvas will cull the image by itself (no performance gaps -> in hardware accelerated environments, at least)

		// didactic way ( "s" is for "source" and "d" is for "destination" in the variable names):

		var sx, sy, dx, dy;
		var sWidth, sHeight, dWidth, dHeight;

		// offset point to crop the image
		sx = xView;
		sy = yView;

		// dimensions of cropped image			
		sWidth = context.canvas.width;
		sHeight = context.canvas.height;

		// if cropped image is smaller than canvas we need to change the source dimensions
		if (this.image.width - sx < sWidth) {
			sWidth = this.image.width - sx;
		}
		if (this.image.height - sy < sHeight) {
			sHeight = this.image.height - sy;
		}

		// location on canvas to draw the croped image
		dx = 0;
		dy = 0;
		// match destination with source to not scale the image
		dWidth = sWidth;
		dHeight = sHeight;

		context.drawImage(this.image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
	}
}
