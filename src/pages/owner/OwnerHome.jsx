import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import CardSection from '../../components/common/cards/OrgCardSection'
import { useNavigate } from 'react-router-dom'
import FavoriteBtn from '../../components/common/buttons/FavoriteBtn'
import useStudentOrgStore from '../../stores/studentOrgStore'
import FilterBtn from '../../components/common/buttons/FilterBtn'
import { TbArrowsSort } from "react-icons/tb";
import { IoIosArrowDown } from "react-icons/io";
import useUserStore from '../../stores/userStore'

const OwnerHome = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  }

  const handleCardClick = () => {
    navigate("student-profile");
  };



  // zustand store에서 사용할 것들 가져오기 
  const {
    organizations,
    sortByDesc,
    filterByRecord,
  } = useStudentOrgStore();

  const handleSortChange = (e) => {
    const key = e.target.value 
    sortByDesc(key);
  }

  const handleFilterChange = (e) => {
      filterByRecord();
  }

  

  return (
    <>
      <SelectContainer>
        <SelectWrapper>
        <FilterBtn onClick = {handleFilterChange}>{`제휴 이력`}</FilterBtn>
        <SortSection onChange={handleSortChange}>
          <OptionWrapper>
            <TbArrowsSort />
            <SortOption value="likes">찜 많은 순</SortOption>
            {isDropdownOpen && (
            <DropdownMenu>
                  <DropdownItem value="record">
                    제휴 이력 많은 순
                  </DropdownItem>
              </DropdownMenu>
              )}
          </OptionWrapper>
            <IoIosArrowDown />
        </SortSection>
        </SelectWrapper>
      </SelectContainer>
      <CardListGrid> 
        {organizations.map((organization) => (
          // 여기 detail 들어갈 거 props로 전달 필요 
          <CardSection key={organization.id} onClick = {handleCardClick} cardType={'home'} ButtonComponent = {() => ( <FavoriteBtn/>)} organization={organization} />
        ))}
      </CardListGrid>
    </>
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

  
const SelectContainer = styled.div`
width: 100%;
position: relative;
background-color: #fff;
height: 1183px;
overflow: hidden;
text-align: left;
font-size: 16px;
color: #64a10f;
font-family: Pretendard;
`;

const SelectWrapper = styled.div`
position: absolute;
top: 90px;
left: 30px;
display: flex;
flex-direction: row;
align-items: center;
justify-content: flex-start;
gap: 23px;
`;

const SortSection = styled.select`
display: flex;
flex-direction: row;
align-items: center;
justify-content: flex-start;
`;

const OptionWrapper = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
padding: 10px;
`;

const SortOption = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
padding: 10px;
`;

const DropdownMenu = styled.div`
  position: absolute;
  right: 90px;
  top: 100%;
  z-index: 10;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  min-width: 100px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  margin-top: 5px;
`;

const DropdownItem = styled.div`
  padding: 10px 10px;
  text-align: center;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;