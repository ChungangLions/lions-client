import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Link, useLocation } from 'react-router-dom'
import Menu from '../../layout/Menu';
import MenuItem from '../../components/common/cards/MenuItem'
import ImageSlider from '../../components/common/cards/ImageSlider'
import { getOwnerProfile } from '../../services/apis/ownerAPI';
import { fetchRecommendations } from '../../services/apis/recommendsapi'
import EditBtn from '../../components/common/buttons/EditBtn';
import useUserStore from '../../stores/userStore';


const OwnerMyPage = () => {
  const [profileData, setProfileData] = useState(null);
  const {userId} = useUserStore();

  useEffect(() => {
    const fetchProfile = async () => { 
      try {
        const ownerId = userId;
        const data = await getOwnerProfile(ownerId);
        console.log(data);
        setProfileData(data);

      } catch (error) {
        console.error("프로필 데이터 조회 실패:", error);
      }
    };
    fetchProfile();
  }, []); 

  const businessTypeMap = {
  RESTAURANT: '일반 음식점',
  CAFE: '카페',
  BAR: '술집',
  };

  const formattedPhotos = (profileData?.photos || []).map(photo => ({
  id: photo.id,
  image: photo.image, 
}));

  const [recommendNum, setRecommendNum] = useState(0);

  useEffect(() => {
    async function load() {
      const data = await fetchRecommendations();
      setRecommendNum(data.length);
    }
    load();
  }, []);

  const infos = {
    partnershipNum: 7,
    likeNum: 46,
    recommendNum,
    etc: ['정문 앞 500m', '매주 일요일 휴무', '단체 이용 가능 (최대 20인)'],
    partnershipType: ['할인형', '타임형'],
  };

  return (
    <PageContainer>
      <Menu />

      {/* 타이틀 + 수정 버튼 section */}
      <TitleContainer>
        <TitleBox>
          <Title>{profileData?.profile_name || ''}</Title>
          <DesBox>
            <Category> {businessTypeMap[profileData?.business_type] || '기타' }</Category>
            <Description> {profileData?.comment} </Description>
          </DesBox>
        </TitleBox>
        <Link to="edit" style={{ textDecoration: 'none' }}>
          <EditButton>수정하기</EditButton>
        </Link>
      </TitleContainer>

      {/* 중간 사진 section */}
      <ImageSlider photos={formattedPhotos|| []} />


      {/* 가게 정보 + 제휴 유형 + 대표 메뉴 section */}
      <ProfileContainer>
        <OwnerInfo>
          <InfoTitle>가게 정보</InfoTitle>
          <SumContainer>
            <SumBox>
              <div>제휴 이력</div>
              <div style={{fontWeight: '600'}}> {infos.partnershipNum} 회</div>
            </SumBox>
            <SumBox>
              <div>찜 수</div>
              <div style={{fontWeight: '600'}}> {infos.likeNum} 개</div>
            </SumBox>
            <SumBox>
              <div>추천 수</div>
              <div style={{fontWeight: '600'}}> {infos.recommendNum} 개</div>
            </SumBox>
          </SumContainer>
          <FurtherSum>
            {infos.etc.map((info, idx) => (
              <div key={idx}> ◻️ {info} </div>
            ))}
          </FurtherSum>

          <InfoTitle> 제휴 유형 </InfoTitle>
            <TypeCardList>
              {infos.partnershipType.map((type, idx) => (
                <TypeCard key={idx}>{type}</TypeCard>
              ))}
            </TypeCardList>
        </OwnerInfo>

        <OwnerMenu>
          <InfoTitle> 대표 메뉴 </InfoTitle>
          <MenuList>
            {profileData?.menus.map(menu => (
              <MenuItem
                key={menu.id}
                image={menu.image} //임의로 fake box 넣어놓음, cards/menuitem에서 수정 필요
                name={menu.name}
                price={menu.price}
              />
            ))}
          </MenuList>
        </OwnerMenu>
      </ProfileContainer>
    </PageContainer>
  )
}

export default OwnerMyPage;

const PageContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content:center;
  margin: 0 auto;
`;

const TitleContainer = styled.div`
width: 100%;
position: relative;
display: flex;
flex-direction: row;
align-items: flex-start;
justify-content: space-between;
gap: 0px;
text-align: left;
font-size: 32px;
color: #64a10f;
font-family: Pretendard;
  padding-top : 35px;
`;

const TitleBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
`;

const Title = styled.div`
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 8px;
color: #64a10f;
`;

const DesBox = styled.div`
  display: flex;
  gap: 10px;
`;

const Category = styled.div `
  font-size: 16px;
  font-weight: 600;
  color: #616161;
`;

const Description = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: #767676;
`;

// const ImageContainer = styled.div `
//   width: 100%;
//   height: 200px;
//   background: #ececec;
//   margin-bottom: 36px;
// `;

const ProfileContainer = styled.div`
  width: 100%;
  display: grid;
  gap: 50px;
  grid-template-columns: 1.4fr 1fr;
`;

const InfoTitle = styled.div`
  font-weight: 600;
  font-size: 20px;
`;

const OwnerInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

// 통계
const SumContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 10px;
  padding: 20px;
  // gap: 150px;
  border: 1px solid #818181;
`;

const SumBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const FurtherSum = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 40px;
  gap: 10px;
`;

// 제휴 유형
const TypeCardList = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 12px;
`;

const TypeCard = styled.div`
  width: 122px;
  height: 122.04px;
  border: 0.46px solid #000000;
  border-radius: 4.55px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 400;
  font-size: 16px;
`;

// 대표 메뉴
const OwnerMenu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  // width: 100%;
`;

const MenuList = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 7.5px;
  // width: 100%;
`;

const EditButton = styled(EditBtn)`
max-width: 76px;
`;