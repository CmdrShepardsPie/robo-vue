export class GridPosition  {
  x = 0;
  y = 0;
  constructor(position?: GridPosition) {
    if (position) {
      Object.assign(this, position);
    }
  }
}
