import { Directive, ElementRef, Renderer2, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appBlackout]',
})
export class BlackoutDirective {
  @Input('appBlackout') blackoutColor: string;

  constructor(private element: ElementRef, private renderer: Renderer2) {
    this.renderer.setStyle(this.element.nativeElement, 'cursor', 'pointer');
  }

  @HostListener('click', ['$event']) onMouseClick(event) {
    if (event.target.tagName !== 'BUTTON') {
      this.setBgColor('#ace7ff');
    }
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.setBgColor('#d8d8d8');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.setBgColor(null);
  }

  private setBgColor(val: string) {
    if (!this.element.nativeElement.classList.contains('selected')) {
      this.element.nativeElement.style.backgroundColor = val;
    } else {
      this.element.nativeElement.style.backgroundColor = null;
    }
  }
}
