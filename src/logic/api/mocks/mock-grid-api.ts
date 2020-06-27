import { IGrid } from '@/logic/interfaces/i-grid';
import { v4 as uuidv4 } from 'uuid';
import { deepDupe } from '@/logic/helpers/object-helpers';

interface IMockGridDB {
  grids: Grid[];
}

// Alternative to using deepDupe on every return is to make a decorator that does it for every function
// Not worrying about checking for valid values or ids in this mock
// Roughly approximates a Restful API
export default class MockGridAPI {
  private fakeDB: MockGridDB = { grids: [] };
  constructor() {}

  public async getGrids() {
    return deepDupe(this.fakeDB.grids);
  }

  public async getGrid(id: string) {
    return deepDupe(this.fakeDB.grids.find(grid => grid.id === id));
  }

  public async addGrid(inGrid: Grid) {
    if (inGrid.id) {
      throw new Error('Cannot add new grid with ID, use Update');
    }
    const grid = deepDupe(inGrid);
    // TODO: Should check for unique ID, but not realistically going to happen here
    grid.id = uuidv4();
    this.fakeDB.grids.push(grid);
    return deepDupe(grid);
  }

  public async updateGrid(inGrid: Grid) {
    if (!inGrid.id) {
      throw new Error('Grid does not exist, use Add');
    }
    const grid = deepDupe(inGrid);
    const dbGrid = this.fakeDB.grids.find(grid => grid.id === inGrid.id);
    if (!dbGrid) {
      return 0;
    }
    // Simply overwrite the existing values with the new values
    Object.assign(dbGrid, grid);
    return 1;
  }
}
