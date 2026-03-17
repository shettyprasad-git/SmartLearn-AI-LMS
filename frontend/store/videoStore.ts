import { create } from 'zustand';

interface VideoProgress {
  videoId: string;
  isCompleted: boolean;
  lastPosition: number;
}

interface VideoState {
  currentVideoId: string | null;
  currentSubjectId: string | null;
  progressList: VideoProgress[];
  setCurrentVideo: (videoId: string, subjectId: string) => void;
  updateProgress: (videoId: string, isCompleted: boolean, lastPosition: number) => void;
  setProgress: (progress: VideoProgress[]) => void;
}

export const useVideoStore = create<VideoState>((set) => ({
  currentVideoId: null,
  currentSubjectId: null,
  progressList: [],
  setCurrentVideo: (videoId, subjectId) => set({ currentVideoId: videoId, currentSubjectId: subjectId }),
  updateProgress: (videoId, isCompleted, lastPosition) => {
    set((state) => {
      const existing = state.progressList.find((p) => p.videoId === videoId);
      if (existing) {
        return {
          progressList: state.progressList.map((p) =>
            p.videoId === videoId ? { ...p, isCompleted, lastPosition } : p
          ),
        };
      }
      return {
        progressList: [...state.progressList, { videoId, isCompleted, lastPosition }],
      };
    });
  },
  setProgress: (progress) => set({ progressList: progress }),
}));
