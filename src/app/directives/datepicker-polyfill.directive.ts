import { AfterViewInit, Directive, ElementRef, OnDestroy } from '@angular/core';
import flatpickr from 'flatpickr';
import { Polish } from 'flatpickr/dist/l10n/pl.js';

@Directive({
  selector: '[appDatepickerPolyfill]',
  standalone: true,
})
export class DatepickerPolyfillDirective implements AfterViewInit, OnDestroy {
  // Applies a consistent flatpickr datepicker with Polish locale to native inputs
  private instance: any;

  constructor(private readonly host: ElementRef<HTMLInputElement>) {}

  ngAfterViewInit(): void {
    const input = this.host.nativeElement;

    try { input.type = 'text'; } catch {}
    if (!input.placeholder) {
      input.placeholder = 'RRRR-MM-DD';
    }

    this.instance = flatpickr(input, {
      dateFormat: 'Y-m-d',
      allowInput: true,
      disableMobile: true,
      locale: Polish,
    });
  }

  ngOnDestroy(): void {
    this.instance?.destroy?.();
  }
}
