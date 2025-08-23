import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import OrgCardSection from '../../components/common/cards/OrgCardSection'
import { useNavigate } from 'react-router-dom'
import useStudentOrgStore from '../../stores/studentOrgStore'
import Menu from '../../layout/Menu'
import FavoriteBtn from '../../components/common/buttons/FavoriteBtn'
import { fetchLikes, fetchUserLikes } from '../../services/apis/likesapi'
import useUserStore from '../../stores/userStore'
import useVenueStore from '../../stores/venueStore'

const GroupWishlist = () => {
  const navigate = useNavigate();
  const { userId } = useUserStore();
  const { stores, fetchStores } = useVenueStore();

  const handleCardClick = (store) => {
    navigate(`/student_group/store-profile/${store.id}`, { state: { store } });
  };

  const [likeStores, setLikeStores] = useState([]);
  
  useEffect(() => {
    fetchStores();
    const fetchUserLikes = async () => {
      const list = await fetchLikes('given');
      setLikeStores(list.map(item => item.target.id));
      console.log("좋아요한 가게 리스트:", list);
      console.log("좋아요한 가게게 ID배열:", list.map(item => item.target.id));
    };
    fetchUserLikes();
  }, []);

  // 찜한 항목들만 필터링
  const likedStores = stores.filter(store => likeStores.includes(store.user));

  return (
    <PageConatainer>
      <Menu />
      <ContentContainer>
          <NumText>총 {likedStores.length}개</NumText>
        <CardListGrid> 
          {likedStores.map((store) => (
            <OrgCardSection
              key={store.id}
              onClick={handleCardClick}
              cardType={'home'}
              ButtonComponent={() => (
                <FavoriteBtn 
                  userId={store.user} 
                  isLikeActive={likedStores.includes(store.user)} // 추가!
                />
              )}
              store={store}
              userId={userId}
            />
          ))}
        </CardListGrid>
        <EmptyRow />
      </ContentContainer>
    </PageConatainer>
  )
}


export default GroupWishlist

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
width: 1379px;
flex-direction: column;
align-items: flex-start;
gap: 15px;
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