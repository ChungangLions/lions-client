import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const useVenueStore = create(
    persist(
        (set, get) => ({
        originalStores: [],
        stores: [],

        isFilteredByStoreType: false,
        isFilteredByDealType: false,
        sortKey: null, // 현재 정렬 상태를 저장할 변수 : 정렬 + 필터 위함

        fetchStores: async () => {
        try {
          const res = await axios.get('/api/stores'); 
          const data = res.data.data; 
          set({
            originalStores: data,
            stores: data
          });
        } catch (err) {
          console.error('Failed to fetch stores', err);
        }
      },

        // 찜/추천/제휴 이력 많은 순
        sortByDesc: (key) => {
            const currentList = get().stores;
            const sortedList = [...currentList].sort((a,b)=> b[key]-a[key]);
            set({ stores : sortedList, sortKey : key});
        },


        filterByStoreType: () => {
            const isFiltered = get().isFilteredByStoreType;
            const sortKey = get().sortKey;

            if (isFiltered){
                let newList = get().originalStores;

                // 필터 해제 + 정렬 설정되어있는 상태라면 
                if(sortKey !=null){ 
                    newList = [...newList].sort((a, b) => b[sortKey] - a[sortKey]);
                }

                set({
                    stores: newList,
                    isFilteredByStoreType: false,
                })
            } else {
                const currentList = get().stores;
                const filteredList = currentList.filter(org => org.record >= 1);
                set({
                    stores: filteredList,
                    isFilteredByStoreType: true,
                });
            }
        },

        filterByDealType: () => {
            const isFiltered = get().isFilteredByDealType;
            const sortKey = get().sortKey;

            if (isFiltered){
                let newList = get().originalStores;

                // 필터 해제 + 정렬 설정되어있는 상태라면 
                if(sortKey !=null){ 
                    newList = [...newList].sort((a, b) => b[sortKey] - a[sortKey]);
                }

                set({
                    stores: newList,
                    isFilteredByDealType: false,
                })
            } else {
                const currentList = get().stores;
                const filteredList = currentList.filter(org => org.record >= 1);
                set({
                    stores: filteredList,
                    isFilteredByDealType: true,
                });
            }
        },
    }),
    {
        name: 'venue-storage',
    }
    )
);

export default useVenueStore;