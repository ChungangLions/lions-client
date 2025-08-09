import React from 'react'
import Header from '../../components/common/layout/Header'
import SearchBar from '../../components/common/filters/SearchBar'
import styled from 'styled-components'
import CardSection from '../../components/common/cards/CardSection'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../../components/common/layout/MainLayout'

const OwnerHome = () => {
  const cards = Array.from({ length: 20 }, (_, i) => i + 1); // 임의 카드 개수 지정
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate("proposal");
  };

  return (
    <ScrollSection>
      <CardListGrid> 
        {cards.map((cardId) => (
          <CardSection key={cardId} onClick = {handleCardClick} />
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
 overflow-x: auto;
  padding: 20px;
  scrollbar-width: none;
  `;
