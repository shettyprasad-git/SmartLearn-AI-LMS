import type { Response } from 'express';
import type { AuthRequest } from '../../middleware/authMiddleware.js';
import { YouTubeService } from './youtube.service.js';
import prisma from '../../config/db.js';

export const searchYouTubeCourses = async (req: AuthRequest, res: Response) => {
  try {
    const { q } = req.query;
    if (!q) {
      res.status(400).json({ message: 'Query parameter q is required' });
      return;
    }

    const courses = await YouTubeService.searchCourses(q as string);
    res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error searching YouTube' });
  }
};

export const getSearchSuggestions = async (req: AuthRequest, res: Response) => {
  try {
    const { q } = req.query;
    if (!q) {
      res.status(200).json([]);
      return;
    }
    const suggestions = await YouTubeService.getSuggestions(q as string);
    res.status(200).json(suggestions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching suggestions' });
  }
};

/**
 * Import a course from YouTube (persist to DB)
 */
export const importYouTubeCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { youtubeId, sourceType, title, description, thumbnail, category, difficulty, channelTitle } = req.body;
    const userId = req.user?.userId;

    // 1. Create or find subject
    const slug = `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${youtubeId}`;
    
    const subject = await prisma.subject.upsert({
      where: { youtube_id: youtubeId },
      update: { is_published: true },
      create: {
        youtube_id: youtubeId,
        title,
        slug,
        description,
        thumbnail_url: thumbnail,
        category,
        difficulty,
        tutor_name: channelTitle,
        source_type: sourceType,
        is_published: true,
      }
    });

    // 2. If playlist, import all videos as sections/lessons
    if (sourceType === 'playlist') {
      const videos = await YouTubeService.getPlaylistVideos(youtubeId);
      
      // Create a single default section for the playlist
      const section = await prisma.section.upsert({
        where: { subject_id_title: { subject_id: subject.id, title: 'Course Content' } },
        update: {},
        create: {
          subject_id: subject.id,
          title: 'Course Content',
          order_index: 0,
        }
      });

      for (const v of videos) {
        await prisma.video.upsert({
          where: { section_id_youtube_video_id: { section_id: section.id, youtube_video_id: v.videoId || '' } },
          update: {},
          create: {
            section_id: section.id,
            title: v.title || 'Untitled Lesson',
            youtube_video_id: v.videoId || '',
            order_index: v.order,
          }
        });
      }
    } else {
      // Single video course
      const section = await prisma.section.upsert({
        where: { subject_id_title: { subject_id: subject.id, title: 'Main Content' } },
        update: {},
        create: {
          subject_id: subject.id,
          title: 'Main Content',
          order_index: 0,
        }
      });

      await prisma.video.upsert({
        where: { section_id_youtube_video_id: { section_id: section.id, youtube_video_id: youtubeId } },
        update: {},
        create: {
          section_id: section.id,
          title: title,
          youtube_video_id: youtubeId,
          order_index: 0,
        }
      });
    }

    // 3. Auto-enroll the user
    if (userId) {
      await prisma.enrollment.upsert({
        where: { user_id_subject_id: { user_id: userId, subject_id: subject.id } },
        update: {},
        create: {
          user_id: userId,
          subject_id: subject.id,
        }
      });

      // Notification
      await (prisma as any).notification.create({
        data: {
          user_id: userId,
          title: "New Enrollment",
          message: `You've successfully enrolled in ${subject.title}!`,
          type: "success"
        }
      });
    }

    res.status(201).json(subject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error importing course' });
  }
};
