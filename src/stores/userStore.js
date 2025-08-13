import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useuserStore = create(
    persist(
        (set) => ({
            userRole: null, // 사장님, 학생, 학생단체 중 하나 
            isLoggedIn: false,

            login: (role) => {
                set({ userRole: role, isLoggedIn: true });
            },
            logout: () => {
                set({ userRole: null, isLoggedIn: false });
            },
                
        }),
        { name: 'user-storage',
        }
    )
);

export default useuserStore;