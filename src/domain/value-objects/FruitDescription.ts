export class FruitDescription {
  private readonly description: string;

  private static MAX_LENGTH = 30;

  constructor(description: string) {
    if (description.length > FruitDescription.MAX_LENGTH) {
      throw new Error(`Description must be at most ${FruitDescription.MAX_LENGTH} characters.`);
    }
    this.description = description;
  }

  public get value(): string {
    return this.description;
  }
}
