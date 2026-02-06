import {
  Directive,
  ElementRef,
  OnDestroy,
  inject,
  input,
  effect,
  afterNextRender,
} from '@angular/core';

// Font size boundaries
const MIN_FONT_SIZE = 10;
const MAX_FONT_SIZE = 500;

@Directive({
  selector: '[appTextFit]',
})
export class TextFitDirective implements OnDestroy {
  private el = inject(ElementRef);
  private resizeObserver: ResizeObserver | null = null;
  private isReady = false;
  textFitContent = input<string>('');

  constructor() {
    this.el.nativeElement.style.visibility = 'hidden';

    afterNextRender(() => {
      // Brief delay ensures styles are applied before measuring
      setTimeout(() => {
        this.setupResizeObserver();
        this.fitText();
        this.isReady = true;
      }, 50);
    });

    effect(() => {
      this.textFitContent();
      if (this.isReady) {
        this.fitText();
      }
    });
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    window.removeEventListener('resize', this.onResize);
  }

  private setupResizeObserver(): void {
    const parent = this.el.nativeElement.parentElement;
    if (!parent) return;

    this.resizeObserver = new ResizeObserver(() => this.fitText());
    this.resizeObserver.observe(parent);
    window.addEventListener('resize', this.onResize);
  }

  private onResize = (): void => this.fitText();

  private getAvailableWidth(parent: HTMLElement): number {
    const styles = window.getComputedStyle(parent);
    const padding = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
    return parent.clientWidth - (padding || 0);
  }

  private fitText(): void {
    const element = this.el.nativeElement as HTMLElement;
    const parent = element.parentElement;
    if (!parent) return;

    const availableWidth = this.getAvailableWidth(parent);
    if (availableWidth <= 0) return;

    Object.assign(element.style, {
      whiteSpace: 'nowrap',
      display: 'block',
      width: '100%',
    });

    // Binary search for optimal font size (O(log n))
    let low = MIN_FONT_SIZE;
    let high = MAX_FONT_SIZE;

    while (low < high - 1) {
      const mid = Math.floor((low + high) / 2);
      element.style.fontSize = `${mid}px`;

      if (element.scrollWidth <= availableWidth) {
        low = mid;
      } else {
        high = mid;
      }
    }

    element.style.fontSize = `${low}px`;
    element.style.visibility = 'visible';
  }
}
