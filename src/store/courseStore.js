import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCourseStore = create(persist(
  (set) => ({
    selectedCourse: null,
    setSelectedCourse: (course) => set({ selectedCourse: course }),
  }),
  {
    name: 'selected-course-storage', // key in localStorage
  }
));