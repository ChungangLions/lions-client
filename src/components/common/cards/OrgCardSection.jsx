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
        <CardGroup>
          <CardContent>
            <UserInfo organization={organization} />
            <DetailInfo cardDetail={cardData} />
            <ButtonWrapper>
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