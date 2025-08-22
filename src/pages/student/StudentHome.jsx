// TO DO LIST
// 1. store list fetch -> 홈에 정보 로드하기 (V)
// 2. store 클릭했을 때 profile 연결하기 (더 받아와야할 데이터: likes, recommendations, records)
// 3. profile에서 store 상세 프로필 fetch (V)

import React, { useEffect, useState } from 'react'
import GroupCard from '../../components/common/cards/GroupCard';
import styled from 'styled-components';
import useVenueStore from '../../stores/venueStore';
import { useNavigate } from 'react-router-dom';
import FilterBtn from '../../components/common/filters/FilterBtn';
import RecommendBtn from '../../components/common/buttons/RecommendBtn';
import { fetchRecommendations } from '../../services/apis/recommendsapi';
import { TbArrowsSort } from "react-icons/tb";
import DropDown from '../../components/common/filters/DropDown';

const StudentHome = () => {
  const [recommendedStores, setRecommendedStores] = useState([]);
  const navigate = useNavigate();
  const handleCardClick = (id) => {
    navigate(`/student/store-profile/${id}`, {
      state: { userType: "student" }
    });
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
    fetchStores();
    const fetchUserRecommendations = async () => {
      const list = await fetchRecommendations('given');
      setRecommendedStores(list.map(item => item.to_user.id));
      console.log("추천한 가게 리스트:", list);
      console.log("추천한 가게 ID배열:", list.map(item => item.to_user.id));
    };
    fetchUserRecommendations();
  }, []);

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
          onClick={() => filterByStoreType('ETC')}
          active={Array.isArray(activeStoreType) && activeStoreType.includes('ETC')}
          >
          ...
          </FilterBtn>
          </FilterWrapper>
        </FilterSection>
    {/* <FilterSection>
          <TypeWrapper>제휴 유형</TypeWrapper>
          <FilterWrapper>
            <FilterBtn
            onClick={() => filterByStoreType('RESTAURANT')}
            active={Array.isArray(activeStoreType) && activeStoreType.includes('CAFE')}
            >
            타임형
            </FilterBtn>
            <FilterBtn
            onClick={() => filterByStoreType('BAR')}
            active={Array.isArray(activeStoreType) && activeStoreType.includes('CAFE')}
            >
            서비스 제공형
            </FilterBtn>
            <FilterBtn
            onClick={() => filterByStoreType('CAFE')}
            active={Array.isArray(activeStoreType) && activeStoreType.includes('CAFE')}
            >
            리뷰형
            </FilterBtn>
            <FilterBtn
            onClick={() => filterByStoreType('CAFE')}
            active={Array.isArray(activeStoreType) && activeStoreType.includes('CAFE')}
            >
            할인형
            </FilterBtn>
          </FilterWrapper>
        </FilterSection> */}
        <OptionWrapper>
          <TypeWrapper>정렬</TypeWrapper>
            <TbArrowsSort size={30} strokeWidth={1} stroke={'#70AF19'} />
            <DropDown
              options={[
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
        {stores.map((store) => (
          <GroupCard 
            key={store.id}
            imageUrl={store.photo}
            onClick={() => handleCardClick(store.id)}
            likes={false}
            ButtonComponent={() => (
              <RecommendBtn 
                userId={store.id} 
                isRecommendActive={recommendedStores.includes(store.id)} // 추가!
              />
            )}
            store={store} />
        ))}
      </GridContainer>
    </PageContainer>
  )
}

export default StudentHome;

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
color: #000;
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
min-width: 28px;
max-width: 60px;
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