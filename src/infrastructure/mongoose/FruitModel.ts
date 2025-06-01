import mongoose, { Document, Schema } from 'mongoose';

export interface IFruitDocument extends Document {
  id: string;
  name: string;
  description: string;
  limitOfFruitToBeStored: number;
  amountStored: number;
}

const FruitSchema = new Schema<IFruitDocument>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  limitOfFruitToBeStored: { type: Number, required: true },
  amountStored: { type: Number, required: true, default: 0 }
});

export const FruitModel = mongoose.model<IFruitDocument>('Fruit', FruitSchema);
