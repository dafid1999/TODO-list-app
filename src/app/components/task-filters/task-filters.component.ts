import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatepickerPolyfillDirective } from '../../directives/datepicker-polyfill.directive';

@Component({
  selector: 'app-task-filters',
  standalone: true,
  imports: [CommonModule, DatepickerPolyfillDirective],
  templateUrl: './task-filters.component.html',
  styleUrl: './task-filters.component.scss'
})
export class TaskFiltersComponent {
  @Input() name: string = '';
  @Input() date: string = '';
  @Input() status: string = '';

  @Output() nameChange = new EventEmitter<string>();
  @Output() dateChange = new EventEmitter<string>();
  @Output() statusChange = new EventEmitter<string>();
  @Output() filtersReset = new EventEmitter<void>();
}
