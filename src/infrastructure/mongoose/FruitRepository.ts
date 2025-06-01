import { IFruitRepository } from '../../domain/repositories/IFruitRepository';
import { Fruit } from '../../domain/entities/Fruit';
import { FruitModel } from './FruitModel';
import { FruitMapper } from './FruitMapper';

export class FruitRepository implements IFruitRepository {
  async findByName(name: string): Promise<Fruit | null> {
    const raw = await FruitModel.findOne({ name }).lean();
    if (!raw) return null;
    return FruitMapper.toDomain(raw as any);
  }

  async save(fruit: Fruit): Promise<void> {
    const raw = FruitMapper.toPersistence(fruit);
    await FruitModel.updateOne({ id: fruit.id }, raw, { upsert: true }).exec();
  }

  async delete(name: string): Promise<void> {
    await FruitModel.deleteOne({ name }).exec();
  }
}
