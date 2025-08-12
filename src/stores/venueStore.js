// 가게 관리용 
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const venueStore = create(
    persist(
        (set) => ({
            stores: [
                {
                name: '백소정',
                storeType: 'restaurant', 
                dealType: 'time',
                likes: 100,
                recommendations: 79,
                record: 5,
                },
                {
                name: '대관령',
                storeType: 'bar',
                dealType: 'service',
                likes: 50,
                recommendations: 99,
                record: 3,
                },
                {
                name: '오후홍콩',
                storeType: 'cafe',
                dealType: 'review',
                likes: 70,
                record: 7,
                recommendations: 29,
                },
                {
                name: '가',
                storeType: 'cafe',
                dealType: 'sale',
                likes: 20,
                record: 12,
                recommendations: 39,
                },
                {
                name: '나',
                storeType: 'cafe',
                dealType: 'review',
                likes: 30,
                recommendations: 49,
                record: 8,
                }
            ],

            // 찜 많은 순
            sortByLikesAsc: () => {
                set((state) => ({           
                    stores : [...state.stores].sort((a,b) => a.likes - b.likes),
                }));
            },

            // 제휴 이력 많은 순
            sortByRecordAsc: () => {
                set((state) => ({
                    stores: [...state.stores].sort((a,b) => a.record- b.record),
                }));
            },

            // 추천 많은 순
            sortByRecommendAsc: () => {
                set((state) => ({
                    stores: [...state.stores].sort((a,b) => a.recommendations - b.recommendations),
                }));
            },

            // 가게 업종 필터링
            filterByStoreType : (type) => {
                set((state) => ({
                    stores : state.stores.filter(store => store.storeType === type),
                }))
            },

            // 제휴 유형 필터링
            filterByDealType : (type) => {
                set((state) => ({
                    stores : state.stores.filter(store => store.dealType === type),
                }))
            },



        })
    )
)