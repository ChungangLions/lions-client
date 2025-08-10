import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const usefilterStore = create(
    persist(
        (set) => ({
            storelist: [
                { name: '대관령', record: 3, likes: 3 },
                { name: '대관령', record: 2, likes: 20 },
                { name: '대관령', record: 1, likes: 15 },
            ],
            orglist: [
                { name: '다움', record: 3, likes: 3 },
                { name: '다움', record: 2, likes: 20 },
                { name: '다움', record: 1, likes: 15 },
            ],
            
            sortBy: (listName, type, order = 'asc') => {
                set((state) => {
                    const list = [...state[listName]];
                    list.sort((a, b) => {
                        if (order === 'asc') {
                            return a[type] - b[type];
                        }
                        return b[type] - a[type];
                    });
                    return { [listName]: list };
                });
            },
        }),
        { name: 'filter-storage',
        }
    )
);

export default usefilterStore;