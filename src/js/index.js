import Camera from './components/camera/index.js';
import Player from './components/player.js';
import WorldMap from './components/worldMap.js';
import Menu from './components/textMenu.js';
import Drag from './components/drag.js';
import Asteroid from './components/asteroid.js';

document.addEventListener("DOMContentLoaded", () => {

  // Config
  const playerRadius = 25;
  const asteroidRadius = 25;
  const asteroidColor = 'gold';
  const playerMass = 0.1;  //kg
  let frameRate = 1 / 60; // Seconds
  let isPaused = false;
  let isReady = false;

  // Selectors
  const canvas = document.getElementById('js-canvas');
  const pauseBtn = document.getElementById('js-pause');
  const radioBtn = document.querySelectorAll('input[name="speed"]');

  // Canvas
  const ctx = canvas.getContext('2d');

  // Mouse events
  const mouse = { x: 0, y: 0, isDown: false };
  const getMousePosition = e => {
    mouse.x = e.pageX - canvas.offsetLeft;
    mouse.y = e.pageY - canvas.offsetTop;
  }
  const mouseDown = e => {
    if (e.which == 1) {
      getMousePosition(e);
      mouse.isDown = true;
      if (!isPaused) {
        player.x = mouse.x;
        player.y = mouse.y;
      }
    }
  }
  const mouseUp = e => {
    if (e.which == 1) {
      mouse.isDown = false;
      player.velocity.y = (player.y - mouse.y) / 10;
      player.velocity.x = (player.x - mouse.x) / 10;
    }
  }

  // Listeners
  let lastIndex = radioBtn.length;
  while (lastIndex--)
    radioBtn[lastIndex].addEventListener('change', (e) => {
      frameRate = 1 / (e.target.value * 20);
    }, 0);
  pauseBtn.addEventListener('click', () => {
    isPaused = !isPaused;
  });
  canvas.onmousemove = getMousePosition;
  canvas.onmousedown = mouseDown;
  canvas.onmouseup = mouseUp;

  // Game objects
  const rocket = new Image();
  rocket.src = './images/startup.svg';
  const sky = new Image();
  sky.src = './images/bg.jpg';
  const text = new Menu();
  const drag = new Drag();
  const asteroid = new Asteroid(600, canvas.height / 2 - asteroidRadius, asteroidRadius, asteroidColor);
  const player = new Player(350, 350, playerRadius, playerMass);
  const world = {
    width: canvas.width * 2,
    height: canvas.height,
    map: new WorldMap(sky)
  };

  // Camera settings
  const vWidth = Math.min(world.width, canvas.width);
  const vHeight = Math.min(world.height, canvas.height);
  const camera = new Camera(0, 0, vWidth, vHeight, world.width, world.height);
  camera.follow(player, vWidth / 2, vHeight / 2);

  // Images Loading
  const images = [sky, rocket];
  const imageCount = images.length;
  let imagesLoaded = 0;
  for (let i = 0; i < imageCount; i++) {
    images[i].onload = () => {
      imagesLoaded++;
      if (imagesLoaded === imageCount) {
        allImagesLoaded();
      }
    }
  }
  const allImagesLoaded = () => {
    isReady = true;
  }

  // Collision
  const collisionDetection = () => {
    if (
      asteroid.x > (player.x - asteroid.width) &&
      asteroid.x < (player.x + asteroid.width) &&
      asteroid.y > (player.y - asteroid.height) &&
      asteroid.y < (player.y + asteroid.height)) {
      player.velocity.x *= player.restitution;
      player.velocity.y *= player.restitution;
      player.x = player.x - playerRadius;
      player.y = player.y - playerRadius;
      asteroid.color = '#' + ((1 << 24) * Math.random() | 0).toString(16);
    }
  }

  // Game update function
  const update = () => {
    player.update({
      frameRate,
      worldWidth: world.width,
      worldHeight: world.height,
      mouse,
      canvas,
    });
    camera.update();
    collisionDetection();
  }

  // Game draw function
  const draw = () => {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    // clear the entire canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    world.map.draw(ctx, camera.xView, camera.yView);
    drag.draw(ctx, player.x - camera.xView, player.y - camera.yView, mouse);
    text.draw(ctx, `Distance: ${parseInt(player.x)}`, { x: 20, y: 40 });
    text.draw(ctx, `Speed: ${frameRate.toFixed(2)}`, { x: 180, y: 40 });
    asteroid.draw(ctx, camera.xView, camera.yView);
    if (isPaused) {
      text.draw(ctx, 'Set new parameters', { x: canvas.width / 2 - 100, y: canvas.height / 2 - 100 });
    }
    player.draw({ context: ctx, xView: camera.xView, yView: camera.yView, playerImg: rocket });
  }

  const render = () => {
    if (!isPaused) {
      update();
    }
    if (isReady) {
      draw();
    }
    window.requestAnimationFrame(render);
  }

  render();

});
