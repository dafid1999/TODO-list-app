import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../task.model';
import { TaskItemComponent } from '../task-item/task-item.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskItemComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})

export class TaskListComponent {
  @Input({ required: true }) tasks: Task[] | null = [];

  @Output() statusChange = new EventEmitter<{ id: number; status: 'W trakcie' | 'Zaplanowane' | 'Zrobione' }>();
  @Output() toggleDescription = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();
}
