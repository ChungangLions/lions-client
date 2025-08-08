import React from 'react'
import Header from '../../components/common/layout/Header'
import SearchBar from '../../components/common/filters/SearchBar'
import styled from 'styled-components'
import CardSection from '../../components/common/cards/CardSection'

const OwnerHome = () => {
  const cards = Array.from({ length: 20 }, (_, i) => i + 1); // 임의 카드 개수 지정

  return (
    <PageContainer>
      <Header />
      <ScrollSection>
        <CardListGrid> 
          {cards.map((cardId) => (
            <CardSection key={cardId} />
          ))}
        </CardListGrid>
      </ScrollSection>
    </PageContainer>
  )
}

export default OwnerHome

const PageContainer = styled.div`

`;

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
