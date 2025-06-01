import { IFruitRepository } from '../../domain/repositories/IFruitRepository';

export class DeleteFruitUseCase {
  constructor(private fruitRepo: IFruitRepository) {}

  async execute(name: string, forceDelete: boolean) {
    const fruit = await this.fruitRepo.findByName(name);
    if (!fruit) {
      throw new Error('Fruit not found');
    }

    if (!forceDelete && fruit.getAmountStored() > 0) {
      throw new Error('Cannot delete a fruit with stored amount unless forceDelete is true');
    }

    await this.fruitRepo.delete(fruit.id);
    // Return the fruit object before deletion
    return fruit;
  }
}
