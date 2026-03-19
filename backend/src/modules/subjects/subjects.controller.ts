import type { Request, Response } from 'express';
import type { AuthRequest } from '../../middleware/authMiddleware.js';
import prisma from '../../config/db.js';
import { verifyAccessToken } from '../../utils/jwt.js';

export const getAllSubjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search } = req.query;

    const where: any = { is_published: true };

    if (category && category !== 'All') {
      where.category = category as string;
    }

    if (search) {
      where.OR = [
        { title: { contains: search as string } },
        { description: { contains: search as string } },
      ];
    }

    const subjects = await prisma.subject.findMany({
      where,
      orderBy: { created_at: 'desc' }
    });
    res.status(200).json(subjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching subjects' });
  }
};

export const getSubjectById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { subjectId } = req.params;
    const authHeader = req.headers.authorization;
    let userId: string | null = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token) {
        const decoded = verifyAccessToken(token);
        if (decoded) {
          userId = decoded.userId;
        }
      }
    }

    const subject = await prisma.subject.findUnique({
      where: { id: subjectId as string },
      include: {
        sections: {
          orderBy: { order_index: 'asc' },
          include: {
            videos: {
              orderBy: { order_index: 'asc' },
            }
          }
        }
      }
    });

    if (!subject) {
      res.status(404).json({ message: 'Subject not found' });
      return;
    }

    let isEnrolled = false;
    if (userId) {
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          user_id_subject_id: {
            user_id: userId,
            subject_id: subject.id,
          },
        },
      });
      isEnrolled = !!enrollment;
    }

    res.status(200).json({ ...subject, isEnrolled });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching subject details' });
  }
};

export const enrollSubject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { subjectId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        user_id: userId,
        subject_id: subjectId,
      },
      include: {
        subject: true
      }
    });

    // Create Notification
    await (prisma as any).notification.create({
      data: {
        user_id: userId,
        title: "New Enrollment",
        message: `You've successfully enrolled in ${enrollment.subject.title}!`,
        type: "success"
      }
    });

    res.status(201).json({ message: 'Enrolled successfully', enrollment });
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(400).json({ message: 'Already enrolled in this subject' });
      return;
    }
    console.error(error);
    res.status(500).json({ message: 'Error enrolling in subject' });
  }
};

export const getMyEnrollments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { user_id: userId },
      include: {
        subject: true
      },
      orderBy: { created_at: 'desc' }
    });

    res.status(200).json(enrollments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching enrollments' });
  }
};
