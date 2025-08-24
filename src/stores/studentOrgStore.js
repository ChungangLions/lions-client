import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { fetchUserList, filterStudentGroup } from '../services/apis/userListApi';
import { fetchAllGroupProfile, mappedOrg, getGroupLikes } from '../services/apis/groupProfileAPI';

// 학생단체 프로필 목록 가져오기
// const fetchAndMapOrganizations = async () => {
//     try {
//         const listResp = await fetch(`${BASE_URL}/api/profiles/student-groups/`, {
//             method: 'GET',
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json'
//             },
//         });

//         if (!listResp.ok) throw new Error("학생단체 프로필 목록 에러: " + listResp.status);
//         const profiles = await listResp.json();

//         // 가져온 프로필 데이터를 mappedOrgs 형식으로 변환
//         const mappedOrgs = profiles.map(profile => {
//             const startDate = new Date(profile.partnership_start);
//             const endDate = new Date(profile.partnership_end);
//             const periodMonths =
//                 (endDate.getFullYear() - startDate.getFullYear()) * 12 +
//                 (endDate.getMonth() - startDate.getMonth()) + 1;
//             return {
//                 id: profile.id,
//                 university: profile.university_name,
//                 department: profile.department,
//                 council_name: profile.council_name,
//                 student_size: profile.student_size.toLocaleString() + '명',
//                 date: {
//                     start: profile.term_start.slice(0, 7).replace('-', '.'),
//                     end: profile.term_end.slice(0, 7).replace('-', '.')
//                 },
//                 period: periodMonths,
//                 record: profile.partnership_count,
//                 likes: Math.floor(Math.random() * 20), // 더미값
//                 term_start: profile.term_start.slice(0, 10).replace(/-/g, '.'),
//                 term_end: profile.term_end.slice(0, 10).replace(/-/g, '.')
//             };
//         });

//         return mappedOrgs;

//     } catch (err) {
//         console.error("학생 프로필 데이터 불러오기 에러:", err);
//         return []; // 에러 발생 시 빈 배열 반환
//     }
// };

{/* 
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
*/}
const useStudentOrgStore = create(
    persist(
        (set, get) => ({
        originalOrganizations: [], // api 끌어올 때 빈 배열로 만들어주기기
        organizations: [], // api 끌어올 때 빈 배열로 만들어주기기

        // 학생 전체 데이터 불러오기 : orgList
        fetchAndSetOrganizations: async () => {
            try {
                const data = await fetchAllGroupProfile();
                const orgList = data.map(mappedOrg); // profileId 저장
                
                // 각 조직의 좋아요 수를 가져와서 추가
                const orgListWithLikes = await Promise.all(
                    orgList.map(async (org) => {
                        try {
                            const likesData = await getGroupLikes(org.id);
                            return {
                                ...org,
                                likes: likesData.likes_received_count || 0
                            };
                        } catch (error) {
                            console.error(`조직 ${org.id}의 좋아요 수 가져오기 실패:`, error);
                            return {
                                ...org,
                                likes: 0
                            };
                        }
                    })
                );

                console.log("좋아요 수가 추가된 orgList:", orgListWithLikes);
                
                set ({
                    originalOrganizations : orgListWithLikes,
                    organizations: orgListWithLikes,
                });

            } catch (err) {
                console.error("학생단체 데이터 불러오기 실패:", err);
            }
            },

        isFilteredByRecord: false,
        sortKey: null, // 현재 정렬 상태를 저장할 변수 : 정렬 + 필터 위함
        searchQuery: "",

        
        // 정렬 (기본순, 많은 순)
        sortByDesc: (key) => {
            if (key === "" || key === null) {
                // 기본순: 원래 순서로 복원
                const originalList = get().originalOrganizations;
                set({ organizations: originalList, sortKey: null });
            } else {
                // 많은 순 정렬
                const currentList = get().organizations;
                const sortedList = [...currentList].sort((a,b)=> b[key]-a[key]);
                set({ organizations : sortedList, sortKey : key});
            }
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

        // 검색 기능 추가
        setOrgSearchQuery: (query) => {
            const sortKey = get().sortKey;
            const searchList = get().originalOrganizations;
            const raw = (query || "").trim().toLowerCase();
            const tokens = raw.split(/[\s/]+/).filter(Boolean); // 공백 또는 슬래시로 분리

            let next = searchList;
            if (tokens.length > 0) {
                next = searchList.filter((org) => {
                    const hay = `${org.university || "중앙대학교" || ""} ${org.department || ""} ${org.council_name || ""}`
                        .toLowerCase();
                    // 모든 토큰이 포함되면 통과 (AND 매칭)
                    return tokens.every((t) => hay.includes(t));
                });
            }

            if (sortKey) {
                next = [...next].sort((a, b) => (b[sortKey] || 0) - (a[sortKey] || 0));
            }

            set({ organizations: next, searchQuery: query });
        },
    }),
    {
        name: 'organization-storage',
    }
    )
);

export default useStudentOrgStore;