import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const usefilterStore = create(
  persist(
    (set) => ({
      storelist: [],
      orglist: [
        { university: '중앙대학교1', department: '경영학부 학생회1', name: '가움', record: 3, likes: 3 },
        { university: '중앙대학교2', department: '경엉학부 학생회2', name: '나움', record: 2, likes: 20 },
        { university: '중앙대학교3', department: '경영학부 학생회3', name: '다움', record: 1, likes: 15 },
      ],
      orglistFiltered: false,
      storelistFiltered: false,

      setListData: (listName, data) => set({ [listName]: data }),

      sortBy: (listName, type, order = 'asc') => {
        set((state) => {
          const list = [...state[listName]];
          list.sort((a, b) => order === 'asc' ? a[type] - b[type] : b[type] - a[type]);
          return { [listName]: list };
        });
      },
      
      filterByRecordToggle: (listName) => set((state) => {
        const isFiltered = state[`${listName}Filtered`];
        const originalList = state[`${listName}Original`] || state[listName];

        if (isFiltered) {
            return { 
                [listName]: originalList, 
                [`${listName}Filtered`]: false };
        } else {
            const filteredList = state[listName].filter(item => item.record >= 1);
            return { [listName]: filteredList, [`${listName}Filtered`]: true };
        }
        }),
    }),
    { name: 'filter-storage' } 
  )
);

export default usefilterStore;
