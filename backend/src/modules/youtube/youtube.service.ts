import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

export interface DiscoveredCourse {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  sourceType: 'playlist' | 'video';
  duration?: string;
  videoCount?: number;
  category: string;
  difficulty: string;
}

export class YouTubeService {
  /**
   * Search for courses dynamically
   */
  static async searchCourses(query: string): Promise<DiscoveredCourse[]> {
    const searchQueries = [
      `${query} full course`,
      `${query} tutorial for beginners`,
      `${query} crash course`
    ];

    try {
      // Primary: Search for Playlists
      const playlistRes = await youtube.search.list({
        part: ['snippet'],
        q: `${query} full course`,
        type: ['playlist'],
        maxResults: 6,
        relevanceLanguage: 'en',
      });

      const playlists = playlistRes.data.items || [];
      
      // Secondary: Search for Long Videos
      const videoRes = await youtube.search.list({
        part: ['snippet'],
        q: `${query} complete course`,
        type: ['video'],
        videoDuration: 'long', // > 20 mins
        maxResults: 6,
        relevanceLanguage: 'en',
      });

      const videos = videoRes.data.items || [];

      const results: DiscoveredCourse[] = [];

      // Process Playlists
      for (const item of playlists) {
        if (!item.id?.playlistId) continue;
        results.push({
          id: item.id.playlistId,
          title: item.snippet?.title || '',
          description: item.snippet?.description || '',
          thumbnail: item.snippet?.thumbnails?.high?.url || '',
          channelTitle: item.snippet?.channelTitle || '',
          sourceType: 'playlist',
          category: this.classifyCategory(item.snippet?.title || '', item.snippet?.description || ''),
          difficulty: this.detectDifficulty(item.snippet?.title || ''),
        });
      }

      // Process Videos
      for (const item of videos) {
        if (!item.id?.videoId) continue;
        results.push({
          id: item.id.videoId,
          title: item.snippet?.title || '',
          description: item.snippet?.description || '',
          thumbnail: item.snippet?.thumbnails?.high?.url || '',
          channelTitle: item.snippet?.channelTitle || '',
          sourceType: 'video',
          category: this.classifyCategory(item.snippet?.title || '', item.snippet?.description || ''),
          difficulty: this.detectDifficulty(item.snippet?.title || ''),
        });
      }

      return results;
    } catch (error) {
      console.error('YouTube Search Error:', error);
      return [];
    }
  }

  /**
   * Get suggestions using YouTube search (limited subset)
   */
  static async getSuggestions(query: string): Promise<string[]> {
    try {
      const res = await youtube.search.list({
        part: ['snippet'],
        q: query,
        type: ['video'],
        maxResults: 5,
      });
      return res.data.items?.map(item => item.snippet?.title || '') || [];
    } catch (error) {
      return [`${query} full course`, `${query} for beginners`];
    }
  }

  /**
   * Helper: Classify category based on text
   */
  private static classifyCategory(title: string, desc: string): string {
    const text = (title + ' ' + desc).toLowerCase();
    if (text.match(/react|html|css|javascript|nextjs|web/)) return 'Web Development';
    if (text.match(/python|java|c\+\+|golang|programming|rust/)) return 'Programming';
    if (text.match(/machine learning|ml|neural|deep learning/)) return 'Machine Learning';
    if (text.match(/artificial intelligence|ai|llm|gpt/)) return 'Artificial Intelligence';
    if (text.match(/data science|pandas|numpy|analytics/)) return 'Data Science';
    if (text.match(/cybersecurity|hacking|security|pentest/)) return 'Cybersecurity';
    if (text.match(/cloud|aws|azure|gcp|docker|kubernetes/)) return 'Cloud Computing';
    if (text.match(/mobile|flutter|react native|swift|android/)) return 'Mobile Development';
    if (text.match(/devops|cicd|jenkins/)) return 'DevOps';
    if (text.match(/blockchain|web3|crypto|ethereum/)) return 'Blockchain';
    return 'Others';
  }

  /**
   * Helper: Detect difficulty
   */
  private static detectDifficulty(title: string): string {
    const t = title.toLowerCase();
    if (t.includes('beginner') || t.includes('intro') || t.includes('basics') || t.includes('for all')) return 'Beginner';
    if (t.includes('advanced') || t.includes('deep dive') || t.includes('expert')) return 'Advanced';
    if (t.includes('project') || t.includes('intermediate')) return 'Intermediate';
    return 'Beginner';
  }

  /**
   * Fetch all videos in a playlist
   */
  static async getPlaylistVideos(playlistId: string) {
    try {
      const res = await youtube.playlistItems.list({
        part: ['snippet', 'contentDetails'],
        playlistId: playlistId,
        maxResults: 50,
      });
      return res.data.items?.map((item, idx) => ({
        title: item.snippet?.title,
        videoId: item.contentDetails?.videoId,
        order: idx,
      })) || [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  /**
   * Fetch single video details (inc. duration)
   */
  static async getVideoDetails(videoId: string) {
    try {
      const res = await youtube.videos.list({
        part: ['snippet', 'contentDetails', 'statistics'],
        id: [videoId],
      });
      const item = res.data.items?.[0];
      return {
        title: item?.snippet?.title,
        description: item?.snippet?.description,
        thumbnail: item?.snippet?.thumbnails?.high?.url,
        channelTitle: item?.snippet?.channelTitle,
        duration: item?.contentDetails?.duration, // ISO 8601
        viewCount: item?.statistics?.viewCount,
      };
    } catch (error) {
      return null;
    }
  }
}
