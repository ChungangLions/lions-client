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
      <CardGroup onClick = {onClick} $isHome={cardType === 'home'}>
        <CardContent>
          <UserInfo organization={organization} />
          <DetailInfo cardDetail={cardData} />
        </CardContent>
        <ButtonWrapper $isHome={cardType === 'home'}>
            <ButtonComponent 
              width="20px" 
              height="17px" 
              position="relative" 
            />
      </ButtonWrapper>
      </CardGroup>
  )
}

export default OrgCardSection

const CardGroup = styled.div`
  height: 241px;
  display: flex;
  position: relative;
  border: 1px solid #e7e7e7;
  border-radius: 5px;
  width: 100%;
flex-direction: row;
align-items: flex-start;
justify-content: center;
padding: 20px 40px;
box-sizing: border-box;
gap: 24px;
text-align: left;
font-size: 18px;
color: #1a2d06;
font-family: Pretendard;
`;

const CardContent = styled.div`
position: relative;
align-self: stretch;
display: flex;
flex-direction: column;
gap: ${({ $isHome }) => ($isHome ? '24px' : '30px')};
white-space: nowrap;
`;

const ButtonWrapper = styled.div`
position: relative;
top: ${({ $isHome }) => ($isHome ? '0px' : '50%')};
left: ${({ $isHome }) => ($isHome ? '30px' : 'px')};
display: flex;
box-sizing: border-box;
`;
