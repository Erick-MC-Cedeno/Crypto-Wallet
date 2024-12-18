import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Wallet } from '../../wallet/schemas/wallet.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop()
    firstName: string;

    @Prop()
    lastName: string;

    @Prop({
        required: true,
        unique: true
    })
    email: string;

    @Prop({
        required: true
    })
    password: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Wallet' }] })
    wallets: [Wallet];

    _id?: string; 

    @Prop()
    token: string;

    @Prop({ default: false })
    isValid: boolean;

    @Prop({ default: false })
    isTokenEnabled: boolean;
    
}

export const UserSchema = SchemaFactory.createForClass(User);
