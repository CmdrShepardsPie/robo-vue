import { Square } from '@/logic/classes/square';
import { GridPosition } from '@/logic/classes/gridPosition';

export class RobotSquarePosition {
  // null assignment assertion isn't ideal but works for this example
  square!: Square;
  position: GridPosition = new GridPosition();
  constructor(position: RobotSquarePosition) {
    Object.assign(this, position);
  }
}
