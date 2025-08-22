import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import OrgCardSection from '../../components/common/cards/OrgCardSection'
import { useNavigate } from 'react-router-dom'
import SuggestSummaryBox from '../../components/common/cards/SuggestSummaryBox'
import useStudentOrgStore from '../../stores/studentOrgStore'
import Menu from '../../layout/Menu'
import ViewBtn from '../../components/common/buttons/StatusBtn'
import FavoriteBtn from '../../components/common/buttons/FavoriteBtn'
import { fetchUserLikes } from '../../services/apis/likesapi'
import useUserStore from '../../stores/userStore'

const summaryItems = [
    { count: 2, label: '작성 중'},
    { count: 5, label: '열람' },
    { count: 0, label: '미열람' },
    { count: 3, label: '제휴 체결' },
    { count: 1, label: '거절' }
];

const OwnerWishlist = () => {
  const navigate = useNavigate();
  const { userId } = useUserStore();
  const { organizations, fetchAndSetOrganizations } = useStudentOrgStore();

  const handleCardClick = (organization) => {
    navigate("student-group-profile", { state: { organization } });
  };

  // 찜한 목록 가져오기
  useEffect(() => {
    if (userId) {
      fetchAndSetOrganizations();
    }
  }, [userId, fetchAndSetOrganizations]);

  // 찜한 항목들만 필터링
  const likedOrganizations = organizations.filter(org => org.is_liked);

  return (
    <ScrollSection>
      <Menu />
      <SuggestSummaryBox items={summaryItems} />
      {likedOrganizations.length > 0 ? (
        <CardListGrid> 
          {likedOrganizations.map((organization) => (
            <OrgCardSection
              key={organization.id}
              onClick={handleCardClick}
              cardType="home"
              ButtonComponent={FavoriteBtn}
              organization={organization}
            />
          ))}
        </CardListGrid>
      ) : (
        <EmptyText>아직 찜한 단체가 없어요. 마음에 드는 단체를 찾아보세요!</EmptyText>
      )}
    </ScrollSection>
  )
}

export default OwnerWishlist

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
align-items: flex-start;

position: sticky;
top: 0;
// height: 100vh; 
`;

const EmptyText = styled.div`
  text-align: center;
  padding: 40px;
  color: #898989;
  font-size: 16px;
`;
