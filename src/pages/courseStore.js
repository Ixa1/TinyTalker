import { create } from 'zustand';

export const useCourseStore = create((set) => ({
  selectedCourseId: 1, // 1 = English, 2 = Nepali
  selectedCourseName: 'English',
  xp: 0,
  hearts: 5,

  // Course setter
  setCourse: (id, name) => set({ selectedCourseId: id, selectedCourseName: name }),

  // Toggle between English/Nepali
  toggleCourse: () =>
    set((state) =>
      state.selectedCourseId === 1
        ? { selectedCourseId: 2, selectedCourseName: 'Nepali' }
        : { selectedCourseId: 1, selectedCourseName: 'English' }
    ),

  // XP
  setXp: (xp) => set({ xp }),
  addXp: (amount) => set((state) => ({ xp: state.xp + amount })),

  // Hearts
  loseHeart: () => set((state) => ({ hearts: Math.max(0, state.hearts - 1) })),
  refillHeart: () => set((state) => ({ hearts: Math.min(5, state.hearts + 1) })),
  resetHearts: () => set({ hearts: 5 }),
}));
export const useCourseStoreWithPersist = create(
  (set) => ({
    selectedCourseId: 1,
    selectedCourseName: 'English',
    xp: 0,
    hearts: 5,

    setCourse: (id, name) => set({ selectedCourseId: id, selectedCourseName: name }),
    toggleCourse: () =>
      set((state) =>
        state.selectedCourseId === 1
          ? { selectedCourseId: 2, selectedCourseName: 'Nepali' }
          : { selectedCourseId: 1, selectedCourseName: 'English' }
      ),
    setXp: (xp) => set({ xp }),
    addXp: (amount) => set((state) => ({ xp: state.xp + amount })),
    loseHeart: () => set((state) => ({ hearts: Math.max(0, state.hearts - 1) })),
    refillHeart: () => set((state) => ({ hearts: Math.min(5, state.hearts + 1) })),
    resetHearts: () => set({ hearts: 5 }),
  }),
  {
    name: 'course-storage', // unique name
  }
);