import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStudentStore = create(
    persist(
        (set, get) => ({
        organizations: [
            {
                id: 1,
                university: '중앙대학교1',
                department: '37대 경영학부 학생회',
                name: '다움',
                student_num: '1,000명',
                date: { start: '2025.08', end: '2025.10' },
                period: '3개월',
                record: 3,
                likes: 12,
            },
            {
                id: 2,
                university: '중앙대학교2',
                department: '21대 공과대학 학생회',
                name: '나',
                student_num: '2,500명',
                date: { start: '2025.08', end: '2026.03' },
                period: '8개월',
                record: 5,
                likes: 51,
            },
            {
                id: 3,
                university: '중앙대학교3',
                department: '35대 소프트웨어학과 학생회',
                name: '가',
                student_num: '500명',
                date: { start: '2025.08', end: '2025.10' },
                period: '3개월',
                record: 12,
                likes: 89,
            },
            {
                id: 4,
                university: '중앙대학교4',
                department: '36대 소프트웨어학과 학생회',
                name: '가나',
                student_num: '500명',
                date: { start: '2025.07', end: '2025.10' },
                period: '4개월',
                record: 16,
                likes: 42,
            },
            {
                id: 5,
                university: '중앙대학교5',
                department: '37대 소프트웨어학과 학생회',
                name: '가나다',
                student_num: '600명',
                date: { start: '2025.08', end: '2025.09' },
                period: '2개월',
                record: 7,
            },
            {
                id: 6,
                university: '중앙대학교6',
                department: '38대 소프트웨어학과 학생회',
                name: '가나다라',
                student_num: '400명',
                date: { start: '2025.08', end: '2025.10' },
                period: '3개월',
                record: 10,
            },
        ],
        // 찜 많은 순
        sortByLikeAsc: ()=> {
            set((state) => ({
                organizations : [...state.organizations].sort((a,b) => a.likes - b.likes),
            }));
        },

        // 제휴 이력 많은 순
        sortByRecordAsc: () => {
            set((state) => ({
                organizations: [...state.organizations].sort((a,b) => a.record - b.record),
            }));
        },

        // 제휴 이력 1 이상 필터링
        filterByRecord: () => {
            set((state) => ({
                organizations: state.organizations.filter(organizations => organizations.record>=1),
            }));
        },
    }),
    {
        name: 'organization-storage',
    }
    )
);

export default useStudentStore;