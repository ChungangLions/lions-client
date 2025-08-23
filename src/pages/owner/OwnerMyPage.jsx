// TO DO List
// 1. userType 별로 button 로직 변경 필요 (student, studentOrganization)

import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Link, useLocation, useParams } from 'react-router-dom'
import Menu from '../../layout/Menu';
import MenuItem from '../../components/common/cards/MenuItem'
import ImageSlider from '../../components/common/cards/ImageSlider'
import { getOwnerProfile, getOwnerLikes, getOwnerRecommends, getOwnerPartnershipType } from '../../services/apis/ownerAPI';
import { fetchRecommendations, toggleRecommends } from '../../services/apis/recommendsapi';
import useUserStore from '../../stores/userStore';
import FavoriteBtn from '../../components/common/buttons/FavoriteBtn';
import { LuCalendar } from "react-icons/lu";
import { LuPhone } from "react-icons/lu";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { fetchLikes } from '../../services/apis/likesapi';
import OrgSuggestDealBtn from '../../components/common/buttons/OrgSuggestDealBtn';

// 제휴 제안하기 누르면 profileData state로 넘겨주기

const OwnerMyPage = () => {
  const [profileData, setProfileData] = useState(null);
  const [userLikes, setUserLikes] = useState(0);
  const [userRecommends, setUserRecommends] = useState(0);
  const {userId} = useUserStore();
  const params = useParams();
  const location = useLocation();
  const userType = location.state?.userType || "owner";
  const [isRecommendActive, setIsRecommendActive] = useState(false);
  const [isLikeActive, setIsLikeActive] = useState(false);
  const [userRecord, setUserRecord] = useState(0);
  const [partnershipType, setPartnershipType] = useState([]);

  useEffect(() => {
    if (!userId && !params.id) return; // 둘다 없을 때 무시

    const fetchProfile = async () => { 
      try {
        // 우선순위: 전달 받은 id (params), 그다음 userId
        const ownerId = params.id || userId;
        // console.log('fetching with ownerId:', ownerId);
        const data = await getOwnerProfile(ownerId);
        console.log(data);
        setProfileData(data);

        const likesData = await getOwnerLikes(ownerId);
        // console.log(likesData.likes_received_count);
        setUserLikes(likesData.likes_received_count);

        const recommendsData = await getOwnerRecommends(ownerId);
        // console.log(recommendsData.recommendations_received_count);
        setUserRecommends(recommendsData.recommendations_received_count);

        const send = await getOwnerPartnershipType(ownerId);
        const receive = await getOwnerPartnershipType(ownerId);
        const record = (send || []).filter(p => p.status === "PARTNERSHIP").length + (receive|| []).filter(p => p.status === "PARTNERSHIP").length;
        setPartnershipType(send[0].partnership_type);
        setUserRecord(record);

      } catch (error) {
        console.error("프로필 데이터 조회 실패:", error);
      }
    };
    fetchProfile();
  }, [userId, params.id, isRecommendActive, isLikeActive]); 


  const businessTypeMap = {
  RESTAURANT: '일반 음식점',
  CAFE: '카페',
  BAR: '술집',
  };

  const formattedPhotos = (profileData?.photos || []).map(photo => ({
    id: photo.id,
    image: photo.image, 
  }));


  function BusinessDay({ business_day = {}, title = '영업일 및 시간' }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const DAYS = ['월','화','수','목','금','토','일'];

    // 각 요일별로 한 줄씩 보여주는 구조
    const dayRows = DAYS.map(day => {
      const dayInfo = business_day && business_day[day];
      return (
        // DayItem을 각 요일마다 한 번씩 쓰도록 변경
        <DayItem key={day}>
          <EtcText>
            {day} {dayInfo ? dayInfo.replace('-', ' ~ ') : '휴무'}
          </EtcText>
        </DayItem>
      );
    });

    return (
      <EtcSection>
        <Calendar />
        <DaySection>
          <DayItem>
            <EtcText>{title}</EtcText>
            <EtcSection onClick={() => setIsOpen(prev => !prev)}>
              {isOpen ? <ArrowUp /> : <ArrowDown />}
            </EtcSection>
          </DayItem>
          {/* 각각의 요일이 세로(colum)로 나열되게 DayList에 dayRows로 바로 렌더링 */}
          {isOpen && (
            <DayList>
              {dayRows}
            </DayList>
          )}
        </DaySection>
      </EtcSection>
    );
  }


  const infos = {
    userRecord,
    userLikes,
    userRecommends,
    etc: [`영업일 및 시간 ${profileData?.business_day}`, `${profileData?.contact}`],
    partnershipType
  };



  // 학생 유저 접근 시 기능: 추천하기
  useEffect(() => {
    if (userType === 'student') {
      async function fetchData() {
        const list = await fetchRecommendations('given');
        // 추천한 가게 id 배열 생성
        const recommendedStoreIds = list.map(item => String(item.to_user.id));
        const currentStoreId = params.id;

        // 버튼 활성화 여부 결정
        if (recommendedStoreIds.includes(currentStoreId)) {
          // console.log('true');
          setIsRecommendActive(true);
        } else {
          // console.log('false');
          setIsRecommendActive(false);
        }
      }
      fetchData();
    }
    if (userType === 'studentOrganization') {
      async function fetchData() {
        const list = await fetchLikes('given');
        // 추천한 가게 id 배열 생성
        const likedStoreIds = list.map(item => String(item.target.id));
        const currentStoreId = params.id;

        // 버튼 활성화 여부 결정
        if (likedStoreIds.includes(currentStoreId)) {
          // console.log('true');
          setIsLikeActive(true);
        } else {
          // console.log('false');
          setIsLikeActive(false);
        }
      }
      fetchData();
    }
  }, [userType, params.id]);

    const handleRecommendClick = async (event) => {
      event.stopPropagation();
      setIsRecommendActive(!isRecommendActive);
      try {
        await toggleRecommends(params.id);
      } catch (error) {
        console.error("추천 토글 실패:", error);
        setIsRecommendActive(isRecommendActive);
      }
    };

  return (
    <PageContainer>
      {userType === "owner" && <Menu />}
      {/* 타이틀 + 수정 버튼 section */}
      <TitleContainer>
        <TitleBox>
          <Title>{profileData?.profile_name || ''}</Title>
          <DesBox>
            <Category> {businessTypeMap[profileData?.business_type] || '기타' }</Category>
            <Description> {profileData?.comment} </Description>
          </DesBox>
        </TitleBox>
        <ButtonGroup>
          {userType === "student" ? (
            <StyledBtn style={{ textDecoration: 'none' }} $active={isRecommendActive} onClick={handleRecommendClick}>추천하기</StyledBtn>
          ) : userType === "studentOrganization" ? (
            <>
              <FavoriteBtn
                userId={params.id} 
                isLikeActive={isLikeActive} // 추가!
              />
              <OrgSuggestDealBtn profileData = {profileData}>제휴 제안하기</OrgSuggestDealBtn>
            </>
          ) : (
            <Link to="edit" style={{ textDecoration: 'none' }}>
              <StyledBtn>수정하기</StyledBtn>
            </Link>
          )}
        </ButtonGroup>
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
              <div style={{fontWeight: '600', color: '#70AF19'}}> {infos.userRecord} 회</div>
            </SumBox>
            <SumBox>
              <div>찜 수</div>
              <div style={{fontWeight: '600', color: '#70AF19'}}> {infos.userLikes} 개</div>
            </SumBox>
            <SumBox>
              <div>추천 수</div>
              <div style={{fontWeight: '600', color: '#70AF19'}}> {infos.userRecommends} 개</div>
            </SumBox>
          </SumContainer>
          <FurtherSum>
            <BusinessDay business_day={profileData?.business_day} />
            <EtcSection> <Phone /> {infos.etc[1]} </EtcSection>
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
  border-radius: 5px;
  border: 1px solid #898989;
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
  align-items: flex-start;
  gap: 10px;
  // width: 100%;
`;

const MenuList = styled.div`
  align-items: flex-start;
  align-content: flex-start;
  gap: 10px;
  align-self: stretch;
  flex-wrap: wrap;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  // width: 100%;
`;

const StyledBtn = styled.button`
  display: flex;
  padding: 10px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 5px;
  border: 1px solid #70AF19;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  background: transparent;
  cursor: pointer;

  background-color: ${({ $active }) => ($active ? "#70AF19" : "#FFF")};
  color: ${({ $active }) => ($active ? "#E9F4D0" : "#70AF19")};

  &:hover {
    background-color: ${({ $active }) => ($active ? "#70AF19" : "#E9F4D0")};
    color: ${({ $active }) => ($active ? "#E9F4D0" : "#70AF19")};
`;

const ButtonGroup = styled.div`
  position: absolute;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 15px;
  align-items: center;
`

const Calendar = styled(LuCalendar)`
width: 24px;
height: 24px;
color: #898989;
`;

const Phone = styled(LuPhone)`
width: 24px;
height: 24px;
color: #898989;
`;

const ArrowDown = styled(IoIosArrowDown)`
width: 24px;
height: 24px;
flex-shrink: 0;
color: #898989;
// stroke-width: 2px;
// stroke: var(--, #898989);
// padding: 6px 12px;
`;

const ArrowUp = styled(IoIosArrowUp)`
width: 24px;
height: 24px;
flex-shrink: 0;
color: #898989;
// stroke-width: 2px;
//stroke: var(--, #898989);
// padding: 6px 12px;
`;

const EtcSection = styled.div`
display: flex;
align-items: flex-start;
gap: 10px;
align-self: stretch;
`;

const EtcText = styled.div`
color: #1A2D06;
font-family: Pretendard;
font-size: 16px;
font-style: normal;
font-weight: 400;
line-height: normal;
`;

const DaySection = styled.div`
display: flex;
// width: 123px;
flex-direction: column;
align-items: flex-start;
gap: 4px;
`;

const DayList = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
gap: 6px;
align-self: stretch;
`;

const DayItem = styled.div`
display: flex;
align-items: center;
gap: 6px;
align-self: stretch;
// justify-content: center;
`;
