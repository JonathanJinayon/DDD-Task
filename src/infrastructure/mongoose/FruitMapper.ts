import { Fruit } from '../../domain/entities/Fruit';
import { FruitDescription } from '../../domain/value-objects/FruitDescription';
import { IFruitDocument } from './FruitModel';

export class FruitMapper {
  static toDomain(raw: IFruitDocument): Fruit {
    return new Fruit(
      raw.id,
      raw.name,
      new FruitDescription(raw.description),
      raw.limitOfFruitToBeStored,
      raw.amountStored
    );
  }

  static toPersistence(fruit: Fruit) {
    return {
      id: fruit.id,
      name: fruit.name,
      description: fruit.getDescription(),
      limitOfFruitToBeStored: fruit.getLimit(),
      amountStored: fruit.getAmountStored()
    };
  }
}
