import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { RegisterRequest, LoginRequest } from '../models/User';

export class AuthController {
  public async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password }: RegisterRequest = req.body;

      if (!username || !email || !password) {
        res.status(400).json({ error: 'Username, email, and password are required' });
        return;
      }

      const userDto = await authService.register({ username, email, password });
      res.status(200).json(userDto);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Registration failed' });
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: LoginRequest = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }

      const loginResponse = await authService.login({ email, password });

      if (!loginResponse) {
        res.status(401).send('Invalid email or password');
        return;
      }

      res.status(200).json(loginResponse);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Login failed' });
    }
  }
}

export const authController = new AuthController();
