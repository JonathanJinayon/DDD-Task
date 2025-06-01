export interface DomainEvent {
  id: string;
  type: string;
  payload: any;
  occurredAt: Date;
}

export class FruitCreatedEvent implements DomainEvent {
  id: string;
  type = 'FruitCreated';
  payload: {
    id: string;
    name: string;
    description: string;
    limitOfFruitToBeStored: number;
  };
  occurredAt: Date;

  constructor(fruit: {
    id: string;
    name: string;
    description: string;
    limitOfFruitToBeStored: number;
  }) {
    this.id = fruit.id;
    this.payload = fruit;
    this.occurredAt = new Date();
  }
}
