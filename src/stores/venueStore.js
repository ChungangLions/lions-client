import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { getOwnerList } from '../services/apis/ownerAPI';

const originalStores = [
                {
                name: '백소정',
                caption: '돈까스 맛집',
                storeType: 'restaurant', 
                dealType: 'time',
                likes: 100,
                recommendations: 79,
                record: 5,
                },
                {
                name: '대관령',
                caption: '안주가 맛있는 감성 술집',
                storeType: 'bar',
                dealType: 'service',
                likes: 50,
                recommendations: 99,
                record: 3,
                },
                {
                name: '오후홍콩',
                caption: '밀크티 맛집',
                storeType: 'cafe',
                dealType: 'review',
                likes: 70,
                record: 7,
                recommendations: 29,
                },
                {
                name: '가',
                caption: '감성 카페',
                storeType: 'cafe',
                dealType: 'sale',
                likes: 20,
                record: 12,
                recommendations: 39,
                },
                {
                name: '나',
                caption: '감성 카페',
                storeType: 'cafe', 
                dealType: 'review',
                likes: 30,
                recommendations: 49,
                record: 8,
                }
            ];
const useVenueStore = create(
    persist(
        (set, get) => ({
        originalStores: originalStores,
        stores: [],

        activeStoreType: null, // 현재 필터 : 음식점, 바, 카페 
        isFilteredByStoreType: false,
        activeDealType: null,
        isFilteredByDealType: false,
        sortKey: null, // 현재 정렬 상태를 저장할 변수 : 정렬 + 필터 위함

        fetchStores: async () => {
        try {
            const data = await getOwnerList();

            const latestUserMap = {};
            data.forEach(item => {
                // 아직 user가 없거나, 현재 데이터 id가 더 크면 갱신
                if (!latestUserMap[item.user] || item.id > latestUserMap[item.user].id) {
                  latestUserMap[item.user] = item;
                }
            });
            const latestData = Object.values(latestUserMap);
            console.log("사장님 리스트 데이터", latestData);

            const converted = latestData.map(item => ({
                id: item.user,
                name: item.profile_name,
                caption: item.comment,
                storeType: item.business_type,
                dealType: item.deal_type || null,
                likes: item.likes || null,
                recommendations: item.recommendations || null,
                record: item.record || null,
                // photo: item.photos[0].image || null,
                photo: item.photos?.[0]?.image || null
              }));
          set({
            originalStores: converted,
            stores: converted,
          });

          console.log(converted);
          return converted;

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


        filterByStoreType: (type) => {
            const currentActiveType = get().activeStoreType; // 현재 필터 상태 : 'restaurant', 'cafe', 'bar'
            const isFiltered = get().isFilteredByStoreType; // 현재 필터가 켜져 있는 상태인지 확인 
            const sortKey = get().sortKey; // 현재 정렬 상태 가져오기 
            
            // 필터가 켜져 있는지 확인 
            if (isFiltered){
                if (currentActiveType === type){
                    // 같은 타입이면 필터 해제 
                    let newList = get().originalStores; // 필터 해제니까 기존 배열 가져오기
                    if(sortKey != null){
                        // 정렬이 설정되어 있는 상태면 정렬 적용
                        newList = [...newList].sort((a,b)=> b[sortKey] - a[sortKey]);
                    }
                    set({
                        stores: newList,
                        isFilteredByStoreType: false,
                        activeStoreType: null, // 필터 해제 상태 
                    });
                } else {
                    // 다른 타입이면 필터 교체
                    let newList = get().originalStores.filter(store => store.storeType === type); // 다른 필터 적용
                    if (sortKey != null) { // 정렬이 있다면 정렬 적용
                        newList = [...newList].sort((a, b) => b[sortKey] - a[sortKey]);
                    }
                    set({
                        stores: newList,
                        isFilteredByStoreType: true,
                        activeStoreType: type, // 새 필터 타입으로 교체하기
                    });
                    
                }       
            } else { // 필터 적용 X 상태면 필터 적용하기 
                let newList = get().originalStores.filter(store => store.storeType === type); // 다른 필터 적용
                if (sortKey != null) {
                    newList = [...newList].sort((a, b) => b[sortKey] - a[sortKey]);
                }
                set({
                    stores: newList,
                    isFilteredByStoreType: true,
                    activeStoreType: type,
                });
            }
        },

        filterByDealType: (type) => {
            const currentActiveType = get().activeDealType; // 현재 필터 상태 : 'restaurant', 'cafe', 'bar'
            const isFiltered = get().isFilteredByDealType; // 현재 필터가 켜져 있는 상태인지 확인 
            const sortKey = get().sortKey; // 현재 정렬 상태 가져오기 
            
            // 필터가 켜져 있는지 확인 
            if (isFiltered){
                if (currentActiveType === type){
                    // 같은 타입이면 필터 해제 
                    let newList = get().originalStores; // 필터 해제니까 기존 배열 가져오기
                    if(sortKey != null){
                        // 정렬이 설정되어 있는 상태면 정렬 적용
                        newList = [...newList].sort((a,b)=> b[sortKey] - a[sortKey]);
                    }
                    set({
                        stores: newList,
                        isFilteredByDealType: false,
                        activeDealType: null, // 필터 해제 상태 
                    });
                } else {
                    // 다른 타입이면 필터 교체
                    let newList = get().originalStores.filter(store => store.dealType === type); // 다른 필터 적용
                    if (sortKey != null) { // 정렬이 있다면 정렬 적용
                        newList = [...newList].sort((a, b) => b[sortKey] - a[sortKey]);
                    }
                    set({
                        stores: newList,
                        isFilteredByDealType: true,
                        activeDealType: type, // 새 필터 타입으로 교체하기
                    });
                    
                }       
            } else { // 필터 적용 X 상태면 필터 적용하기 
                let newList = get().originalStores.filter(store => store.dealType === type); // 다른 필터 적용
                if (sortKey != null) {
                    newList = [...newList].sort((a, b) => b[sortKey] - a[sortKey]);
                }
                set({
                    stores: newList,
                    isFilteredByDealType: true,
                    activeDealType: type,
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