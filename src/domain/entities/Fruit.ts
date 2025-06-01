import { FruitDescription } from '../value-objects/FruitDescription';

export class Fruit {
  public readonly id: string; // UUID string
  public readonly name: string;
  private description: FruitDescription;
  private limitOfFruitToBeStored: number;
  private amountStored: number;

  constructor(
  id: string,
  name: string,
  description: FruitDescription,
  limitOfFruitToBeStored: number,
  amountStored = 0
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.limitOfFruitToBeStored = limitOfFruitToBeStored;
    this.amountStored = amountStored;
  }

  public getDescription(): string {
    return this.description.value;
  }

  public getLimit(): number {
    return this.limitOfFruitToBeStored;
  }

  public getAmountStored(): number {
    return this.amountStored;
  }

  public setDescription(newDescription: FruitDescription): void {
    this.description = newDescription;
  }

  public setLimit(newLimit: number): void {
    this.limitOfFruitToBeStored = newLimit;
  }

  public store(amount: number): void {
    if (this.amountStored + amount > this.limitOfFruitToBeStored) {
      throw new Error('Storing this amount exceeds the storage limit.');
    }
    this.amountStored += amount;
  }

  public remove(amount: number): void {
    if (amount > this.amountStored) {
      throw new Error('Not enough fruit stored to remove the requested amount.');
    }
    this.amountStored -= amount;
  }
}
