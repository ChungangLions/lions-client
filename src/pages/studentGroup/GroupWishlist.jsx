import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import GroupCard from '../../components/common/cards/GroupCard'
import { useNavigate } from 'react-router-dom'
import useStudentOrgStore from '../../stores/studentOrgStore'
import MenuGroup from '../../layout/MenuGroup'
import FavoriteBtn from '../../components/common/buttons/FavoriteBtn'
import { fetchLikes, fetchUserLikes } from '../../services/apis/likesapi'
import useUserStore from '../../stores/userStore'
import useVenueStore from '../../stores/venueStore'

const GroupWishlist = () => {
  const navigate = useNavigate();
  const { userId } = useUserStore();
  const { stores, fetchStores } = useVenueStore();

  const handleCardClick = (id) => {
    navigate(`/student-group/store-profile/${id}`, { state: { userType: "studentOrganization" } });
  };

  const [likeStores, setLikeStores] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchStores();
        const list = await fetchLikes('given');
        setLikeStores(list.map(item => item.target.id));
        console.log("좋아요한 가게 리스트:", list);
        console.log("좋아요한 가게 ID배열:", list.map(item => item.target.id));
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 찜한 항목들만 필터링
  const filteredLikeStores = stores.filter(store => likeStores.includes(store.id));
  console.log("filteredLikeStores: ", filteredLikeStores);

  if (loading) {
    return (
      <PageConatainer>
        <ContentContainer>
          <MenuGroup />
          <LoadingContainer>
            <LoadingText>로딩중 ...</LoadingText>
          </LoadingContainer>
        </ContentContainer>
      </PageConatainer>
    );
  }

  return (
    <PageConatainer>
      <ContentContainer>
      <MenuGroup />
          <NumText>총 {filteredLikeStores.length}개</NumText>
          <CardWrapper>
        <CardListGrid> 
          {filteredLikeStores.length === 0 ? (
            <EmptyResultContainer>
              <EmptyResultText>찜한 항목이 없습니다.</EmptyResultText>
            </EmptyResultContainer>
          ) : (
            filteredLikeStores.map((store) => (
               <GroupCard
                 key={store.id}
                 imageUrl={store.photo}
                 onClick={() => handleCardClick(store.id)}
                ButtonComponent={() => (
                    <FavoriteBtn 
                      userId={store.id} 
                      isLikeActive={likeStores.includes(store.id)}
                    />
                  )}
                 store={store}
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
width: 100%;
flex-direction: column;
align-items: flex-start;
gap: 15px;
`;

const CardWrapper = styled.div`
display: flex;
width: 100%;
align-items: center;
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
  grid-template-columns: repeat(4, 1fr);
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

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 200px;
`;

const LoadingText = styled.div`
  font-family: Pretendard;
  font-size: 18px;
  color: #70AF19;
  text-align: center;
  font-weight: 600;
`;