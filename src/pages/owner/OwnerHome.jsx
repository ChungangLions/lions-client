import React from 'react'
import styled from 'styled-components'
import CardSection from '../../components/common/cards/CardSection'
import { useNavigate } from 'react-router-dom'
import FavoriteBtn from '../../components/common/buttons/FavoriteBtn'
import DropDownFilter from '../../components/common/filters/DropDownFilter'
import SortItem from '../../components/common/filters/SortItem'

const OwnerHome = () => {
  const cards = Array.from({ length: 20 }, (_, i) => i + 1); // 임의 카드 개수 지정
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate("student-profile");
  };

 const suggestRecordStyle = {
    borderRadius: '5px',
    border: '1px solid #000',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px',
  };

  return (
    <ScrollSection>
      <FilterSection>
        <SortItem />
        <DropDownFilter listType="orglist" sortType="likes" btnName="찜 많은 순" btnStyle={suggestRecordStyle} />
      </FilterSection>
      <CardListGrid> 
        {cards.map(() => (
          <CardSection onClick = {handleCardClick} cardType={'home'} ButtonComponent ={FavoriteBtn} />
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
 overflow-x: auto;
  scrollbar-width: none;
  `;

const FilterSection = styled.div`
display: flex;
flex-direction: row;
gap: 23px;
width:100%;
`;

