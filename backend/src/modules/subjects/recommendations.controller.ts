import type { Response } from 'express';
import type { AuthRequest } from '../../middleware/authMiddleware.js';
import prisma from '../../config/db.js';

export const getRecommendations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // 1. Get subjects the user is ALREADY enrolled in
    const enrollments = await prisma.enrollment.findMany({
      where: { user_id: userId },
      select: { subject_id: true }
    });
    const enrolledIds = enrollments.map((e: any) => e.subject_id);

    // 2. Recommend published subjects NOT enrolled in
    const recommendations = await prisma.subject.findMany({
      where: {
        id: { notIn: enrolledIds },
        is_published: true
      },
      take: 5
    });

    res.status(200).json(recommendations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching recommendations' });
  }
};
