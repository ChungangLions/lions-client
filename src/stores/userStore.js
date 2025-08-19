// loginAPI로 받은 상태 저장 

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login } from '../services/apis/auth';

const useUserStore = create(
    persist(
        (set) => ({
            userRole: null, // 사장님, 학생, 학생단체 중 하나 
            username: null,
            isLoggedIn: false,
            accessToken : null,
            refreshToken : null,
            userId : null,

            setLoginStatus: async (username, password) => {
                try{
                    const res = await login(username, password);
                set({ 
                    userRole: res.user_role , 
                    username: res.username,
                    isLoggedIn: true, 
                    accessToken: res.access, 
                    refreshToken: res.refresh,
                    userId: res.id,
                });

                localStorage.setItem('accessToken', res.access);
                localStorage.setItem('refreshToken', res.refresh);

                console.log('localStorage accessToken:', localStorage.getItem('accessToken')); // 바로 확인!

                return res;
            } catch (error) {
                console.error("로그인 실패 에러: ", error);
            }
            },
            setLogoutStatus: () => {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                
                set({
                    userRole : null,
                    username: null,
                    userId: null,
                    isLoggedIn: false,
                    accessToken: null,
                    refreshToken: null,
                });
            },
             
        }),
        { name: 'user-storage',
        }
    )
);

export default useUserStore;