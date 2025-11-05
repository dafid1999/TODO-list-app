import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../task.model';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss'
})
export class TaskItemComponent {
  @Input({ required: true }) task!: Task;

  @Output() statusChange = new EventEmitter<'W trakcie' | 'Zaplanowane' | 'Zrobione'>();
  @Output() toggleDescription = new EventEmitter<void>();
  @Output() deleteTask = new EventEmitter<void>();
}
