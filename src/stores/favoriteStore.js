// 찜 저장 안되는 문제 해결 
import { create } from "zustand";

const useFavoriteStore = create((set) => ({
  favorites: {}, 

  toggleFavorite: (orgId, liked) =>
    set((state) => ({
      favorites: {
        ...state.favorites,
        [orgId]: liked,
      },
    })),
}));

export default useFavoriteStore;
