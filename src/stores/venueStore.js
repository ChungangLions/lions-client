// setSearchStoreQuery 수정 필요: 에러 해결

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { getOwnerList, getOwnerLikes, getOwnerRecommends, getOwnerPartnershipType } from '../services/apis/ownerAPI';

const originalStores = [
                {
                name: '백소정',
                caption: '돈까스 맛집',
                storeType: 'RESTAURANT', 
                dealType: ['타임형'],
                likes: 100,
                recommendations: 79,
                record: 5,
                },
                {
                name: '대관령',
                caption: '안주가 맛있는 감성 술집',
                storeType: 'BAR',
                dealType: ['서비스 제공형'],
                likes: 50,
                recommendations: 99,
                record: 3,
                },
                {
                name: '오후홍콩',
                caption: '밀크티 맛집',
                storeType: 'CAFE',
                dealType: ['리뷰형'],
                likes: 70,
                record: 7,
                recommendations: 29,
                },
                {
                name: '가',
                caption: '감성 카페',
                storeType: 'CAFE',
                dealType: ['할인형'],
                likes: 20,
                record: 12,
                recommendations: 39,
                },
                {
                name: '나',
                caption: '감성 카페',
                storeType: 'CAFE', 
                dealType: ['리뷰형'],
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

         activeStoreType: [], // 현재 필터 : 음식점, 바, 카페 
         isFilteredByStoreType: false,
         activeDealType: [], // 현재 필터 : 타임형, 서비스 제공형, 리뷰형, 할인형
         isFilteredByDealType: false,
         sortKey: null, // 현재 정렬 상태를 저장할 변수 : 정렬 + 필터 위함


//         fetchStores: async () => {
//         try {
//             const data = await getOwnerList();

//             const latestUserMap = {};
//             data.forEach(item => {
//                 // 아직 user가 없거나, 현재 데이터 id가 더 크면 갱신
//                 if (!latestUserMap[item.user] || item.id > latestUserMap[item.user].id) {
//                   latestUserMap[item.user] = item;
//                 }
//             });
//             const latestData = Object.values(latestUserMap);
//             console.log("사장님 리스트 데이터", latestData);

//             const converted = latestData.map(item => ({
//                 id: item.user,
//                 name: item.profile_name,
//                 caption: item.comment,
//                 storeType: item.business_type,
//                 dealType: item.deal_type || null,
//                 likes: item.likes || null,
//                 recommendations: item.recommendations || null,
//                 record: item.record || null,
//                 // photo: item.photos[0].image || null,
//                 photo: item.photos?.[0]?.image || null,
//                 campus_name : item.campus_name,
//               }));
//           set({
//             originalStores: converted,
//             stores: converted,
//           });

//           console.log(converted);
//           return converted;

//         } catch (err) {
//           console.error('Failed to fetch stores', err);
//         }

         fetchStores: async () => {
          try {
              const data = await getOwnerList();
  
                             const latestUserMap = {};
               
               // 1단계: latestUserMap 생성 (id가 가장 큰 프로필만 선택)
               data.forEach(item => {
                   if (!latestUserMap[item.user] || item.id > latestUserMap[item.user].id) {
                     latestUserMap[item.user] = item;
                   }
               });
               
               // 2단계: likes와 recommendations 데이터를 미리 가져와서 latestUserMap에 추가
               const latestData = Object.values(latestUserMap);
               await Promise.all(
                   latestData.map(async (item) => {
                       try {
                           const likes = await getOwnerLikes(item.user);
                           const recommendations = await getOwnerRecommends(item.user);
                           const sendPartnership = await getOwnerPartnershipType(item.user);
                           const receivedPartnership = await getOwnerPartnershipType(item.user, 'received');
                           console.log("sendPartnership: ", sendPartnership);
                           console.log("receivedPartnership: ", receivedPartnership);

                           // 제휴 이력 계산 로직
                            // 1. 보낸 제휴 중 status가 PARTNERSHIP인 개수
                            const sendPartnershipCount = (sendPartnership || []).filter(p => p.status === "PARTNERSHIP").length;
                            // 2. 받은 제휴 중 status가 PARTNERSHIP인 개수
                            const receivedPartnershipCount = (receivedPartnership || []).filter(p => p.status === "PARTNERSHIP").length;
                            // 3. 총 제휴 이력 (보낸 + 받은)
                            const record = sendPartnershipCount + receivedPartnershipCount;

                            // console.log("제휴 이력 - sendPartnershipCount: ", sendPartnershipCount);
                            // console.log("제휴 이력 - receivedPartnershipCount: ", receivedPartnershipCount);
                            // console.log("제휴 이력 - record: ", record);
                           
                           // latestUserMap에 likes와 recommendations 데이터 추가
                           latestUserMap[item.user] = {
                               ...latestUserMap[item.user],
                               likes: likes.likes_received_count || 0,
                               recommendations: recommendations.recommendations_received_count || 0,
                               partnershipType: sendPartnership && sendPartnership.length > 0 ? sendPartnership[0].partnership_type : null,
                               receivedSuggest: receivedPartnership && receivedPartnership.length > 0 ? receivedPartnership.length : null,
                               record: record,
                           };
                       } catch (error) {
                           console.error(`Failed to fetch likes/recommendations for user ${item.user}:`, error);
                           // 에러가 발생해도 기본값 설정
                           latestUserMap[item.user] = {
                               ...latestUserMap[item.user],
                               likes: 0,
                               recommendations: 0,
                               partnershipType: [],
                               receivedSuggest: 0,
                               record: 0,
                           };
                       }
                   })
               );
               
               console.log("latestUserMap with likes/recommendations: ", latestUserMap);
               const enrichedData = Object.values(latestUserMap);
              //  console.log("사장님 리스트 데이터 (enriched): ", enrichedData);
   
                               // 3단계: enriched 데이터를 사용해서 converted 생성 (API 호출 없이)
                const converted = enrichedData.map((item) => {
                    return {
                        id: item.user,
                        name: item.profile_name,
                        caption: item.comment,
                        storeType: (item.business_type || '').toString().toUpperCase(),
                        likes: item.likes || 0,
                        recommendations: item.recommendations || 0,
                        partnershipType: item.partnershipType || null,
                        receivedSuggest: item.receivedSuggest || 0,
                        record: item.record || 0,
                        photo: item.photos?.[0]?.image || null,
                        campus_name : item.campus_name,
                    };
                });

                // receivedSuggest가 가장 많은 가게들에 isBest: true 설정
                const maxReceivedSuggest = Math.max(...converted.map(store => store.receivedSuggest || 0));
                converted.forEach(store => {
                    store.isBest = (store.receivedSuggest || 0) === maxReceivedSuggest && maxReceivedSuggest > 0;
                });
  
                set({
                   originalStores: converted,
                   stores: converted,
                   activeStoreType: [],
                   activeDealType: [],
                   isFilteredByStoreType: false,
                   isFilteredByDealType: false
               });
  
              console.log("converted: ", converted);
              return converted;
  
          } catch (err) {
              console.error('Failed to fetch stores', err);
          }

      },

        // 찜/추천/제휴 이력 많은 순
        sortByDesc: (key) => {
            // 기본 순 추가
            if (key === "" || key === null) {
                const originalList = get().originalStores;
                set({ stores: originalList, sortKey: null });
            } else {
                // 많은 순 정렬
                const currentList = get().stores;
                const sortedList = [...currentList].sort((a,b)=> b[key]-a[key]);
                set({ stores : sortedList, sortKey : key});
            }
        },


        filterByStoreType: (type) => {
          const allowed = ['RESTAURANT', 'BAR', 'CAFE', 'OTHER'];
          const normalizedType = (type ?? '').toString().toUpperCase();

          // 문자열 -> 배열 변환 방어 및 비정상 상태 복구
          const rawStoreType = get().activeStoreType;
          const currentActiveTypes = Array.isArray(rawStoreType)
            ? rawStoreType
            : (rawStoreType ? [rawStoreType] : []);

          let nextActive = currentActiveTypes.map(t => t && t.toString().toUpperCase());
          nextActive = nextActive.filter(Boolean);

          // 토글 로직 (항상 문자열 요소만 추가/제거)
          if (normalizedType && nextActive.includes(normalizedType)) {
            nextActive = nextActive.filter(t => t !== normalizedType);
          } else if (normalizedType) {
            nextActive = [...nextActive, normalizedType];
          }

          // 허용된 값만 유지 + 중복 제거
          nextActive = Array.from(new Set(nextActive.filter(t => allowed.includes(t))));

          // 두 필터를 모두 적용하여 필터링
          let newList = get().originalStores;
          
          // 1. 업종 필터 적용
          if (nextActive.length > 0) {
            newList = newList.filter(store =>
              nextActive.includes((store.storeType || '').toString().toUpperCase())
            );
          }
          
          // 2. 제휴 유형 필터 적용
          const activeDealTypes = get().activeDealType;
          if (Array.isArray(activeDealTypes) && activeDealTypes.length > 0) {
            newList = newList.filter(store => {
              return store.partnershipType?.some(dealType => 
                activeDealTypes.includes(dealType?.toString())
              );
            });
          }

          const sortKey = get().sortKey;
          if (sortKey) {
            newList = [...newList].sort((a, b) => (b[sortKey] || 0) - (a[sortKey] || 0));
          }

          set({
            stores: newList,
            isFilteredByStoreType: nextActive.length > 0,
            activeStoreType: nextActive
          });
          console.log('activeStoreType:', nextActive);
         },

         filterByDealType: (type) => {
          const allowed = ['타임형', '서비스제공형', '리뷰형', '할인형'];
          const normalizedType = (type ?? '').toString();

          // 문자열 -> 배열 변환 방어 및 비정상 상태 복구
          const rawDealType = get().activeDealType;
          const currentDealTypes = Array.isArray(rawDealType)
            ? rawDealType
            : (rawDealType ? [rawDealType] : []);

          let nextActive = currentDealTypes.map(t => t && t.toString());
          nextActive = nextActive.filter(Boolean);

          // 토글 로직 (항상 문자열 요소만 추가/제거)
          if (normalizedType && nextActive.includes(normalizedType)) {
            nextActive = nextActive.filter(t => t !== normalizedType);
          } else if (normalizedType) {
            nextActive = [...nextActive, normalizedType];
          }

          // 허용된 값만 유지 + 중복 제거
          nextActive = Array.from(new Set(nextActive.filter(t => allowed.includes(t))));

          // 두 필터를 모두 적용하여 필터링
          let newList = get().originalStores;
          
          // 1. 제휴 유형 필터 적용
          if (nextActive.length > 0) {
            newList = newList.filter(store => {
              return store.partnershipType?.some(dealType => 
                nextActive.includes(dealType?.toString())
              );
            });
          }
          
          // 2. 업종 필터 적용
          const activeStoreTypes = get().activeStoreType;
          if (Array.isArray(activeStoreTypes) && activeStoreTypes.length > 0) {
            newList = newList.filter(store =>
              activeStoreTypes.includes((store.storeType || '').toString().toUpperCase())
            );
          }

          console.log("new List: ", newList);

          const sortKey = get().sortKey;
          if (sortKey) {
            newList = [...newList].sort((a, b) => (b[sortKey] || 0) - (a[sortKey] || 0));
          }

          set({
            stores: newList,
            isFilteredByDealType: nextActive.length > 0,
            activeDealType: nextActive
          });
          console.log('activeDealType:', nextActive);
         },

        // filterByDealType: (type) => {
        //     const currentActiveType = get().activeDealType; // 현재 필터 상태 : 'restaurant', 'cafe', 'bar'
        //     const isFiltered = get().isFilteredByDealType; // 현재 필터가 켜져 있는 상태인지 확인 
        //     const sortKey = get().sortKey; // 현재 정렬 상태 가져오기 
            
        //     // 필터가 켜져 있는지 확인 
        //     if (isFiltered){
        //         if (currentActiveType === type){
        //             // 같은 타입이면 필터 해제 
        //             let newList = get().originalStores; // 필터 해제니까 기존 배열 가져오기
        //             if(sortKey != null){
        //                 // 정렬이 설정되어 있는 상태면 정렬 적용
        //                 newList = [...newList].sort((a,b)=> b[sortKey] - a[sortKey]);
        //             }
        //             set({
        //                 stores: newList,
        //                 isFilteredByDealType: false,
        //                 activeDealType: null, // 필터 해제 상태 
        //             });
        //         } else {
        //             // 다른 타입이면 필터 교체
        //             let newList = get().originalStores.filter(store => store.dealType === type); // 다른 필터 적용
        //             if (sortKey != null) { // 정렬이 있다면 정렬 적용
        //                 newList = [...newList].sort((a, b) => b[sortKey] - a[sortKey]);
        //             }
        //             set({
        //                 stores: newList,
        //                 isFilteredByDealType: true,
        //                 activeDealType: type, // 새 필터 타입으로 교체하기
        //             });
                    
        //         }       
        //     } else { // 필터 적용 X 상태면 필터 적용하기 
        //         let newList = get().originalStores.filter(store => store.dealType === type); // 다른 필터 적용
        //         if (sortKey != null) {
        //             newList = [...newList].sort((a, b) => b[sortKey] - a[sortKey]);
        //         }
        //         set({
        //             stores: newList,
        //             isFilteredByDealType: true,
        //             activeDealType: type,
        //         });
        //     }
        // },
        
        // 검색 기능 추가 
        setStoreSearchQuery: (query) => {
            const sortKey = get().sortKey;
            const searchList = get().originalStores;
            const raw = (query || "").trim().toLowerCase();
            const tokens = raw.split(/[\s/]+/).filter(Boolean); // 공백 또는 슬래시로 분리

            let next = searchList;
            if (tokens.length > 0) {
                next = searchList.filter((store) => {
                    const hay = `${store.name || ""}  ${store.storeType || ""}`
                        .toLowerCase();
                    // 모든 토큰이 포함되면 통과 (AND 매칭)
                    return tokens.every((t) => hay.includes(t));
                });
            }

            if (sortKey) {
                next = [...next].sort((a, b) => (b[sortKey] || 0) - (a[sortKey] || 0));
            }

            set({ stores: next, searchQuery: query });
        },

    }),
    {
        name: 'venue-storage',
    }
    )
);

export default useVenueStore;