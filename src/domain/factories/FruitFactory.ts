import { v4 as uuidv4 } from 'uuid';
import { Fruit } from '../entities/Fruit';
import { FruitDescription } from '../value-objects/FruitDescription';

export class FruitFactory {
  static create(
    name: string,
    description: string,
    limitOfFruitToBeStored: number
  ): Fruit {
    return new Fruit(
      uuidv4(),
      name,
      new FruitDescription(description),
      limitOfFruitToBeStored,
      0
    );
  }
}
