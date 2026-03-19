import type { Request, Response } from 'express';
import type { AuthRequest } from '../../middleware/authMiddleware.js';
import prisma from '../../config/db.js';
import { hashPassword, comparePassword } from '../../utils/password.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt.js';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const password_hash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        password_hash,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
      }
    });

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error: any) {
    console.error('Registration Error:', error);
    res.status(500).json({ 
      message: 'Error registering user',
      error: process.env.NODE_ENV === 'production' ? 'Database connection failure' : error.message
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Store refresh token in database (Handle potential collision by upserting if needed, 
    // though tokens are unique UUIDs/JWTs, this ensures robustness)
    await prisma.refreshToken.upsert({
      where: { token_hash: refreshToken },
      update: {
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        revoked_at: null,
      },
      create: {
        user_id: user.id,
        token_hash: refreshToken,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      }
    });

    // Set HTTP-only cookie for refresh token
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in' });
  }
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.status(401).json({ message: 'Refresh token missing' });
      return;
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      res.status(403).json({ message: 'Invalid refresh token' });
      return;
    }

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token_hash: refreshToken }
    });

    if (!storedToken || storedToken.revoked_at || storedToken.expires_at < new Date()) {
      res.status(403).json({ message: 'Refresh token expired or revoked' });
      return;
    }

    const newAccessToken = generateAccessToken(decoded.userId);
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error refreshing token' });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await prisma.refreshToken.updateMany({
        where: { token_hash: refreshToken },
        data: { revoked_at: new Date() }
      });
    }

    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging out' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { name } = req.body;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    await prisma.user.update({
      where: { id: userId },
      data: { name }
    });

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};
