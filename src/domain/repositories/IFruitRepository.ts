import { Fruit } from '../entities/Fruit';

export interface IFruitRepository {
  findByName(name: string): Promise<Fruit | null>;
  save(fruit: Fruit): Promise<void>;
  delete(name: string): Promise<void>; 
}
