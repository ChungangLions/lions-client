import React from 'react'
import styled from 'styled-components'
import UserInfo from './UserInfo'
import DetailInfo from './DetailInfo'

const cardDetail =  [
  { label: '소속 학생 수', value: '1,000명' },
  { label: '희망 제휴 기간', value: '2025.08 ~ 2025.10 (3개월)' },
  { label: '제휴 이력', value: '3회' },
  { label: '수신일', value: '2025.08.08'},
  { label: '작성일', value: '2025.08.08'},
]

// 페이지에 따라 카드 내용 필터링 
const CardSection = ({cardId, onClick, cardType, ButtonComponent}) => {

  let cardData = [];
  if (cardType == 'home'){
    cardData = cardDetail.slice(0, 3);
  } else if  (cardType == 'suggest-received') {
    cardData = cardDetail.slice(3, 4);
  } else if (cardType == 'suggest-sent') {
    cardData = cardDetail.slice(4, 5);
  }

  return (
      <CardWrapper onClick = {onClick}>
        <CardGroup>
          <CardContent>
            <UserInfo />
            <DetailInfo cardDetail={cardData} />
            <ButtonWrapper>
              <ButtonComponent />
            </ButtonWrapper>
          </CardContent>
          </CardGroup>
      </CardWrapper>
  )
}

export default CardSection


const CardGroup = styled.div`
margin: 0 !important;
position: absolute;
top: 19.5px;
left: 48px;
display: flex;
flex-direction: row;
align-items: flex-start;
justify-content: flex-start;
gap: 34px;
z-index: 0;
`

const CardWrapper = styled.div`
  top: 0px;
  left: 0px;
  background-color: #c6c6c6;
  width: 447px;
  height: 241px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const CardContent = styled.div`
align-self: stretch;
display: flex;
flex-direction: column;
gap: 16px;
`;

const ButtonWrapper = styled.div`
width: 100%;
position: absolute;
margin: 0 !important;
top: 0px;
left: 333px;
display: flex;
flex-direction: column;
align-items: flex-start;
justify-content: flex-start;
padding: 10px;
box-sizing: border-box;
`;