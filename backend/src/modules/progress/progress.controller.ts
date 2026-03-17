import type { Response } from 'express';
import type { AuthRequest } from '../../middleware/authMiddleware.js';
import prisma from '../../config/db.js';

export const updateVideoProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { videoId } = req.params;
    const { last_position_seconds, is_completed } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // 1. Get current video and its order context
    const currentVideo = await prisma.video.findUnique({
      where: { id: videoId },
      include: {
        section: {
          include: {
            subject: true
          }
        }
      }
    });

    if (!currentVideo) {
      res.status(404).json({ message: 'Video not found' });
      return;
    }

    // 2. Strict Ordering Check
    // Get all videos of this subject ordered by section and video index
    const allVideos = await prisma.video.findMany({
      where: {
        section: {
          subject_id: currentVideo.section.subject_id
        }
      },
      orderBy: [
        { section: { order_index: 'asc' } },
        { order_index: 'asc' }
      ]
    });

    const currentIndex = allVideos.findIndex((v: any) => v.id === videoId);

    if (currentIndex > 0) {
      const previousVideo = allVideos[currentIndex - 1];
      if (!previousVideo) {
         res.status(500).json({ message: 'Internal error: Previous video not found' });
         return;
      }
      const prevProgress = await prisma.videoProgress.findUnique({
        where: {
          user_id_video_id: {
            user_id: userId,
            video_id: previousVideo.id
          }
        }
      });

      if (!prevProgress || !prevProgress.is_completed) {
        res.status(403).json({ message: 'Previous video must be completed first', previousVideoId: previousVideo.id });
        return;
      }
    }

    // 3. Upsert Progress
    const progress = await prisma.videoProgress.upsert({
      where: {
        user_id_video_id: {
          user_id: userId,
          video_id: videoId
        }
      },
      update: {
        last_position_seconds,
        is_completed: is_completed || false,
        completed_at: is_completed ? new Date() : undefined,
      },
      create: {
        user_id: userId,
        video_id: videoId,
        last_position_seconds,
        is_completed: is_completed || false,
        completed_at: is_completed ? new Date() : null,
      }
    });

    res.status(200).json({ message: 'Progress updated', progress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating video progress' });
  }
};

export const getProgressBySubject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { subjectId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const progress = await prisma.videoProgress.findMany({
      where: {
        user_id: userId,
        video: {
          section: {
            subject_id: subjectId
          }
        }
      },
      include: {
        video: true
      }
    });

    res.status(200).json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching progress' });
  }
};
