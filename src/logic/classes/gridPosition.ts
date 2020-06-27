export interface GridPosition {
  x: number;
  y: number;
}

export class GridPosition implements GridPosition {
  x = 0;
  y = 0;
  constructor(position?: GridPosition) {
    if (position) {
      Object.assign(this, position);
    }
  }
}
