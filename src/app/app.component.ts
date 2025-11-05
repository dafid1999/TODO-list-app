import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from './services/task.service';
import { Task } from './task.model';
import { BehaviorSubject, Observable, combineLatest, map, of } from 'rxjs';
import { AddTaskFormComponent } from './components/add-task-form/add-task-form.component';
import { TaskFiltersComponent } from './components/task-filters/task-filters.component';
import { TaskListComponent } from './components/task-list/task-list.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, AddTaskFormComponent, TaskFiltersComponent, TaskListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'junior-frontend-developer-task';
  tasks$: Observable<Task[]> = of([]);
  filteredTasks$: Observable<Task[]> = of([]);

  private readonly nameFilter$ = new BehaviorSubject<string>('');
  private readonly dateFilter$ = new BehaviorSubject<string>('');
  private readonly statusFilter$ = new BehaviorSubject<'W trakcie' | 'Zaplanowane' | 'Zrobione' | ''>('');

  @ViewChild('addTaskModal') modalElement!: ElementRef;
  private addTaskModal: any;

  nameValue = '';
  dateValue = '';
  statusValue: '' | 'W trakcie' | 'Zaplanowane' | 'Zrobione' = '';

  showScrollTop = false;

  constructor(public readonly taskService: TaskService) {}

  // Initializes streams and filtered list
  ngOnInit() {
    this.tasks$ = this.taskService.getTasks();

    this.filteredTasks$ = combineLatest([
      this.tasks$,
      this.nameFilter$,
      this.dateFilter$,
      this.statusFilter$
    ]).pipe(
      map(([tasks, name, date, status]) => {
        const n = name.trim().toLowerCase();
        const filtered = [...tasks].filter(t => {
          const matchesName = n ? t.name.toLowerCase().includes(n) : true;
          const matchesDate = date ? t.date === date : true;
          const matchesStatus = status ? t.status === status : true;
          return matchesName && matchesDate && matchesStatus;
        });
        const order: Record<'W trakcie' | 'Zaplanowane' | 'Zrobione', number> = {
          'W trakcie': 0,
          'Zaplanowane': 1,
          'Zrobione': 2
        };
        return filtered.sort((a, b) => {
          const byStatus = order[a.status] - order[b.status];
          if (byStatus !== 0) return byStatus;
          const byDate = a.date.localeCompare(b.date);
          if (byDate !== 0) return byDate;
          return a.id - b.id;
        });
      })
    );

    this.updateScrollTopVisibility();
  }

  @HostListener('window:scroll') onWindowScroll() { this.updateScrollTopVisibility(); }
  @HostListener('window:resize') onWindowResize() { this.updateScrollTopVisibility(); }

  private updateScrollTopVisibility() {
    const w = window.innerWidth;
    let threshold = 300;
    if (w < 576) threshold = 120; else if (w < 768) threshold = 180;
    this.showScrollTop = window.scrollY > threshold;
  }

  onNameFilterChange(value: string) { this.nameValue = value; this.nameFilter$.next(value); }
  onDateFilterChange(value: string) { this.dateValue = value; this.dateFilter$.next(value); }
  onStatusFilterChange(value: string) {
    if (value === 'W trakcie' || value === 'Zaplanowane' || value === 'Zrobione' || value === '') {
      this.statusValue = value as any;
      this.statusFilter$.next(value as any);
    }
  }
  resetFilters() {
    this.nameValue = '';
    this.dateValue = '';
    this.statusValue = '';
    this.nameFilter$.next('');
    this.dateFilter$.next('');
    this.statusFilter$.next('');
  }

  // Controls opening/closing of Bootstrap modal
  ngAfterViewInit() {
    try {
      const bs = (globalThis as any)?.bootstrap;
      if (this.modalElement?.nativeElement && bs?.Modal) {
        this.addTaskModal = new bs.Modal(this.modalElement.nativeElement);
      }
    } catch {}
  }

  openAddTaskModal() { this.addTaskModal?.show?.(); }
  closeAddTaskModal() { this.addTaskModal?.hide?.(); }

  // Smoothly scrolls to top for UX convenience
  scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
}
