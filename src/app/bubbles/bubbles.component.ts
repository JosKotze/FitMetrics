import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-bubbles',
  templateUrl: './bubbles.component.html',
  styleUrls: ['./bubbles.component.scss'],
})
export class BubblesComponent implements OnInit, AfterViewInit {
  bubbles: Array<{ x: number; y: number; speedX: number; speedY: number; icon: string }> = [];

  private radius = 30; // Approximate radius of each bubble for collision detection
  private minDistance = 80;
  // THIS IS ALL CHAT GPT CODE !!!
  ngOnInit() {
    // Create an array of bubbles with random initial positions, speeds, and emoticons
    // const emoticons = [
    //   '🏊‍♂️', '🚴‍♂️', '🏕️', '🌅', '🛶', '🌄', '🏞️', '🌍', '🏃', '🏃🏼', '🚵🏼‍♂️', '🚵🏾‍♂️', '🏊🏼‍♀️', '🏊🏽‍♂️', '⛰️', '🏄', '🏄🏾'
    // ];

    const emoticons = [
      '🎯', '🚴‍♂️', '🌍', '🏃',  
      '🏄', '🏅', '⌚', '🚀',
      '📈', '⚡', '🔥', '⏱️'
    ];

    this.bubbles = [];

    for (let i = 0; i < 12; i++) {
      // Initialize newBubble as undefined
      let newBubble: { x: number; y: number; speedX: number; speedY: number; icon: string } | undefined;

      let overlap = true;

      while (overlap) {
        overlap = false;

        // Initialize newBubble inside the loop
        newBubble = {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          speedX: (Math.random() - 0.5) * 1.5,
          speedY: (Math.random() - 0.5) * 1.5,
          icon: emoticons[i],
        };

        // Check for overlap with existing bubbles
        for (let j = 0; j < this.bubbles.length; j++) {
          const dx = newBubble.x - this.bubbles[j].x;
          const dy = newBubble.y - this.bubbles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < this.minDistance) {
            overlap = true; // If they're too close, reattempt to place the bubble
            break;
          }
        }
      }

      // Push newBubble to the bubbles array once it's correctly placed
      if (newBubble) {
        this.bubbles.push(newBubble);
      }
    }
  }

  ngAfterViewInit() {
    this.startFloatingEffect();
  }

  private startFloatingEffect() {
    const updatePosition = () => {
      this.bubbles.forEach((bubble, index) => {
        bubble.x += bubble.speedX;
        bubble.y += bubble.speedY;

        // Ensure bubbles stay within the viewport bounds
        if (bubble.x <= 0 || bubble.x >= window.innerWidth) bubble.speedX *= -1;
        if (bubble.y <= 0 || bubble.y >= window.innerHeight) bubble.speedY *= -1;

        // Check for collisions with other bubbles
        this.checkCollisions(bubble, index);
      });

      requestAnimationFrame(updatePosition);
    };

    requestAnimationFrame(updatePosition);
  }

  private checkCollisions(bubble: { x: number; y: number; speedX: number; speedY: number }, index: number) {
    for (let i = index + 1; i < this.bubbles.length; i++) {
      const otherBubble = this.bubbles[i];

      const dx = bubble.x - otherBubble.x;
      const dy = bubble.y - otherBubble.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.radius * 2) {
        // Collision detected, reverse direction of both bubbles
        bubble.speedX *= -1;
        bubble.speedY *= -1;
        otherBubble.speedX *= -1;
        otherBubble.speedY *= -1;
      }
    }
  }
}
