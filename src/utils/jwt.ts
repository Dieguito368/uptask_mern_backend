import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

export const generateJWT = (payload: { id: Types.ObjectId }) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '180d'
    });

    return token;
} 