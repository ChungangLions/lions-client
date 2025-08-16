import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import CardSection from '../../components/common/cards/OrgCardSection'
import { useNavigate } from 'react-router-dom'
import FavoriteBtn from '../../components/common/buttons/FavoriteBtn'
import useStudentOrgStore from '../../stores/studentOrgStore'
import FilterBtn from '../../components/common/filters/FilterBtn'
import { TbArrowsSort } from "react-icons/tb";
import { IoIosArrowDown } from "react-icons/io";
import useUserStore from '../../stores/userStore'
import DropDown from '../../components/common/filters/DropDown'

const OwnerHome = () => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    navigate("student-profile");
  };

  const [isActive, setIsActive] = useState(false);

  useEffect(()=> {
      const token = localStorage.getItem('access');
      if(token){

      }else{
        alert('로그아웃 되었습니다.다시 로그인 해주세요');
        navigate('/login');}
    },[navigate])

  // zustand store에서 사용할 것들 가져오기 
  const {
    organizations,
    sortByDesc,
    filterByRecord,
  } = useStudentOrgStore();

  const handleFilterChange = (e) => {
      setIsActive(!isActive);
      filterByRecord();
  }
  
  return (
    <PageConatainer>
      <SelectContainer>
        <SelectWrapper>
        <FilterBtn onClick = {handleFilterChange} active={isActive}>{`제휴 이력`}</FilterBtn>
          <OptionWrapper>
            <TbArrowsSort size={30} strokeWidth={1} />
            <DropDown
              options={[
                { value: "likes", label: "찜 많은 순" },
                { value: "record", label: "제휴 이력 많은 순" },
              ]}
              onClick= {(option) => sortByDesc(option.value)}
            />
          </OptionWrapper>
        </SelectWrapper>
      </SelectContainer>
      <CardListGrid> 
        {organizations.map((organization) => (
          // 여기 detail 들어갈 거 props로 전달 필요 
          <CardSection key={organization.id} onClick = {handleCardClick} cardType={'home'} ButtonComponent = {() => ( <FavoriteBtn/>)} organization={organization} />
        ))}
      </CardListGrid>
    </PageConatainer>
  )
}


export default OwnerHome

const PageConatainer = styled.div`
display: flex;
flex-direction: column;
margin: 15px 29px;
gap: 15px;
width: 100%;
position: relative;
justify-content: flex-start; 
min-height: 100vh; /* 화면 높이 채워야 위에서 시작할 수 있구나 .. ㅠ */
`;

const SelectContainer = styled.div`
width: 100%;
text-align: left;
font-size: 16px;
color: #64a10f;
font-family: Pretendard;
`;

const SelectWrapper = styled.div`
position: relative;
width: 100%;
display: flex;
flex-direction: row;
align-items: center;
justify-content: flex-start;
gap: 23px;
text-align: left;
font-size: 16px;
color: #64a10f;
font-family: Pretendard;
`;

// 그리드 가로 3, 세로 자동
const CardListGrid = styled.div`
  width: 100%;
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 447px); 
  justify-content: start;
  align-content: start;
  column-gap: 20px;
  row-gap: 20px;
  text-align: left;
  font-size: 18px;
  color: #1A2D06;
  font-family: Pretendard;
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
gap: 5px;
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