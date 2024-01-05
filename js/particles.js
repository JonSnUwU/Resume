// particles.js
let stars = [];

// Get the Y position of the element
const snowflakesTrigger = document.getElementById('navigation-menu');
const snowflakesTriggerY = snowflakesTrigger.getBoundingClientRect().top;
const bonesTrigger = document.getElementById('about-section');
const bonesTriggerY = bonesTrigger.getBoundingClientRect().top;

function setup() {
  let canvas = createCanvas(windowWidth, document.body.scrollHeight);
  canvas.parent('stars-canvas');
  generateStars(130); // Generate 90 stars
}

function generateStars(count) {
    if (count > 0) {
      setTimeout(() => {
        stars.push(new Star());
        generateStars(count - 1); // Call the function recursively with a delay
      }, random(25, 150)); // Set a random delay for each star
    }
  }

function draw() {
    clear(); // Clears the canvas before redrawing
    background(0, 10);
  
    for (let i = stars.length - 1; i >= 0; i--) {
      stars[i].update();
      stars[i].display();
      stars[i].edges();
  
      if (stars[i].y > height || stars[i].x < 0 || stars[i].x > width) {
        stars.splice(i, 1);
        stars.push(new Star());
      }
  
      if (snowflakesTriggerY < stars[i].y && stars[i].y <= bonesTriggerY) {
        // Change the star's appearance to resemble a snowflake
        stars[i].size = 5; // Modify the size
        stars[i].speed = 3; // Reduce the falling speed
        stars[i].isTwinkling = false;
        stars[i].twinkleCounter = 0; // Reset the twinkling counter
      }
      else if (stars[i].y > bonesTriggerY){
        stars[i].size = 5; // Modify the size
        stars[i].speed = 2; // Reduce the falling speed
      }
    }
}

class Star {
    constructor() {
        let halfWidth = width / 2; // Calculate half of the canvas width
    
        // Generate x coordinates only on the left and right sides, avoiding the middle
        if (random(1) > 0.5) {
          // Stars on the left side of the screen
          this.x = random(0, halfWidth * 0.6); // Adjust the range as needed
        } else {
          // Stars on the right side of the screen
          this.x = random(halfWidth * 1.4, width); // Adjust the range as needed
        }
    
        this.y = random(-height, 0);
        this.size = random(3, 5);
        this.speed = random(4, 6);

        this.twinkleInterval = floor(random(3, 5)); // Random interval for twinkling
        this.twinkleCounter = 0;
        this.originalSize = this.size;
        this.isTwinkling = random() > 0.5; // Chance for a star to twinkle

        this.trailLength = 5; // Number of trailing copies
        this.trail = []; // Array to store previous positions
        this.angleOffset = random(TWO_PI); // Randomize the angle offset once during creation

      }

  update() {
    let halfWidth = width / 2;
    let limWidthLeft = width / 5;
    let limWidthRight = 4 * width / 5;
    this.y += this.speed;
    if (this.y > height || this.x < 0 || this.x > width) {
        const index = stars.indexOf(this);
        stars.splice(index, 1);
        stars.push(new Star());
      }
      if (this.y < bonesTriggerY && this.y > snowflakesTriggerY) {
        this.isTwinkling = false;
        this.twinkleCounter = 0; // Reset the twinkling counter
      } else if(this.y < snowflakesTriggerY) {
        // Continue twinkling for stars above triggerY
        if (this.isTwinkling) {
          this.twinkleCounter++;
          if (this.twinkleCounter >= this.twinkleInterval) {
            this.size = this.size === this.originalSize ? this.originalSize + 1 : this.originalSize;
            this.twinkleCounter = 0;
          }
        }
      } else if(this.y > bonesTriggerY) {
          if (this.x > limWidthLeft && this.x < halfWidth){
              this.x -= 1;
          }
          if (this.x > halfWidth && this.x < limWidthRight){
              this.x += 1;
          }
        }
        this.trail.unshift({ x: this.x, y: this.y }); // Add to the beginning of the array

        // Keep the trail length limited
        if (this.trail.length > this.trailLength) {
          this.trail.pop(); // Remove the last position
    }
    }

display() {
    stroke(255);
    strokeWeight(4);
    // Display trail copies with reduced opacity
    if (this.y <= snowflakesTriggerY) {
      this.size = 3;
      // Display the fading trail
      for (let i = 0; i < this.trail.length; i++) {
        let alpha = map(i, 0, this.trail.length - 1, 255, 50); // Reduce opacity for the trail
        stroke(255, alpha);
        point(this.trail[i].x, this.trail[i].y);
      }

      // Display the current star position
      point(this.x, this.y);
    } else if(snowflakesTriggerY < this.y && this.y <= bonesTriggerY) {
      // If below triggerY, display a more detailed snowflake-like shape
      strokeWeight(0.6); // Adjust the stroke weight for snowflake shape
      noFill();
      this.speed = 2.4;
      this.size = this.size * 5; // Adjust the size of the snowflake
      let fractalDepth = 1; // Define fractalDepth before using it
  
      for (let i = 0; i < 6; i++) {
        let angle = TWO_PI / 6 * i + this.angleOffset;
        let x1 = this.x + cos(angle) * this.size * 0.3;
        let y1 = this.y + sin(angle) * this.size * 0.3;
        let x2 = this.x + cos(angle) * this.size * 0.1;
        let y2 = this.y + sin(angle) * this.size * 0.1;
  
        if (fractalDepth > 0) {
          let midX = (x1 + x2) / 2;
          let midY = (y1 + y2) / 2;
          let offsetX = (x2 - x1) * 0.4;
          let offsetY = (y2 - y1) * 0.4;
  
          let fractalX1 = midX + offsetY;
          let fractalY1 = midY - offsetX;
          let fractalX2 = midX - offsetY;
          let fractalY2 = midY + offsetX;
  
          line(x1, y1, fractalX1, fractalY1);
          line(fractalX1, fractalY1, midX, midY);
          line(midX, midY, fractalX2, fractalY2);
          line(fractalX2, fractalY2, x2, y2);
  
          let nextSize = dist(x1, y1, x2, y2) / 12;
          let nextX = x1;
          let nextY = y1;
  
          // Iterate for the snowflake shape
          for (let j = 0; j < 9; j++) {
            let newAngle = TWO_PI / 9 * j;
            let newX2 = nextX + cos(newAngle) * nextSize;
            let newY2 = nextY + sin(newAngle) * nextSize;
  
            line(nextX, nextY, newX2, newY2);
            nextX = newX2;
            nextY = newY2;
          }
        }
      } 
    } else if(this.y > snowflakesTriggerY){
      this.speed = 1;
      this.size = 15;
      let boneWidth = this.size * 0.1;
      let boneLength = this.size * 2;

      let boneTopX = this.x - boneWidth / 2;
      let boneTopY = this.y - boneLength / 2;

      let boneBottomX = this.x + boneWidth / 2;
      let boneBottomY = this.y + boneLength / 2;

      let jointSize = this.size * 0.4;


      fill(255);
      strokeWeight(5);

      // Draw bone shaft
      line(boneTopX, boneTopY, boneBottomX, boneBottomY);

      // Draw joints (spherical ends)
      ellipse(boneTopX - jointSize / 2, boneTopY, jointSize);
      ellipse(boneTopX + jointSize / 2, boneTopY, jointSize);
      
      ellipse(boneBottomX - jointSize / 2, boneBottomY, jointSize);
      ellipse(boneBottomX + jointSize / 2, boneBottomY, jointSize);
    }
  }

edges() {
    if (this.y > height || this.x < 0 || this.x > width) {
      const index = stars.indexOf(this);
      stars.splice(index, 1);
      stars.push(new Star());
    }
  }
}
