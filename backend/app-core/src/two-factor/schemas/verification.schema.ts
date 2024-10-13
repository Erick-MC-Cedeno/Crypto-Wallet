import { Schema, Document } from 'mongoose';

export const TokenSchema = new Schema({
  email: { type: String, required: true }, 
  token: { type: String, required: true, unique: true },
  timestamp: { type: Number, required: true },
  isValid: { type: Boolean, default: false }
});

export interface Token extends Document {
  email: string; 
  token: string;
  timestamp: number;
  isValid: boolean;
}
