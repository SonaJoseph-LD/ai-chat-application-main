import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getUserRepository } from '../config/database';
import { config } from '../config/env';
import { User } from '../entities/User';
import { UserDto, RegisterRequest, LoginRequest, LoginResponse } from '../models/User';

export class AuthService {
  public generateToken(subject: string): string {
    return jwt.sign({ sub: subject }, config.jwt.secret, {
      expiresIn: config.jwt.expiration,
    });
  }

  public verifyToken(token: string): { sub: string } | null {
    try {
      return jwt.verify(token, config.jwt.secret) as { sub: string };
    } catch {
      return null;
    }
  }

  public async register(request: RegisterRequest): Promise<UserDto> {
    const userRepo = getUserRepository();

    const existingEmail = await this.getUserByEmail(request.email);
    if (existingEmail) {
      throw new Error('Email already registered');
    }

    const existingUsername = await this.getUserByUsername(request.username);
    if (existingUsername) {
      throw new Error('Username already taken');
    }

    const hashedPassword = await bcrypt.hash(request.password, 10);
    const user = userRepo.create({
      username: request.username,
      email: request.email,
      password: hashedPassword,
    });

    const savedUser = await userRepo.save(user);

    return {
      id: savedUser.id,
      username: savedUser.username,
      email: savedUser.email,
    };
  }

  public async login(request: LoginRequest): Promise<LoginResponse | null> {
    const user = await this.getUserByEmail(request.email);
    if (!user || !user.password) {
      return null;
    }

    const isMatch = await bcrypt.compare(request.password, user.password);
    if (!isMatch) {
      return null;
    }

    const token = this.generateToken(user.email);
    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    const userRepo = getUserRepository();
    return userRepo.findOneBy({ email });
  }

  public async getUserByUsername(username: string): Promise<User | null> {
    const userRepo = getUserRepository();
    return userRepo.findOneBy({ username });
  }

  public async getUserById(id: number): Promise<User | null> {
    const userRepo = getUserRepository();
    return userRepo.findOneBy({ id });
  }
}

export const authService = new AuthService();
