import { IFruitRepository } from '../../domain/repositories/IFruitRepository';
import { Fruit } from '../../domain/entities/Fruit';
import { FruitDescription } from '../../domain/value-objects/FruitDescription';
import { v4 as uuidv4 } from 'uuid';

export class CreateFruitUseCase {
  constructor(private readonly fruitRepository: IFruitRepository) {}

  async execute(
    name: string,
    description: string,
    limitOfFruitToBeStored: number
  ): Promise<Fruit> {
    const existingFruit = await this.fruitRepository.findByName(name);
    if (existingFruit) {
      throw new Error(`Fruit with name "${name}" already exists.`);
    }

    const fruitDescription = new FruitDescription(description);
    const id = uuidv4();

    const fruit = new Fruit(
      id,
      name,
      fruitDescription,
      limitOfFruitToBeStored,
      0 // initial amountStored
    );

    await this.fruitRepository.save(fruit);

    return fruit;
  }
}
