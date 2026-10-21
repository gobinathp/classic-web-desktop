export type Area = 'Career' | 'Learning' | 'Wellbeing';
export interface Goal { id: string; title: string; area: Area; due: string; progress: number; outcome: string }
export interface Task { id: string; title: string; goalId: string; done: boolean }
export interface Habit { id: string; title: string; days: string[] }
export function dateKey(offset = 0) { const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + offset); return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-'); }
export function seed() {
  const goals: Goal[] = [
    { id: 'g1', title: 'Build my geospatial portfolio', area: 'Career', due: dateKey(30), progress: 40, outcome: 'Publish 3 case studies that explain the problem, approach and result.' },
    { id: 'g2', title: 'Make Python a daily practice', area: 'Learning', due: dateKey(21), progress: 65, outcome: 'Complete 20 practice sessions and build one useful automation.' },
    { id: 'g3', title: 'Create space to recharge', area: 'Wellbeing', due: dateKey(28), progress: 25, outcome: 'Take a 20-minute walk on 5 days each week.' },
  ];
  const tasks: Task[] = [{ id: 't1', title: 'Outline the first portfolio case study', goalId: 'g1', done: false }, { id: 't2', title: 'Practice Python lists for 20 minutes', goalId: 'g2', done: true }, { id: 't3', title: 'Take a walk after work', goalId: 'g3', done: false }];
  const habits: Habit[] = [{ id: 'h1', title: 'Learn for 20 minutes', days: [-6, -5, -3, -2, -1].map(dateKey) }, { id: 'h2', title: 'Move for 20 minutes', days: [-6, -4, -2].map(dateKey) }, { id: 'h3', title: 'Write a short reflection', days: [-5, -3, -1].map(dateKey) }];
  return { goals, tasks, habits };
}
export function toggleDay(days: string[], day: string) { return days.includes(day) ? days.filter(value => value !== day) : [...days, day]; }
