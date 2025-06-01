import { IFruitRepository } from '../../domain/repositories/IFruitRepository';
import { FruitDescription } from '../../domain/value-objects/FruitDescription';

export class UpdateFruitUseCase {
  constructor(private fruitRepository: IFruitRepository) {}

  async execute(name: string, newDescription: string, newLimit: number) {
    const fruit = await this.fruitRepository.findByName(name);
    if (!fruit) {
      throw new Error(`Fruit "${name}" not found`);
    }

    fruit.setDescription(new FruitDescription(newDescription));
    fruit.setLimit(newLimit);

    await this.fruitRepository.save(fruit);
    return fruit;
  }
}