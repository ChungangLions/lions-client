import React from 'react'
import styled from 'styled-components'
import UserInfo from './UserInfo'
import DetailInfo from './DetailInfo'
import useStudentOrgStore from '../../../stores/studentOrgStore'

const OrgCardSection = ({ onClick, cardType, ButtonComponent, organization}) => {
  let cardData = [];


  if (cardType === 'home') {
    cardData = [
      { label: '소속 학생 수', value: organization.student_size }, // student_size로 바꿔야됨 
      { label: '희망 제휴 기간', value: `${organization.partnership_start} ~ ${organization.partnership_end} (${organization.period}개월)` },
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


  const { updateOrganizationLikeState } = useStudentOrgStore();

  const handleToggle = (nextLiked) => {
    if (organization.user) {
      updateOrganizationLikeState(organization.user, nextLiked);
    }
  };

  return (
      <CardGroup onClick={() => onClick(organization)} $isHome={cardType === 'home'}>
        <CardContent>
          <UserInfo organization={organization} />
          <DetailInfo cardDetail={cardData} />
        </CardContent>
        <ButtonWrapper $isHome={cardType === 'home'}>
            <ButtonComponent 
              organization={organization}
              isLiked={organization?.is_liked ?? false}
              onToggle={handleToggle}
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
box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
cursor: pointer;
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
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;

  @media (max-width: 520px) {
    top: 10px;
    right: 10px;
  }
`;
