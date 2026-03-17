import type { Request, Response } from 'express';
import axios from 'axios';
import prisma from '../../config/db.js';

const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

export const importPlaylist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { playlistId, category, tutorName } = req.body;

    if (!playlistId) {
      res.status(400).json({ message: 'Playlist ID is required' });
      return;
    }

    if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY === 'YOUR_YOUTUBE_API_KEY') {
       res.status(500).json({ message: 'YouTube API Key not configured' });
       return;
    }

    // 1. Fetch Playlist Metadata
    const playlistResponse = await axios.get(`${YOUTUBE_API_BASE_URL}/playlists`, {
      params: {
        part: 'snippet',
        id: playlistId,
        key: YOUTUBE_API_KEY,
      }
    });

    if (playlistResponse.data.items.length === 0) {
      res.status(404).json({ message: 'Playlist not found' });
      return;
    }

    const playlistData = playlistResponse.data.items[0].snippet;

    // 2. Fetch Playlist Items (Videos)
    const playlistItemsResponse = await axios.get(`${YOUTUBE_API_BASE_URL}/playlistItems`, {
      params: {
        part: 'snippet,contentDetails',
        playlistId: playlistId,
        maxResults: 50,
        key: YOUTUBE_API_KEY,
      }
    });

    const videos = playlistItemsResponse.data.items;

    // 3. Create Subject in DB
    const subject = await prisma.subject.create({
      data: {
        title: playlistData.title,
        description: playlistData.description,
        slug: `${playlistData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')}-${Date.now()}`,
        category: category || "Others",
        tutor_name: tutorName || "SmartLearn Expert",
        is_published: true,
      }
    });

    // 4. Create a default Section
    const section = await prisma.section.create({
      data: {
        subject_id: subject.id,
        title: 'Course Content',
        order_index: 0,
      }
    });

    // 5. Create Videos
    const videoData = videos.map((v: any, index: number) => ({
      section_id: section.id,
      title: v.snippet.title,
      description: v.snippet.description,
      youtube_video_id: v.contentDetails.videoId,
      order_index: index,
      duration_seconds: 0, // YouTube Data API /videos endpoint needed for duration, keeping 0 for now
    }));

    await prisma.video.createMany({
      data: videoData
    });

    res.status(201).json({
      message: 'Playlist imported successfully',
      subjectId: subject.id,
      videoCount: videoData.length
    });

  } catch (error: any) {
    console.error('YouTube Import Error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to import playlist' });
  }
};
