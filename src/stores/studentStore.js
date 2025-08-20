// loginAPI로 받은 상태 저장 

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchStudentProfile } from '../services/apis/studentProfileApi';

const useStudentStore = create(
    persist(
        (set) => ({
            id: null,
            profileId: null,
            name: null,
            university_name: null,
            image: null,

            setProfileInfo: async (id) => {
                try{
                    const res = await fetchStudentProfile(id);
                    console.log(res);
                set({ 
                    id: res.user,
                    profileId: res.id,
                    name: res.name,
                    university_name: res.university_name,
                    image: res.image,
                });

                return res;

            } catch (error) {
                console.error("프로필 fetch 실패 에러: ", error);
            }
            },
            
            PatchProfileInfo: async (id, body) => {
                try{
                    const res = await fetchStudentProfile(id, body);
                    console.log(res);
                set({ 
                    name: res.name,
                    university_name: res.university_name,
                    image: res.image,
                });

                return res;

            } catch (error) {
                console.error("프로필 수정 실패 에러: ", error);
            }
            },
             
        }),
        { name: 'student-storage',
        }
    )
);

export default useStudentStore;

