import { Directive, ElementRef, Renderer2, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[app-percent-color]',
})
export class PercentColorDirective implements OnInit {
  @Input('app-percent-color') percent: number;
  constructor(private element: ElementRef, private renderer: Renderer2) { }
  ngOnInit() {
    if (this.percent > 0) {
      this.renderer.setStyle(this.element.nativeElement, 'color', 'green');
    } else {
      this.renderer.setStyle(this.element.nativeElement, 'color', 'red');
    }
  }
}
