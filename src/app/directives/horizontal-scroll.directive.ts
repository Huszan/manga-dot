import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appHorizontalScroll]',
})
export class HorizontalScrollDirective {
  private isDragging = false;
  private startX = 0;
  private scrollLeft = 0;
  private friction = 0.02; // (higher value = faster slow down)
  private velocity = 0; // Speed of the scrolling
  private movementScale = 10;
  private animationFrameId: number | null = null;

  constructor(private el: ElementRef) {}

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    if (event.button === 0) {
      event.preventDefault();
      this.isDragging = true;
      this.startX = event.pageX - this.el.nativeElement.offsetLeft;
      this.scrollLeft = this.el.nativeElement.scrollLeft;
      this.velocity = 0;
      this.el.nativeElement.style.cursor = 'grabbing';
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging) return;

    const x = event.pageX - this.el.nativeElement.offsetLeft;
    let movement = x - this.startX;

    this.el.nativeElement.scrollLeft = this.scrollLeft - movement;
    this.velocity = movement / this.movementScale;
  }

  @HostListener('mouseup')
  onMouseUp(): void {
    this.isDragging = false;
    this.el.nativeElement.style.cursor = 'grab';

    this.applyFriction();
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.isDragging = false;
    this.el.nativeElement.style.cursor = 'grab';

    this.applyFriction();
  }

  private applyFriction(): void {
    // Cancel any previous animation frame to prevent multiple calls
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    // Use requestAnimationFrame for smooth deceleration
    const animate = () => {
      if (Math.abs(this.velocity) < 1) {
        return; // Stop animation once the velocity is small enough
      }

      this.velocity *= 1 - this.friction; // Apply friction to velocity
      this.el.nativeElement.scrollLeft -= this.velocity; // Apply velocity to scroll

      // Request the next frame
      this.animationFrameId = requestAnimationFrame(animate);
    };

    // Start the animation
    this.animationFrameId = requestAnimationFrame(animate);
  }
}
