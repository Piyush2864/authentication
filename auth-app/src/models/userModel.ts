import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '../types/userTypes';

const ProviderSchema = new Schema({
  provider: { type: String, required: true },
  providerId: { type: String, required: true },
  email: { type: String, default: null },
}, { _id: false });

const userSchema = new Schema<IUser & Document>({
  name: { type: String, default: null},
  email: { type: String, unique: true, sparse: true },
  avatarUrl: {type: String, default: null },
  refreshToken: { type: String },
  profileData: { type: Object },
  providers: [ProviderSchema],
}, { timestamps: true });

const User = mongoose.model<IUser & Document>('User', userSchema);
export default User;
