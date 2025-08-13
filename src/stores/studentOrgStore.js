import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const useStudentOrgStore = create(
    persist(
        (set, get) => ({
        originalOrganizations: [],
        organizations: [],

        isFilteredByRecord: false,
        sortKey: null, // 현재 정렬 상태를 저장할 변수 : 정렬 + 필터 위함

        fetchOrganizations: async () => {
        try {
          const res = await axios.get('/api/organizations'); // MSW mock API
          const data = res.data.data; 
          set({
            originalOrganizations: data,
            organizations: data
          });
        } catch (err) {
          console.error('Failed to fetch organizations', err);
        }
      },

        // 많은 순
        sortByDesc: (key) => {
            const currentList = get().organizations;
            const sortedList = [...currentList].sort((a,b)=> b[key]-a[key]);
            set({ organizations : sortedList, sortKey : key});
        },

        // 제휴 이력 1 이상 필터링
        filterByRecord: () => {
            const isFiltered = get().isFilteredByRecord;
            const sortKey = get().sortKey;

            if (isFiltered){
                let newList = get().originalOrganizations;

                // 필터 해제 + 정렬 설정되어있는 상태라면 
                if(sortKey !=null){ 
                    newList = [...newList].sort((a, b) => b[sortKey] - a[sortKey]);
                }

                set({
                    organizations: newList,
                    isFilteredByRecord: false,
                })
            } else {
                const currentList = get().organizations;
                const filteredList = currentList.filter(org => org.record >= 1);
                set({
                    organizations: filteredList,
                    isFilteredByRecord: true,
                });
            }
        },
    }),
    {
        name: 'organization-storage',
    }
    )
);

export default useStudentOrgStore;