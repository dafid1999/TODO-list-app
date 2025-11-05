export interface Task {
  id: number;
  name: string;
  status: 'W trakcie' | 'Zaplanowane' | 'Zrobione';
  date: string;
  description: string;
  isDescriptionVisible: boolean;
}