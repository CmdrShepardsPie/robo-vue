import { Square } from '@/logic/classes/square';

export class TimelineStep {
  constructor(public step: number, public square: Square) {}
}
export class Timeline {
  robots: { [key: string]: TimelineStep[] } = {};
}
