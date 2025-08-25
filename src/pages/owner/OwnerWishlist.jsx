import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import OrgCardSection from '../../components/common/cards/OrgCardSection'
import { useNavigate } from 'react-router-dom'
import SuggestSummaryBox from '../../components/common/cards/SuggestSummaryBox'
import useStudentOrgStore from '../../stores/studentOrgStore'
import Menu from '../../layout/Menu'
import ViewBtn from '../../components/common/buttons/StatusBtn'
import FavoriteBtn from '../../components/common/buttons/FavoriteBtn'
import { fetchLikes, fetchUserLikes } from '../../services/apis/likesapi'
import useUserStore from '../../stores/userStore'

const OwnerWishlist = () => {
  const navigate = useNavigate();
  const { userId } = useUserStore();
  const { organizations, fetchAndSetOrganizations } = useStudentOrgStore();
  const userType = "owner";

  const handleCardClick = (organization) => {
    navigate(`/owner/mypage/wishlist/student-group-profile/${organization.id}`, { state: { organization, userType }});
  };

  console.log("userType", userType);

  const [likeStores, setLikeStores] = useState([]);
  
  useEffect(() => {
    fetchAndSetOrganizations();
    const fetchUserLikes = async () => {
      const list = await fetchLikes('given');
      setLikeStores(list.map(item => item.target.id));
      console.log("좋아요한 학생회 리스트:", list);
      console.log("좋아요한 학생회 ID배열:", list.map(item => item.target.id));
    };
    fetchUserLikes();
  }, []);

  // 찜한 항목들만 필터링
  const likedOrganizations = organizations.filter(org => likeStores.includes(org.user));

  return (
    <PageConatainer>
      <Menu />
      <ContentContainer>
          <NumText>총 {likedOrganizations.length}개</NumText>
          <CardWrapper>
        <CardListGrid> 
          {likedOrganizations.length === 0 ? (
            <EmptyResultContainer>
              <EmptyResultText>찜한 항목이 없습니다.</EmptyResultText>
            </EmptyResultContainer>
          ) : (
            likedOrganizations.map((organization) => (
              <OrgCardSection
                key={organization.id}
                onClick={handleCardClick}
                cardType={'home'}
                ButtonComponent={() => (
                  <FavoriteBtn 
                    userId={organization.user} 
                    isLikeActive={likeStores.includes(organization.user)} // 추가!
                  />
                )}
                organization={organization}
                userId={userId}
              />
            ))
          )}
        </CardListGrid>
          </CardWrapper>
        <EmptyRow />
      </ContentContainer>
    </PageConatainer>
  )
}


export default OwnerWishlist

const PageConatainer = styled.div`
display: flex;
flex-direction: column;
gap: 15px;
width: 100%;
position: relative;
justify-content: flex-start; 
min-height: 100vh; /* 화면 높이 채워야 위에서 시작할 수 있구나 .. ㅠ */
`;

const ContentContainer = styled.div`
display: flex;
width: 100%;
flex-direction: column;
align-items: flex-start;
gap: 15px;
padding: 0 40px;
`;

const NumText = styled.div`
font-family: Pretendard;
font-weight: 400;
font-style: Regular;
font-size: 20px;
leading-trim: NONE;
line-height: 100%;
letter-spacing: 0%;
`;

const CardWrapper = styled.div`
display: flex;
width: 100%;
align-items: center;
`;

const CardListGrid = styled.div`
  width: 100%;
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-content: start;
  align-content: start;
  column-gap: 20px;
  row-gap: 20px;
  text-align: left;
  font-size: 18px;
  color: #1A2D06;
  font-family: Pretendard;
`;

const OptionWrapper = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
gap: 5px;
`;

const TypeWrapper = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
padding: 10px 0px;
gap: 10px;
min-width: 28px;
max-width: 60px;
`;

const EmptyRow = styled.div` // 여백 주기 위한 임시방편
display: flex;
height: 50px;
`;

const EmptyResultContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 200px;
  grid-column: 1 / -1;
`;

const EmptyResultText = styled.div`
  font-family: Pretendard;
  font-size: 18px;
  color: #898989;
  text-align: center;
`;