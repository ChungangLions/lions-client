// TO DO LIST
// 1. 추천 누른 가게 프로필 연동 필요
// 2. 추천 목록 fetch 안됨 (콘솔은 뜨는데 화면에 안 나옴)

import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useParams, Link, useNavigate } from 'react-router-dom'
import useStudentStore from '../../stores/studentStore'
import { fetchRecommendations, fetchOwnerProfiles } from '../../services/apis/studentProfileApi'

const StudentMyPage = () => {
  const { id: studentProfileId } = useParams();
  const { name, university_name, image, setProfileInfo } = useStudentStore();
  const [recommendedStores, setRecommendedStores] = useState([]);

  const navigate = useNavigate();
  const handleCardClick = (id) => {
    navigate(`/student/store-profile/${id}`, {
      state: { userType: "student" }
    });
  };

  useEffect(() => {
    if (studentProfileId) {
      setProfileInfo(studentProfileId); // 프로필 정보 fetch해서 store에 업데이트
    }
  }, [studentProfileId, setProfileInfo]);

  useEffect(() => {
    async function fetchData() {
      const recommendations = await fetchRecommendations('given');
      const ownerProfiles = await fetchOwnerProfiles();

    // 1. user별 최신 id만 남기기 (to_user.id 기준)
    const latestByUser = Object.values(
      recommendations.reduce((acc, curr) => {
        const userId = curr.to_user.id;
        if (!acc[userId] || acc[userId].id < curr.id) {
          acc[userId] = curr;
        }
        return acc;
      }, {})
    );
    // console.log(latestByUser);

    // 2. 최신 추천 리스트에서 가게 id만 추출
    const ownerIds = latestByUser
      .filter(r => r.to_user.user_role === "OWNER")
      .map(r => r.to_user.id);
    console.log(ownerIds);

    // 3. 가게 프로필 필터링 및 가공
    const stores = ownerProfiles
      .filter(p => ownerIds.includes(p.user))
      .map(p => ({
        id: p.user,
        name: p.profile_name,
        image: p.photos?.[0]?.image || null,
      }));
  
    console.log(ownerProfiles);
    console.log(stores);
    setRecommendedStores(stores);
    }
    fetchData();
  }, []);

  const navigateToEditMyPage = `/student/mypage/edit`;

  if (!name && !university_name && !image) {
    return <div>로딩 중 또는 학생 정보 없음</div>;
  }

  return (
    <PageContainer>
      <Contents>
        <ProfileContainer>
          <ProfileSection>
            <ProfileImg>
              {image ? (
                <img
                  src={image}
                  alt="profile"
                  style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                />
              ) : null}
            </ProfileImg>
            <Name>{name}</Name>
            <School>{university_name}</School>
          </ProfileSection>
          <StyledLink to={navigateToEditMyPage}>
            <EditButton>수정하기</EditButton>
          </StyledLink>
        </ProfileContainer>
        <RecommendSection>
          <Column />
          <RecommendList>
            <Name>추천 목록</Name>
            {recommendedStores.length === 0 ? (
              <ShopContainer>
                <EmptyNotice>추천한 가게가 없습니다.</EmptyNotice>
              </ShopContainer>
            ) : (
              <ShopList>
                {recommendedStores.map((store) => (
                  <ShopCard 
                    key={store.id}
                    onClick={() => handleCardClick(store.id)} 
                  >
                    <ShopImg src={store.image} alt={store.name} />
                    <ShopName>{store.name}</ShopName>
                  </ShopCard>
                ))}
              </ShopList>
            )}
          </RecommendList>
        </RecommendSection>
      </Contents>
    </PageContainer>
  );
};

export default StudentMyPage;


const PageContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin: 0 auto;
`;

const Contents = styled.div`
    display: flex;
    width: 100%
    justify-content: space-between;
    align-items: center;
    padding: 3% 4%;
    gap: 4%;
`;

const ProfileContainer = styled.div`
    display: flex;
    flex: 1;
    min-width: 363px;
    flex-direction: column;
    align-items: center;
    gap: 48px;
`;

const ProfileSection = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    gap: 30px;
    align-self: stretch;
`;

const RecommendSection = styled.div`
  display: inline-flex;
  flex: 2.5;
  align-items: center;
  gap: 24px;
`;

const Column = styled.div`
  border-left: 1px solid #E7E7E7;
  height: auto; /* or 100%, or 특정 px 값 */
  align-self: stretch; /* 부모 flex height 꽉 차게 */
`;

const RecommendList = styled.div`
  display: flex;
  align-items: flex-start;
  align-content: flex-start;
  gap: 18px 24px;
  align-self: stretch;
  flex-wrap: wrap;
`;

const ProfileImg = styled.div`
  width: 180px;
  height: 180px;
  background: transparent;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Name = styled.div`
    color: #1A2D06;
    text-align: center;
    font-family: Pretendard;
    font-size: 24px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
`;

const School = styled.div`
    color: #1A2D06;
    text-align: center;
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`;

const EditButton = styled.button`
    display: flex;
    width: 219px;
    height: 45px;
    // padding: 13px 81px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 5px;
    border: 1px solid var(--main-main600, #64A10F);
    background: white;
    color: var(--main-main600, #64A10F);
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`;

const ShopContainer = styled.div`
  display: flex;
  width: 100%;
  min-width: 885px;
  min-height: 340px;
  gap: 24px;
`;

const ShopList = styled.div`
  display: grid;
  width: 100%;
  min-width: 885px;
  min-height: 340px;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
`;

const ShopCard = styled.div`
    display: flex;
    width: 203px;
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
    cursor: pointer;
`;

const ShopImg = styled.img`
    height: 137px;
    align-self: stretch;
    background: ${({ src }) =>
      src && src.includes('/default.png') ? '#D9D9D9' : '#fff'};
    border-radius: 5px;
`;

const ShopName = styled.div`
    color: #1A2D06;
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
`;

const EmptyNotice = styled.div`
  width: 100%;
  text-align: center;
  color: #222;
  font-size: 18px;
  font-weight: 400;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 140px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;