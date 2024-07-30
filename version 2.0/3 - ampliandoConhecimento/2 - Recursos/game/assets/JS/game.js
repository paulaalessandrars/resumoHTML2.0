// Setup canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Define spaceship object
const spaceship = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 20,
  speed: 5,
  dx: 0,
  dy: 0,
  shieldActive: false,
  shieldDuration: 300, // Duration in frames (5 seconds at 60 FPS)
  shieldTimer: 0
};

// Resource object
class Resource {
  constructor(x, y, size, color, speedX, speedY) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.speedX = speedX;
    this.speedY = speedY;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.draw();
  }
}

// Item object
class Item {
  constructor(x, y, size, color, speedX, speedY) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.speedX = speedX;
    this.speedY = speedY;
  }

  draw() {
    ctx.beginPath();
    ctx.rect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.draw();
  }
}

// Projectile object
class Projectile {
  constructor(x, y, radius, speedX) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speedX = speedX;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
  }

  update() {
    this.x += this.speedX;
    this.draw();
  }
}

// Asteroid object
class Asteroid {
  constructor(x, y, radius, speed) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speed = speed;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'brown';
    ctx.fill();
    ctx.closePath();
  }

  update() {
    this.x -= this.speed;
    this.draw();
  }
}

// Define arrays and variables
let asteroids = [];
let resources = [];
let items = [];
let projectiles = [];
let score = 0;
let bgColorIndex = 0;
const backgroundColors = ['#1f1f1f', '#333333', '#555555', '#777777', '#999999'];

// Function to create a new asteroid
function createAsteroid() {
  const x = canvas.width + 100;
  const y = Math.random() * canvas.height;
  const radius = Math.random() * 30 + 10;
  const speed = Math.random() * 5 + 1;
  asteroids.push(new Asteroid(x, y, radius, speed));
}

// Function to create a new item
function createItem() {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height;
  const size = 10;
  const color = 'green';
  const speedX = Math.random() - 0.5;
  const speedY = Math.random() - 0.5;
  items.push(new Item(x, y, size, color, speedX, speedY));
}

// Function to create a new resource
function createResource() {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height;
  const size = 15;
  const color = 'yellow';
  const speedX = Math.random() - 0.5;
  const speedY = Math.random() - 0.5;
  resources.push(new Resource(x, y, size, color, speedX, speedY));
}

// Event listeners for keyboard input
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;
let spacePressed = false;
let shiftPressed = false;

function keyDownHandler(event) {
  if (event.key === 'Right' || event.key === 'ArrowRight') {
    rightPressed = true;
  } else if (event.key === 'Left' || event.key === 'ArrowLeft') {
    leftPressed = true;
  } else if (event.key === 'Up' || event.key === 'ArrowUp') {
    upPressed = true;
  } else if (event.key === 'Down' || event.key === 'ArrowDown') {
    downPressed = true;
  } else if (event.key === ' ') {
    spacePressed = true;
  } else if (event.key === 'Shift') {
    shiftPressed = true;
  }
}

function keyUpHandler(event) {
  if (event.key === 'Right' || event.key === 'ArrowRight') {
    rightPressed = false;
  } else if (event.key === 'Left' || event.key === 'ArrowLeft') {
    leftPressed = false;
  } else if (event.key === 'Up' || event.key === 'ArrowUp') {
    upPressed = false;
  } else if (event.key === 'Down' || event.key === 'ArrowDown') {
    downPressed = false;
  } else if (event.key === ' ') {
    spacePressed = false;
  } else if (event.key === 'Shift') {
    shiftPressed = false;
  }
}

// Draw spaceship function
function drawSpaceship() {
  ctx.beginPath();
  ctx.rect(spaceship.x - spaceship.size / 2, spaceship.y - spaceship.size / 2, spaceship.size, spaceship.size);
  ctx.fillStyle = spaceship.shieldActive ? 'rgba(0, 255, 255, 0.5)' : 'blue'; // Transparent blue if shield is active
  ctx.fill();
  ctx.closePath();
}

// Draw resources function
function drawResources() {
  resources.forEach(resource => {
    resource.update();

    // Remove resources that go offscreen
    if (
      resource.x + resource.size < 0 ||
      resource.x - resource.size > canvas.width ||
      resource.y + resource.size < 0 ||
      resource.y - resource.size > canvas.height
    ) {
      resources.splice(resources.indexOf(resource), 1);
    }
  });
}

// Draw items function
function drawItems() {
  items.forEach(item => {
    item.update();

    // Remove items that go offscreen
    if (
      item.x + item.size < 0 ||
      item.x - item.size > canvas.width ||
      item.y + item.size < 0 ||
      item.y - item.size > canvas.height
    ) {
      items.splice(items.indexOf(item), 1);
    }
  });
}

// Draw projectiles function
function drawProjectiles() {
  projectiles.forEach((projectile, index) => {
    projectile.update();

    // Remove projectiles that go offscreen
    if (projectile.x + projectile.radius < 0) {
      projectiles.splice(index, 1);
    }

    // Check collision with asteroids
    asteroids.forEach((asteroid, asteroidIndex) => {
      const dist = Math.hypot(projectile.x - asteroid.x, projectile.y - asteroid.y);

      if (dist - asteroid.radius - projectile.radius < 1) {
        // Remove asteroid and projectile
        asteroids.splice(asteroidIndex, 1);
        projectiles.splice(index, 1);

        // Increase score
        score += 100;
        console.log('Score:', score);
      }
    });
  });
}

// Draw score function
function drawScore() {
  ctx.font = '20px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText('Score: ' + score, 10, 30);
}

// Draw background function
function drawBackground() {
  ctx.fillStyle = backgroundColors[bgColorIndex];
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Update game objects
function update() {
  // Move spaceship
  if (rightPressed && spaceship.x < canvas.width - spaceship.size / 2) {
    spaceship.x += spaceship.speed;
  } else if (leftPressed && spaceship.x > spaceship.size / 2) {
    spaceship.x -= spaceship.speed;
  }

  if (upPressed && spaceship.y > spaceship.size / 2) {
    spaceship.y -= spaceship.speed;
  } else if (downPressed && spaceship.y < canvas.height - spaceship.size / 2) {
    spaceship.y += spaceship.speed;
  }

  // Activate shield on Shift press
  if (shiftPressed && !spaceship.shieldActive && spaceship.shieldTimer === 0) {
    spaceship.shieldActive = true;
    spaceship.shieldTimer = spaceship.shieldDuration;
  }

  // Decrement shield timer if shield is active
  if (spaceship.shieldActive) {
    spaceship.shieldTimer--;

    // Deactivate shield after duration
    if (spaceship.shieldTimer <= 0) {
      spaceship.shieldActive = false;
      spaceship.shieldTimer = 0; // Reset shield timer
    }
  }

  // Handle shooting projectiles
  if (spacePressed) {
    projectiles.push(new Projectile(spaceship.x, spaceship.y, 5, 7));
  }

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background
  drawBackground();

  // Draw spaceship
  drawSpaceship();

  // Draw resources
  drawResources();

  // Draw items
  drawItems();

  // Draw projectiles
  drawProjectiles();

  // Draw score
  drawScore();

  // Create new asteroids randomly
  if (Math.random() < 0.03) {
    createAsteroid();
  }

  // Create new items randomly
  if (Math.random() < 0.02) {
    createItem();
  }

  // Create new resources randomly
  if (Math.random() < 0.015) {
    createResource();
  }

  // Update asteroids
  asteroids.forEach((asteroid, asteroidIndex) => {
    asteroid.update();

    // Collision detection with spaceship
    const dist = Math.hypot(asteroid.x - spaceship.x, asteroid.y - spaceship.y);
    if (dist - asteroid.radius - spaceship.size / 2 < 1) {
      if (spaceship.shieldActive) {
        // Shield is active: Remove asteroid
        asteroids.splice(asteroidIndex, 1);
      } else {
        // Shield is not active: Game over condition
        alert('Game Over!');
        document.location.reload();
      }
    }
  });

  // Check collision between spaceship and resources
  resources.forEach((resource, resourceIndex) => {
    const dist = Math.hypot(resource.x - spaceship.x, resource.y - spaceship.y);

    if (dist - resource.size - spaceship.size / 2 < 1) {
      // Remove resource
      resources.splice(resourceIndex, 1);

      // Increase score
      score += 500; // Resources give higher score
      console.log('Score:', score);
    }
  });

  // Check collision between spaceship and items
  items.forEach((item, itemIndex) => {
    const dist = Math.hypot(item.x - spaceship.x, item.y - spaceship.y);

    if (dist - item.size / 2 - spaceship.size / 2 < 1) {
      // Remove item
      items.splice(itemIndex, 1);

      // Increase score for collecting items
      score += 50; // Adjust points as needed
      console.log('Score:', score);
    }
  });

  // Check win condition
  if (score >= 10000) {
    alert('Congratulations! You win!');
    document.location.reload();
  }

  // Change background color every 500 frames (approx. every 8 seconds)
  if (frameCount % 500 === 0) {
    bgColorIndex = (bgColorIndex + 1) % backgroundColors.length;
  }

  // Increment frame count
  frameCount++;

  // Request animation frame
  requestAnimationFrame(update);
}

// Start the game loop
let frameCount = 0;
update();