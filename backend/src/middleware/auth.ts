import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    username: string;
  };
}

export async function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized: Missing or invalid token' });
    return;
  }

  const token = authHeader.substring(7);
  const payload = authService.verifyToken(token);

  if (!payload || !payload.sub) {
    res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
    return;
  }

  const user = await authService.getUserByEmail(payload.sub);
  if (!user) {
    res.status(401).json({ message: 'Unauthorized: User not found' });
    return;
  }

  req.user = {
    id: user.id,
    email: user.email,
    username: user.username,
  };

  next();
}

export async function optionalAuthMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const payload = authService.verifyToken(token);

    if (payload && payload.sub) {
      const user = await authService.getUserByEmail(payload.sub);
      if (user) {
        req.user = {
          id: user.id,
          email: user.email,
          username: user.username,
        };
      }
    }
  }

  next();
}
