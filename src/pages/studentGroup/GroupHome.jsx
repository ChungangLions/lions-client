import React, { useEffect, useState } from 'react'
import GroupCard from '../../components/common/cards/GroupCard';
import styled from 'styled-components';
import useVenueStore from '../../stores/venueStore';
import { useNavigate } from 'react-router-dom';
import FilterBtn from '../../components/common/filters/FilterBtn';
import FavoriteBtn from '../../components/common/buttons/FavoriteBtn';
import { TbArrowsSort } from "react-icons/tb";
import DropDown from '../../components/common/filters/DropDown';
import { fetchLikes } from '../../services/apis/likesapi';
import { getOwnerLikes } from '../../services/apis/ownerAPI';
import { HiDotsHorizontal } from "react-icons/hi";

const GroupHome = () => {
  const [likeStores, setLikeStores] = useState([]);
  const [storeLikeCounts, setStoreLikeCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const handleCardClick = (id) => {
    navigate(`/student-group/store-profile/${id}`, {
      state: { userType: "studentOrganization" }
    });
  };

  // 찜 상태 변경 시 호출되는 콜백
  const handleLikeChange = async (storeId, isLiked) => {
    try {
      // 찜한 가게 목록 업데이트
      if (isLiked) {
        setLikeStores(prev => [...prev, storeId]);
      } else {
        setLikeStores(prev => prev.filter(id => id !== storeId));
      }
      
      // 해당 가게의 찜 수 업데이트
      const likesData = await getOwnerLikes(storeId);
      const newCount = likesData.likes_received_count || 0;
      
      setStoreLikeCounts(prev => ({
        ...prev,
        [storeId]: newCount
      }));
    } catch (error) {
      console.error("찜 수 업데이트 실패:", error);
    }
  };

  // zustand store에서 사용할 것들 가져오기 
  const {
    fetchStores,
    stores,
    sortByDesc,
    filterByStoreType,
    filterByDealType,
    activeStoreType,
    activeDealType,
  } = useVenueStore();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchStores();
        const list = await fetchLikes('given');
        setLikeStores(list.map(item => item.target.id));
        // console.log("좋아요한 가게 리스트:", list);
        console.log("좋아요한 가게 ID배열:", list.map(item => item.target.id));
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log("likeStores 내 데이터 출력:", likeStores);
  }, [likeStores]);

  const handleSortChange = (e) => {
    const key = e.target.value 
    sortByDesc(key);
  }

  const handleStoreFilterChange = (e) => {
      filterByStoreType();
  }

  const handleDealFilterChange = (e) => {
      filterByDealType();
  }

  if (loading) {
    return (
      <PageContainer>
        <LoadingContainer>
          <LoadingText>로딩중 ...</LoadingText>
        </LoadingContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <SelectContainer>
        <FilterSection>
          <TypeWrapper>업종</TypeWrapper>
          <FilterWrapper>
            <FilterBtn
            onClick={() => filterByStoreType('RESTAURANT')}
            active={Array.isArray(activeStoreType) && activeStoreType.includes('RESTAURANT')}
            >
            🍚 일반 음식점
            </FilterBtn>
            <FilterBtn
            onClick={() => filterByStoreType('BAR')}
            active={Array.isArray(activeStoreType) && activeStoreType.includes('BAR')}
            >
            🍺 주점
            </FilterBtn>
            <FilterBtn
            onClick={() => filterByStoreType('CAFE')}
            active={Array.isArray(activeStoreType) && activeStoreType.includes('CAFE')}
            >
            ☕️ 카페 및 디저트
            </FilterBtn>
            <FilterBtn
            onClick={() => filterByStoreType('OTHER')}
            active={Array.isArray(activeStoreType) && activeStoreType.includes('OTHER')}
            >
            <OptionWrapper><HiDotsHorizontal />기타</OptionWrapper>
            </FilterBtn>
          </FilterWrapper>
        </FilterSection>
        <FilterSection>
        <TypeWrapper>제휴 유형</TypeWrapper>
          <FilterWrapper>
            <FilterBtn
            onClick={() => filterByDealType('타임형')}
            active={Array.isArray(activeDealType) && activeDealType.includes('타임형')}
            >
            타임형
            </FilterBtn>
            <FilterBtn
            onClick={() => filterByDealType('서비스제공형')}
            active={Array.isArray(activeDealType) && activeDealType.includes('서비스제공형')}
            >
            서비스 제공형
            </FilterBtn>
            <FilterBtn
            onClick={() => filterByDealType('리뷰형')}
            active={Array.isArray(activeDealType) && activeDealType.includes('리뷰형')}
            >
            리뷰형
            </FilterBtn>
            <FilterBtn
            onClick={() => filterByDealType('할인형')}
            active={Array.isArray(activeDealType) && activeDealType.includes('할인형')}
            >
            할인형
            </FilterBtn>
          </FilterWrapper>
        </FilterSection>
        <OptionWrapper>
          <TypeWrapper>정렬</TypeWrapper>
            <TbArrowsSort size={30} strokeWidth={1} stroke={'#70AF19'} />
            <DropDown
              options={[
                { value: "", label: "기본 순" },
                { value: "likes", label: "찜 많은 순" },
                { value: "record", label: "제휴 이력 많은 순" },
                { value: "recommendations", label: "추천 많은 순" },
              ]}
              onClick= {(option) => sortByDesc(option.value)}
            />
          </OptionWrapper>
        {/* <SortSection onChange={handleSortChange}>
          <option value="likes">찜 많은 순</option>
          <option value="record">제휴 이력 많은 순</option>
          <option value="recommendations">추천 많은 순</option>
        </SortSection> */}
      </SelectContainer>
      <GridContainer>
        {stores.length === 0 ? (
          <EmptyResultContainer>
            <EmptyResultText>검색 결과가 없습니다.</EmptyResultText>
          </EmptyResultContainer>
        ) : (
          stores.map((store) => (
            <GroupCard 
              key={store.id}
              imageUrl={store.photo}
              onClick={() => handleCardClick(store.id)}
              isBest={store.isBest}
              likeCount={storeLikeCounts[store.id] || store.likes || 0}
              ButtonComponent={() => (
                <FavoriteBtn 
                  userId={store.id} 
                  isLikeActive={likeStores.includes(store.id)}
                  onLikeChange={handleLikeChange}
                />
              )}
              store={store} />
          ))
        )}
      </GridContainer>
      <EmptyRow />
    </PageContainer>
  )
}

export default GroupHome;

const PageContainer = styled.div `
  width: 100%;
  position: sticky;
  top: 0;
  height: 100vh;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 15px; // 필터 ~ container 사이 여백 (필터 아직 구현 X)
  
  /* 그리드 아이템들이 동일한 크기를 가지도록 설정 */
  & > * {
    width: 100%;
    min-width: 0; /* 그리드 아이템이 부모 컨테이너를 넘어가지 않도록 */
  }
`;

const SelectContainer = styled.div`
position: relative;
width: 100%;
display: flex;
flex-direction: row;
align-items: center;
justify-content: flex-start;
gap: 40px;
text-align: left;
font-size: 16px;
color: #aeaeae;
font-family: Pretendard;
`;

const FilterSection = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: flex-start;
gap: 10px;
`;

const SortSection = styled.select`
border: none;
position: relative;
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
text-align: left;
font-size: 16px;
color: #1A2D06;
font-family: Pretendard;
background-color: white;
`;

const TypeWrapper = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
padding: 10px 0px;
gap: 10px;
min-width: 40px;
max-width: 90px;
`;

const FilterWrapper =styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: flex-start;
gap: 10px;
color: #64a10f;
`;

const OptionWrapper = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
gap: 5px;
`;

const EmptyRow = styled.div` // 여백 주기 위한 임시방편
display: flex;
height: 50px;
`;

const EmptyResultContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 200px;
  grid-column: 1 / -1;
`;

const EmptyResultText = styled.div`
  font-family: Pretendard;
  font-size: 18px;
  color: #898989;
  text-align: center;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 200px;
`;

const LoadingText = styled.div`
  font-family: Pretendard;
  font-size: 18px;
  color: #70AF19;
  text-align: center;
  font-weight: 600;
`;