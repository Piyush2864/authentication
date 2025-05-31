import mongoose, {Schema} from 'mongoose';
import { IUser } from '../types/userTypes';


const userSchema = new Schema<IUser>({
    provider: {
        type: String,
        required: true
    },
    providerId: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    name: {
        type: String
    },
    avatar: {
        type: String
    },
    refreshToken: {
        type: String
    },
    profileData: {
        type: Object
    },
}, {timestamps: true}
);

const User = mongoose.model<IUser>("User", userSchema);
export default User;