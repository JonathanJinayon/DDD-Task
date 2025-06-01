import { IFruitRepository } from '../repositories/IFruitRepository';

export class FruitNameUniquenessChecker {
  constructor(private fruitRepository: IFruitRepository) {}

  async isUnique(name: string): Promise<boolean> {
    const fruit = await this.fruitRepository.findByName(name);
    return !fruit;
  }
}
