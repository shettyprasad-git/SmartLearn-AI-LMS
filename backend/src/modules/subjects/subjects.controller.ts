import type { Request, Response } from 'express';
import type { AuthRequest } from '../../middleware/authMiddleware.js';
import prisma from '../../config/db.js';

export const getAllSubjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const subjects = await prisma.subject.findMany({
      where: { is_published: true },
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
    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
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

    res.status(200).json(subject);
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
