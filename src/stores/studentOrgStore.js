import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

 
const originalOrganizations = [
            {
                id: 1,
                university: '중앙대학교7',
                department: '37대 경영학부 학생회',
                council_name: '다움',
                student_size: '1,000명',
                date: { start: '2025.08', end: '2025.10' },
                period: 3,
                record: 3,
                likes: 12,
                receivedDate: "2025.08.12",
                writtenDate: "2025.08.12",
            },
            {
                id: 2,
                university: '중앙대학교3',
                department: '21대 공과대학 학생회',
                council_name: '나',
                student_size: '2,500명',
                date: { start: '2025.08', end: '2026.03' },
                period: 8,
                record: 5,
                likes: 51,
                receivedDate: "2025.08.12",
                writtenDate: "2025.08.12",
            },
            {
                id: 3,
                university: '중앙대학교1',
                department: '35대 소프트웨어학과 학생회',
                council_name: '가',
                student_size: '500명',
                date: { start: '2025.08', end: '2025.10' },
                period: 3,
                record: 12,
                likes: 89,
                receivedDate: "2025.08.12",
                writtenDate: "2025.08.12",
            },
            {
                id: 4,
                university: '중앙대학교4',
                department: '36대 소프트웨어학과 학생회',
                council_name: '가나',
                student_size: '500명',
                date: { start: '2025.07', end: '2025.10' },
                period: 4,
                record: 16,
                likes: 42,
                receivedDate: "2025.08.12",
                writtenDate: "2025.08.12",
            },
            {
                id: 5,
                university: '중앙대학교5',
                department: '37대 소프트웨어학과 학생회',
                council_name: '가나다',
                student_size: '600명',
                date: { start: '2025.08', end: '2025.09' },
                period: 2,
                record: 7,
                likes: 32,
                receivedDate: "2025.08.12",
                writtenDate: "2025.08.12",
            },
            {
                id: 6,
                university: '중앙대학교6',
                department: '38대 소프트웨어학과 학생회',
                council_name: '가나다라',
                student_size: '400명',
                date: { start: '2025.08', end: '2025.10' },
                period: 3,
                record: 10,
                likes: 23,
                receivedDate: "2025.08.12",
                writtenDate: "2025.08.12",
            },
            {
                id: 7,
                university: '중앙대학교7',
                department: '39대 소프트웨어학과 학생회',
                council_name: '가나다라마',
                student_size: '400명',
                date: { start: '2025.08', end: '2025.10' },
                period: 3,
                record: 0,
                likes: 2,
                receivedDate: "2025.08.12",
                writtenDate: "2025.08.12",
            },
            {
                id: 8,
                university: '중앙대학교2',
                department: '40대 소프트웨어학과 학생회',
                council_council_name: '가나다라마바',
                student_size: '400명',
                date: { start: '2025.08', end: '2025.10' },
                period: 3,
                record: 0,
                likes: 62,
                receivedDate: "2025.08.12",
                writtenDate: "2025.08.12",
            },
        ];

const useStudentOrgStore = create(
    persist(
        (set, get) => ({
        originalOrganizations: originalOrganizations, // api 끌어올 때 빈 배열로 만들어주기기
        organizations: originalOrganizations, // api 끌어올 때 빈 배열로 만들어주기기

        // 나중에 api 연동 시 그대로 사용
        // fetchAndSetOrganizations: async () => {
        //     const userList = await fetchUserList();
        //     console.log(userList);
        //     const orgList = userList.map(mapUserToOrg);
        //     set({
        //       originalOrganizations: orgList, // 실제 데이터로 overwrite
        //       organizations: orgList,
        //     });
        // },


        isFilteredByRecord: false,
        sortKey: null, // 현재 정렬 상태를 저장할 변수 : 정렬 + 필터 위함

        
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