import { Schema, Document } from 'mongoose';

export const TokenSchema = new Schema({
  userId: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  timestamp: { type: Number, required: true },
  isValid: { type: Boolean, default: false }
});

export interface Token extends Document {
  userId: string;
  email: string; 
  token: string;
  timestamp: number;
  isValid: boolean;
}
