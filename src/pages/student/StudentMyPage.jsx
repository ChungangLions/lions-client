// TO DO LIST
// 1. 추천 누른 가게 api 연동 필요

import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useParams, Link } from 'react-router-dom'
import useStudentStore from '../../stores/studentStore'
import { fetchRecommendations, fetchOwnerProfiles } from '../../services/apis/studentProfileApi'

const StudentMyPage = () => {
  const { id: studentProfileId } = useParams();
  const { name, university_name, image, setProfileInfo } = useStudentStore();
  const [recommendedStores, setRecommendedStores] = useState([]);

  useEffect(() => {
    if (studentProfileId) {
      setProfileInfo(studentProfileId); // 프로필 정보 fetch해서 store에 업데이트
    }
  }, [studentProfileId, setProfileInfo]);

  useEffect(() => {
    async function fetchData() {
      const recommendations = await fetchRecommendations('given');
      const ownerProfiles = await fetchOwnerProfiles();
      const ownerIds = recommendations
        .filter(r => r.to_user.user_role === "OWNER")
        .map(r => r.to_user.id);
      const stores = ownerProfiles
        .filter(p => ownerIds.includes(p.user))
        .map(p => ({
          name: p.profile_name,
          image: p.photos?.length > 0 ? p.photos[0].image : null,
        }));
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
                {recommendedStores.map((store, idx) => (
                  <ShopCard key={idx}>
                    <ShopImg src={store.image} alt={store.name} />
                    <ShopName>{store.name}</ShopName>
                  </ShopCard>
                ))}
              </ShopList>
            )}
            {/* <ShopList>
              {[1,2,3,4,5,6].map(idx => (
                <ShopCard key={idx}>
                  <ShopImg />
                  <ShopName>{`가게명${idx}`}</ShopName>
                </ShopCard>
              ))}
            </ShopList> */}
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
  background: #C9C9C9;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Name = styled.div`
    color: #000;
    text-align: center;
    font-family: Pretendard;
    font-size: 24px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
`;

const School = styled.div`
    color: #000;
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
`;

const ShopImg = styled.div`
    height: 137px;
    align-self: stretch;
    background: #D9D9D9;
`;

const ShopName = styled.div`
    color: #000;
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