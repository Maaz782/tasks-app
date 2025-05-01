import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';
import { v4 } from 'uuid';
import mongoose from 'mongoose';

export class AuthController {
    public generateToken(id: string, role: string): string {
        return jwt.sign({ id, role }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    }

    async registerUser(req: Request, res: Response): Promise<IUser | void> {
        try {
            const role = req.body.role || 'user';
            const { name, email, password } = req.body;

            const existingUser = await User.findOne({ email });
            console.log('Existing user:', existingUser);
            if (existingUser) {
                const error = new Error('User already exists');
                res.status(400).json({ message: 'User already exists' });
                throw error;
            }

            const user = await User.create({ name, email, password, role });
            return user;
        }
        catch (error) {
            console.error('Error registering user:', error);
            throw error;
        }
    };

    async loginUser(req: Request, res: Response): Promise<{ token: string; user: { _id: string; email: string; role: string } }> {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email }) as { _id: string; role: string; comparePassword: (password: string) => Promise<boolean> };
            if (!user) {
                const error = new Error('User not found');
                res.status(401).json({ message: 'User not found' });
                throw error;
            }
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                const error = new Error('Invalid credentials');
                res.status(401).json({ message: 'Invalid credentials' });
                throw error;
            }

            const token = this.generateToken(user._id.toString(), user.role);

            return { token: token, user: { _id: user._id, email: email, role: user.role } };
        }
        catch (error) {
            console.error('Error logging in user:', error);
            throw error;
        }
    };
}




