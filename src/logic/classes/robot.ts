import { Square } from '@/logic/classes/square';
import { GridPosition } from '@/logic/classes/grid-position';
import { ID } from '@/logic/classes/base-id';

export class Robot extends ID {
  sourceSquare?: Square;
  targetSquare?: Square;
  position: GridPosition = new GridPosition();
  constructor(public name: string) {
    super();
  }
}
