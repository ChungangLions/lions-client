import React from 'react'
import styled from 'styled-components'
import CardSection from '../../components/common/cards/OrgCardSection'
import { useNavigate } from 'react-router-dom'
import FavoriteBtn from '../../components/common/buttons/FavoriteBtn'
import useStudentOrgStore from '../../stores/studentOrgStore'
import FilterBtn from '../../components/common/buttons/FilterBtn'

const OwnerHome = () => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate("student-profile");
  };

  // zustand store에서 사용할 것들 가져오기 
  const {
    organizations,
    sortByLikeAsc,
    sortByRecordAsc,
    filterByRecord,
  } = useStudentOrgStore();

  const handleSortChange = (e) => {
    if (e.target.value === 'likes')
      sortByLikeAsc();
    else if (e.target.value === 'record')
      sortByRecordAsc();
  }

  const handleFilterChange = (e) => {
      filterByRecord();
  }

  return (
    <ScrollSection>
      <SelectContainer>
        <FilterSection>
            <FilterBtn onClick = {handleFilterChange}>제휴 이력</FilterBtn>
        </FilterSection>
        <SortSection onChange={handleSortChange}>
          <option value="likes">찜 많은 순</option>
          <option value="record">제휴 이력 많은 순</option>
        </SortSection>
      </SelectContainer>
      <CardListGrid> 
        {organizations.map((organization) => (
          // 여기 detail 들어갈 거 props로 전달 필요 
          <CardSection key={organization.id} onClick = {handleCardClick} cardType={'home'} ButtonComponent ={FavoriteBtn} organization={organization} />
        ))}
      </CardListGrid>
    </ScrollSection>
  )
}

export default OwnerHome

// 그리드 가로 3, 세로 자동
const CardListGrid = styled.div`
  width: 100%;
  position: relative;
  display: grid;
  grid-template-rows: ;
  grid-template-columns: repeat(3, 447px); 
  justify-content: start;
  align-content: start;
  column-gap: 20px;
  row-gap: 20px;
  text-align: left;
  font-size: 18px;
  color: #000;
  font-family: Pretendard;
`;

const ScrollSection = styled.div`
display: flex;
flex-direction: column;
gap: 15px;
align-items: flex-start;
  `;
  
const SelectContainer = styled.div`
display: flex;
flex-direction: row;
gap : 23px;
`;

const FilterSection = styled.div`
display: flex;
flex-direction: row;
gap: 23px;
width:100%;
`;

const SortSection = styled.select`
border: none;
position: relative;
width: 100%;
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
padding: 10px;
text-align: right;
font-size: 16px;
color: #000;
font-family: Pretendard;
background-color: white;
`;

