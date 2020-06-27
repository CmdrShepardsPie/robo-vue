import * as robotManager from '@/logic/managers/robot-manager';
import { Square } from '@/logic/classes/square';
import { Robot } from '@/logic/classes/robot';
import { arrayOf } from '@/logic/helpers/object-helpers';

export interface Grid {
  id: string;
  squareRows: Square[][];
  robots: Robot[];
  add({ rows, columns }: { rows: number; columns: number }): void;
  moveRobotToSquare(robot: Robot, toSquare: Square): void;
}

export class Grid implements Grid {
  id = '';
  squareRows: Square[][];
  robots: Robot[] = [];

  constructor(public rowCount: number = 1, public columnCount: number = 1) {
    this.squareRows = arrayOf(this.rowCount, y =>
      arrayOf(this.columnCount, x => new Square({ x, y }))
    );
    console.log('this.squareRows', this.squareRows);
  }

  // TODO: Allow adding squareRows and columns to beginning, end, or anywhere
  // TODO: Allow creating irregular (non-rectangular) grids (convex or concave)
  add({ rows, columns }: { rows: number; columns: number }): void {
    if (rows) {
      this.squareRows.push(
        ...arrayOf(rows, y =>
          arrayOf(
            this.columnCount,
            x => new Square({ x, y: this.rowCount + y })
          )
        )
      );
      this.rowCount += rows;
    }
    if (columns) {
      this.squareRows.forEach((row, y) =>
        row.push(
          ...arrayOf(
            columns,
            x => new Square({ x: this.columnCount + x, y: y })
          )
        )
      );
      this.columnCount += columns;
    }
    console.log('add', 'this.squareRows', this.squareRows);
  }

  moveRobotToSquare(robot: Robot, toSquare: Square) {
    robotManager.moveRobotToSquare(robot, toSquare);
  }
}
