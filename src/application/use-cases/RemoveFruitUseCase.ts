import { IFruitRepository } from '../../domain/repositories/IFruitRepository';

export class RemoveFruitUseCase {
  constructor(private fruitRepository: IFruitRepository) {}

  async execute(name: string, amount: number) {
    const fruit = await this.fruitRepository.findByName(name);
    if (!fruit) {
      throw new Error(`Fruit "${name}" not found`);
    }

    fruit.remove(amount);
    await this.fruitRepository.save(fruit);
    return fruit;
  }
}
