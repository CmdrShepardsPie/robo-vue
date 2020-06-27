import { Robot } from '@/logic/classes/robot';
import { GridPosition } from '@/logic/classes/gridPosition';

export interface Square {
  robots: Robot[];
  position: GridPosition;
}

export class Square implements Square {
  // Each square should only ever have one robot, but in case we need to track robots partially occupying the same square at the same time
  robots: Robot[] = [];
  constructor(public position: GridPosition) {}
}
