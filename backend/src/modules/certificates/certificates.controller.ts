import type { Response } from 'express';
import type { AuthRequest } from '../../middleware/authMiddleware.js';
import prisma from '../../config/db.js';

export const getCertificate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { subjectId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // 1. Check if user already has a certificate
    let certificate = await prisma.certificate.findUnique({
      where: {
        user_id_subject_id: {
          user_id: userId,
          subject_id: subjectId
        }
      }
    });

    if (certificate) {
      res.status(200).json(certificate);
      return;
    }

    // 2. Verify all videos in subject are completed
    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
      include: {
        sections: {
          include: {
            videos: true
          }
        }
      }
    });

    if (!subject) {
      res.status(404).json({ message: 'Subject not found' });
      return;
    }

    const allVideoIds = subject.sections.flatMap((s: any) => s.videos.map((v: any) => v.id));
    const completedProgress = await prisma.videoProgress.findMany({
      where: {
        user_id: userId,
        video_id: { in: allVideoIds },
        is_completed: true
      }
    });

    if (completedProgress.length < allVideoIds.length) {
      res.status(403).json({
        message: 'Course not completed yet',
        progress: `${completedProgress.length}/${allVideoIds.length} videos completed`
      });
      return;
    }

    // 3. Generate new certificate
    const year = new Date().getFullYear();
    const count = await prisma.certificate.count();
    const certificateCode = `LMS-${year}-${(count + 1).toString().padStart(4, '0')}`;

    certificate = await prisma.certificate.create({
      data: {
        user_id: userId,
        subject_id: subjectId,
        certificate_code: certificateCode
      }
    });

    res.status(201).json(certificate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error managing certificate' });
  }
};

export const verifyCertificate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { certificateCode } = req.params;
    const certificate = await prisma.certificate.findUnique({
      where: { certificate_code: certificateCode },
      include: {
        user: { select: { name: true } },
        subject: { select: { title: true } }
      }
    });

    if (!certificate) {
      res.status(404).json({ message: 'Certificate invalid' });
      return;
    }

    res.status(200).json({
      valid: true,
      userName: certificate.user.name,
      courseName: certificate.subject.title,
      issuedAt: certificate.issued_at
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error verifying certificate' });
  }
};

export const getAllUserCertificates = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const certificates = await prisma.certificate.findMany({
      where: { user_id: userId },
      include: {
        subject: {
          select: {
            title: true,
            tutor_name: true,
            id: true,
          }
        }
      },
      orderBy: { issued_at: 'desc' }
    });

    res.status(200).json(certificates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching certificates' });
  }
};
