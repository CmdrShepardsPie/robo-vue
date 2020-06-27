import { Square } from '@/logic/classes/square';
import { GridPosition } from '@/logic/classes/gridPosition';

export interface Robot {
  id: string;
  name: string;
  sourceSquare?: Square;
  targetSquare?: Square;
  position: GridPosition;
}

export class Robot implements Robot {
  id = '';
  sourceSquare?: Square;
  targetSquare?: Square;
  position: GridPosition = new GridPosition();
  constructor(public name: string) {}
}
