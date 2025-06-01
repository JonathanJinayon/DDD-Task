// src/application/use-cases/FindFruitUseCase.ts
import { IFruitRepository } from '../../domain/repositories/IFruitRepository';
import { Fruit } from '../../domain/entities/Fruit';

export class FindFruitUseCase {
  constructor(private readonly fruitRepository: IFruitRepository) {}

  async execute(name: string): Promise<Fruit> {
    const fruit = await this.fruitRepository.findByName(name);
    if (!fruit) {
      throw new Error('Fruit not found');
    }
    return fruit;
  }
}

