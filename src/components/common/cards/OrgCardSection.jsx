import React from 'react'
import styled from 'styled-components'
import UserInfo from './UserInfo'
import DetailInfo from './DetailInfo'
import useStudentOrgStore from '../../../stores/studentOrgStore'

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
          </CardContent>
            <ButtonWrapper $isHome={cardType === 'home'}>
              <ButtonComponent />
            </ButtonWrapper>
          </CardGroup>
      </CardWrapper>
  )
}

export default OrgCardSection


const CardWrapper = styled.div`
  height: 241px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border: 1px solid #e7e7e7;
`;


const CardGroup = styled.div`
position: absolute;
display: flex;
flex-direction: row;
align-items: flex-start;
justify-content: flex-start;
`;

const CardContent = styled.div`
align-self: stretch;
display: flex;
flex-direction: column;
gap: ${({ $isHome }) => ($isHome ? '24px' : '30px')};
`;

const ButtonWrapper = styled.div`
width: 100%;
position: absolute;
top: ${({ $isHome }) => ($isHome ? '-10px' : '50%')};
left: ${({ $isHome }) => ($isHome ? '343px' : '308px')};
display: flex;
flex-direction: column;
align-items: flex-start;
justify-content: flex-start;
padding: 10px;
`;
