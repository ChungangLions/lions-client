import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import OrgCardSection from '../../components/common/cards/OrgCardSection'
import { useNavigate } from 'react-router-dom'
import FavoriteBtn from '../../components/common/buttons/FavoriteBtn'
import useStudentOrgStore from '../../stores/studentOrgStore'
import FilterBtn from '../../components/common/filters/FilterBtn'
import { TbArrowsSort } from "react-icons/tb";
import DropDown from '../../components/common/filters/DropDown'
import useUserStore from '../../stores/userStore'

const OwnerHome = () => {
  const navigate = useNavigate();
  
  const handleCardClick = (organization) => {
    navigate("student-group-profile", { state: { organization } });
  };

  const [isActive, setIsActive] = useState(false);

  const { isLoggedIn } = useUserStore();

  useEffect(() => {
    if (isLoggedIn === false) {
      alert('로그아웃 되었습니다. 다시 로그인 해주세요.');
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // zustand store에서 사용할 것들 가져오기 
    const {
    organizations,
    sortByDesc,
    filterByRecord,
    fetchAndSetOrganizations,
  } = useStudentOrgStore();

  // 학생단체 목록 불러오기
  useEffect(() => {
    fetchAndSetOrganizations();
  }, [fetchAndSetOrganizations]);

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
          <OrgCardSection key={organization.id} onClick = {handleCardClick} cardType={'home'} ButtonComponent = {() => ( <FavoriteBtn/>)} organization={organization} />
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

// 그리드 가로 자동, 세로 자동, 447*3이 최대
const CardListGrid = styled.div`
  width: 100%;
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(447px, 1fr));
  justify-content: start;
  align-content: start;
  column-gap: 20px;
  row-gap: 20px;
  text-align: left;
  font-size: 18px;
  color: #1A2D06;
  font-family: Pretendard;
`;

const OptionWrapper = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
gap: 5px;
`;
