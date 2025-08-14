import React from 'react'
import styled from 'styled-components'
import UserInfo from './UserInfo'
import DetailInfo from './DetailInfo'
import useStudentOrgStore from '../../../store/studentOrgStore'

const OrgCardSection = ({ onClick, cardType, ButtonComponent, organization}) => {
  let cardData = [];


  if (cardType === 'home') {
    cardData = [
      { label: '소속 학생 수', value: organization.student_num },
      { label: '희망 제휴 기간', value: `${organization.date.start} ~ ${organization.date.end} (${organization.period}개월)` },
      { label: '제휴 이력', value: `${organization.record}회` },
    ];
  } else if (cardType === 'suggest-received') {
    cardData = [
      { label: '수신일', value: organization.receivedDate }
    ];
  } else if (cardType === 'suggest-sent') {
    cardData = [
      { label: '작성일', value: organization.writtenDate }
    ];
  }


  return (
      <CardWrapper onClick = {onClick}>
        <CardGroup $isHome={cardType === 'home'}>
          <CardContent>
            <UserInfo organization={organization} />
            <DetailInfo cardDetail={cardData} />
            <ButtonWrapper $isHome={cardType === 'home'}>
              <ButtonComponent />
            </ButtonWrapper>
          </CardContent>
          </CardGroup>
      </CardWrapper>
  )
}

export default OrgCardSection


const CardGroup = styled.div`
margin: 0 !important;
position: absolute;
top: ${({ $isHome }) => ($isHome ? '19.5px' : '37.5px')};
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
align-items: space-between;
gap: ${({ $isHome }) => ($isHome ? '16px' : '30px')};
`;

const ButtonWrapper = styled.div`
width: 100%;
position: absolute;
margin: 0 !important;
top: ${({ $isHome }) => ($isHome ? '0px' : '50%')};
left: ${({ $isHome }) => ($isHome ? '333px' : '308px')};
display: flex;
flex-direction: column;
align-items: flex-start;
justify-content: flex-start;
padding: 10px;
box-sizing: border-box;
`;