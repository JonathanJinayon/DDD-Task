import { IFruitRepository } from '../domain/repositories/IFruitRepository';
import { FruitFactory } from '../domain/factories/FruitFactory';
import { FruitNameUniquenessChecker } from '../domain/services/FruitNameUniquenessChecker';
import { EventOutbox } from '../infrastructure/event-outbox/EventOutbox';
import { randomUUID } from 'crypto';

export class FruitService {
  constructor(
    private fruitRepository: IFruitRepository,
    private fruitNameUniquenessService: FruitNameUniquenessChecker
  ) {}

  async createFruit(name: string, description: string, limit: number) {
    if (!(await this.fruitNameUniquenessService.isUnique(name))) {
      throw new Error('Fruit name must be unique');
    }
    const fruit = FruitFactory.create(name, description, limit);
    await this.fruitRepository.save(fruit);

    // Save domain event in transactional outbox
    await EventOutbox.saveEvent({
  id: randomUUID(),
  type: 'FruitCreated',
  payload: { name, description, limit },
  occurredAt: new Date(),
});
  }

  async findFruit(name: string) {
    return this.fruitRepository.findByName(name);
  }
}
