import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../task.model';
import { DatepickerPolyfillDirective } from '../../directives/datepicker-polyfill.directive';

function noPastDateValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const selectedDate = new Date(control.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    return { 'pastDate': true };
  }
  return null;
}

@Component({
  selector: 'app-add-task-form',
  standalone: true,
  imports: [ReactiveFormsModule, DatepickerPolyfillDirective],
  templateUrl: './add-task-form.component.html',
  styleUrl: './add-task-form.component.scss'
})

export class AddTaskFormComponent {
  @Output() taskAdded = new EventEmitter<void>();
  @Output() formClosed = new EventEmitter<void>();

  taskForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
    date: new FormControl('', [Validators.required, noPastDateValidator]),
    status: new FormControl<'W trakcie' | 'Zaplanowane' | 'Zrobione'>('Zaplanowane', [Validators.required])
  });

  constructor(private readonly taskService: TaskService) {}

  addTask() {
    if (this.taskForm.invalid) {
        return;
    }

    const newTask: Omit<Task, 'id'> = {
      name: this.taskForm.value.name!,
      description: this.taskForm.value.description!,
      date: this.taskForm.value.date!,
      status: this.taskForm.value.status!,
      isDescriptionVisible: false
    };

    this.taskService.addTask(newTask);

    this.taskForm.reset({ status: 'Zaplanowane' });

    this.taskAdded.emit();
  }

  closeForm() {
    this.formClosed.emit();
  }
}