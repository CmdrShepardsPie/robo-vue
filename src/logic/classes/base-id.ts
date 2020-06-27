import { v4 as uuidv4 } from 'uuid';

export abstract class ID {
  id: string = uuidv4();
}
