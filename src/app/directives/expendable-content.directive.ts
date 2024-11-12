import {
  Directive,
  Input,
  OnChanges,
  SimpleChanges,
  ElementRef,
  Renderer2,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appExpendableContent]',
})
export class ExpendableContentDirective
  implements OnChanges, OnInit, OnDestroy
{
  @Input() isExpanded: boolean = false;

  subs: Subscription[] = [];

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  private toggle() {
    const fullHeight = this.el.nativeElement.scrollHeight + 'px';
    if (this.isExpanded) {
      this.renderer.setStyle(this.el.nativeElement, 'maxHeight', fullHeight);
    } else {
      this.renderer.setStyle(this.el.nativeElement, 'maxHeight', `0`);
    }
  }

  private onResize() {
    this.toggle();
  }

  ngOnInit(): void {
    window.addEventListener('resize', () => this.onResize());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isExpanded']) {
      this.toggle();
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', () => this.onResize());
  }
}
