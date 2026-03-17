import type { Response } from 'express';
import type { AuthRequest } from '../../middleware/authMiddleware.js';
import prisma from '../../config/db.js';

export const getMyAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // 1. Courses Enrolled
    const enrolledCount = await prisma.enrollment.count({
      where: { user_id: userId }
    });

    // 2. Courses Completed (based on certificates)
    const completedCount = await prisma.certificate.count({
      where: { user_id: userId }
    });

    // 3. Videos Watched (total unique completed videos)
    const videosWatched = await prisma.videoProgress.count({
      where: {
        user_id: userId,
        is_completed: true
      }
    });

    // 4. Learning Hours (sum of video durations for completed videos)
    const completedVideos = await prisma.videoProgress.findMany({
      where: {
        user_id: userId,
        is_completed: true
      },
      include: {
        video: true
      }
    });

    const totalSeconds = completedVideos.reduce((acc: number, curr: any) => acc + (curr.video.duration_seconds || 0), 0);
    const learningHours = Math.round((totalSeconds / 3600) * 10) / 10;

    res.status(200).json({
      enrolledCount,
      completedCount,
      videosWatched,
      learningHours,
      recentProgress: completedVideos.slice(0, 5).map((v: any) => ({
        videoTitle: v.video.title,
        completedAt: v.completed_at
      }))
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching analytics' });
  }
};
