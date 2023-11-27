import mongoose from 'mongoose';
import { Document } from 'mongoose';

interface Account {
    name: string;
    amount: number;
}

interface Transaction {
    type: string;
    amount: number;
    date: Date;
    from: string;
    to: string;
    newBalance: number;
    informations: string;
}

interface UserAttributes {
    name: string;
    age: number;
    account: Account[];
    transactions: Transaction[];
    overdraft: number;
}

export interface UserDocument extends UserAttributes, Document {
    _id: string; // Assuming you are using MongoDB ObjectID as strings
    creationDate: Date;
}

export const UserSchema = new mongoose.Schema<UserDocument>(
    {
        name: { type: String, required: true },
        age: { type: Number, required: true },
        account: [{ name: String, amount: Number }],
        transactions: [{ type: String, amount: Number, date: Date, from: String, to: String, newBalance: Number, informations: String }],
        overdraft: { type: Number, required: false },
        creationDate: { type: Date, default: Date.now },
    },
    { versionKey: false } // exclude the __v field
);

export const UserModel = mongoose.model<UserDocument>('User', UserSchema);
