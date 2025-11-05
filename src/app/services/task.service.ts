import { Injectable } from '@angular/core';
import { Task } from '../task.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { generateMockTasks } from './mock-tasks';

const INITIAL_TASKS: Task[] = [
  {
    id: 1,
    name: 'Zrobić zakupy spożywcze',
    status: 'Zrobione',
    date: '2025-05-01',
    description: 'Muszę kupić mleko, mąkę i jajka.',
    isDescriptionVisible: false,
  },
  {
    id: 2,
    name: 'Opłacić rachunki',
    status: 'W trakcie',
    date: '2025-05-10',
    description: 'Tylko nie odkładaj tego na inny dzień!',
    isDescriptionVisible: false,
  },
  {
    id: 3,
    name: 'Urodziny mamy',
    status: 'Zaplanowane',
    date: '2025-05-15',
    description: 'Kupić kwiaty i tort.',
    isDescriptionVisible: false,
  }
];

@Injectable({ providedIn: 'root' })
export class TaskService {
  // Central task state with localStorage persistence
  private readonly STORAGE_KEY = 'tasks';
  private readonly INIT_KEY = 'tasks_initialized_v1';

  private readonly tasks$ = new BehaviorSubject<Task[]>([]);
  private nextId = 4;

  constructor() {
    this.loadInitialTasks();
  }

  // Exposes observable task list
  getTasks(): Observable<Task[]> { return this.tasks$.asObservable(); }

  private ensureSeededOnce(): void {
    const wasInitialized = localStorage.getItem(this.INIT_KEY) === '1';
    if (wasInitialized) return;

    const hasTasksKey = localStorage.getItem(this.STORAGE_KEY) !== null;
    if (!hasTasksKey) {
      const defaults: Task[] = INITIAL_TASKS;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaults));
    }
    localStorage.setItem(this.INIT_KEY, '1');
  }

  private recomputeNextId(tasks: Task[]): void {
    this.nextId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
  }

  private loadTasksFromStorage(): Task[] {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as Task[]) : [];
    } catch {
      return [];
    }
  }

  // Loads initial tasks, optionally injecting dev mocks when configured
  private loadInitialTasks(): void {
    this.ensureSeededOnce();
    let tasks = this.loadTasksFromStorage();

    const devMockFlag = (globalThis as any)?.DEV_MOCK_TASKS === true;
    if (devMockFlag && tasks.length === 0) {
      const mocks = generateMockTasks(this.nextId, 50);
      tasks = [...tasks, ...mocks];
      this.recomputeNextId(tasks);
    }

    this.tasks$.next(tasks);
    this.recomputeNextId(tasks);
  }

  // Persists and updates task list
  setTasks(newTasks: Task[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newTasks));
    this.tasks$.next(newTasks);
    this.recomputeNextId(newTasks);
  }

  clearTasks(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
    this.tasks$.next([]);
    this.recomputeNextId([]);
  }

  // Adds a task assigning next incremental id
  addTask(task: Omit<Task, 'id'>): void {
    const currentTasks = this.tasks$.getValue();
    const newTaskWithId: Task = { ...task, id: this.nextId++ };
    this.setTasks([...currentTasks, newTaskWithId]);
  }

  // Updates a task properties by id
  updateTask(id: number, updatedProperties: Partial<Task>): void {
    const currentTasks = this.tasks$.getValue();
    const updatedTasks = currentTasks.map(task =>
      task.id === id ? { ...task, ...updatedProperties } : task
    );
    this.setTasks(updatedTasks);
  }

  // Changes task status
  changeTaskStatus(id: number, status: 'W trakcie' | 'Zaplanowane' | 'Zrobione'): void {
    this.updateTask(id, { status });
  }

  // Toggles or sets description visibility
  changeDescriptionVisibility(id: number, isVisible: boolean): void {
    this.updateTask(id, { isDescriptionVisible: isVisible });
  }

  // Convenience toggle by id
  toggleDescription(id: number): void {
    const current = this.tasks$.getValue();
    const t = current.find(t => t.id === id);
    if (!t) return;
    this.changeDescriptionVisibility(id, !t.isDescriptionVisible);
  }

  // Removes task by id
  removeTask(id: number): void {
    const currentTasks = this.tasks$.getValue();
    const updatedTasks = currentTasks.filter(task => task.id !== id);
    this.setTasks(updatedTasks);
  }
}

