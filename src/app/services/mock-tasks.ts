import { Task } from '../task.model';

const STATUSES: Task['status'][] = ['W trakcie', 'Zaplanowane', 'Zrobione'];

export function generateMockTasks(startId: number, count = 50): Task[] {
  const tasks: Task[] = [];
  const baseDate = new Date('2025-06-01');

  for (let i = 0; i < count; i++) {
    const id = startId + i;
    const status = STATUSES[i % STATUSES.length];
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');

    tasks.push({
      id,
      name: `Zadanie testowe #${id}`,
      status,
      date: `${yyyy}-${mm}-${dd}`,
      description: `To jest przykładowy opis dla zadania testowego #${id}.`,
      isDescriptionVisible: false,
    });
  }

  return tasks;
}
