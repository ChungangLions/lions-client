import React, { useState } from 'react'
import styled from 'styled-components'
import UserInfo from './UserInfo'
import DetailInfo from './DetailInfo'
import useStudentOrgStore from '../../../stores/studentOrgStore'
import useUserStore from '../../../stores/userStore'
import { getOwnerProfile } from '../../../services/apis/ownerAPI'

const OrgCardSection = ({ onClick, cardType, ButtonComponent, organization, userId, compact = false}) => {
  let cardData = [];


  if (cardType === 'home' || cardType === 'proposal') {
    cardData = [
      { label: '소속 학생 수', value: organization?.student_size }, // student_size로 바꿔야됨 
      { label: '희망 제휴 기간', value: `${organization?.partnership_start} ~ ${organization?.partnership_end}` },
      { label: '제휴 이력', value: `${organization?.record || 0}회` },
    ];
  } else if (cardType === 'suggest-received') {
    cardData = [
      { label: '수신일', value: organization.receivedDate }
    ];
  } else if (cardType === 'suggest-sent') {
    cardData = [
      { label: '작성일', value: organization?.created_at }
    ];
  }


  const { updateOrganizationLikeState } = useStudentOrgStore();

  const handleToggle = (nextLiked) => {
    if (organization.user) {
      updateOrganizationLikeState(organization.user, nextLiked);
    }
  };

  return (

      <CardGroup onClick={() => onClick && onClick(organization)} $isHome={cardType === 'home'} $compact={compact}>
        <CardContent>
          <UserInfo organization={organization} />
          <DetailInfo cardDetail={cardData} />
        </CardContent>
        {ButtonComponent && (
          <ButtonWrapper $isHome={cardType === 'home'}>
              <ButtonComponent 
                organization={organization}
                isLiked={organization?.is_liked ?? false}
                onToggle={handleToggle}
                userId={organization.id} 
              />
          </ButtonWrapper>
        )}
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
  width: ${props => props.$compact ? '90%' : '100%'};
flex-direction: row;
align-items: flex-start;
justify-content: center;
  padding: 0px 0px;
box-sizing: border-box;
gap: 24px;
text-align: left;
font-size: 18px;
color: #1a2d06;
font-family: Pretendard;
box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.05);
cursor: pointer;

`;

const CardContent = styled.div`
position: relative;
align-self: stretch;
display: flex;
flex-direction: column;
gap: ${({ $isHome }) => ($isHome ? '24px' : '30px')};
white-space: nowrap;
  align-items: center;
  justify-content: center;
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
