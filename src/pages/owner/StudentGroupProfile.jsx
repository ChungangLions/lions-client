import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import ProfileImg from '../../components/common/cards/ProfileImg'
import FavoriteBtn from '../../components/common/buttons/FavoriteBtn'
import { Link, useLocation, useParams } from 'react-router-dom'
import SuggestDealBtn from '../../components/common/buttons/SuggestDealBtn'
import DealHistoryCard from '../../components/common/cards/GroupProfile/DealHistoryCard'
import DetailCard from '../../components/common/cards/GroupProfile/DetailCard'
import useGroupProfile from '../../hooks/useOrgProfile'
import useUserStore from '../../stores/userStore'
import { fetchGroupProfile } from '../../services/apis/groupProfileAPI'
import { fetchLikes } from '../../services/apis/likesapi'

const StudentGroupProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const {userId} = useUserStore(); // 
  const location = useLocation();
  const userType = location.state?.userType || "student_group";
  const [isLikeActive, setIsLikeActive] = useState(false);
  const { organization } = location.state || {};
  console.log(location.state);


  const groupId = organization?.user || userId


  console.log("로그인 유저",userId);

  const { studentSize, groupDepartment, groupName, groupImage, partnershipEnd, partnershipStart, termEnd, termStart, partnershipCount, contact, university} = useGroupProfile(groupId);


  const detailCards = [
        { title: '임기', content: `${termStart} ~ ${termEnd}` }, 
        { title: '인원수', content: `${studentSize}명`},
        { title: '희망 제휴 기간', content: `${partnershipStart} ~ ${partnershipEnd}`},
    ];

    // api 연결 필요
    const dealHistories = [
        { storeName: '가게명', period: '20nn.nn.nn~20nn.nn.nn' },
        { storeName: '가게명', period: '20nn.nn.nn~20nn.nn.nn' },
        { storeName: '가게명', period: '20nn.nn.nn~20nn.nn.nn' },
    ];
  
    //console.log(organization);

  useEffect(() => {
    async function fetchData() {
      const list = await fetchLikes('given');
      // 추천한 가게 id 배열 생성
      const likedStoreIds = list.map(item => String(item.target.id));

      // 버튼 활성화 여부 결정
      if (likedStoreIds.includes(groupId)) {
        // console.log('true');
        setIsLikeActive(true);
      } else {
        // console.log('false');
        setIsLikeActive(false);
      }

      console.log("그룹 id:", groupId, "active 여부:", isLikeActive);
    }
    fetchData();
  }, [groupId]);
    

  return (
    <PageContainer>
      <PageWrapper>
      <ProfileSection>
        <ProfileGroup>
            <ImageContainer src={groupImage} />
            <ContentWrapper>
              <OrganizationWrapper>
                {/*<NoWrapItem>{organization?.university}</NoWrapItem>*/}
                <NoWrapItem>{university}</NoWrapItem>
                <NoWrapItem> {groupDepartment} </NoWrapItem>
                <NoWrapItem> {groupName} </NoWrapItem>
              </OrganizationWrapper>
              <DetailSection>
                {detailCards.map((card, index) => (
                  <DetailCard key={index} title={card.title} content={card.content} />
                ))}
              </DetailSection>
            </ContentWrapper>
        </ProfileGroup>
          {userType === "owner" ? (
            <ButtonGroup>
              <FavoriteBox >
                <FavoriteBtn userId={groupId} isLikeActive={isLikeActive} />
                찜하기
              </FavoriteBox>
              <SuggestDealBtn organization={ organization} />
            </ButtonGroup>
          ) : (
            <Link to="edit" style={{ textDecoration: 'none' }}>
              <StyledBtn>수정하기</StyledBtn>
            </Link>
          )}
      </ProfileSection>
      <RecordSection>
        <Divider />
        <RecordList>
            <Title>제휴 이력</Title>
            {dealHistories.length === 0 ? (
              <RecordContainer>
                <EmptyNotice>제휴 이력이 없습니다.</EmptyNotice>
              </RecordContainer>
            ) : (
              <StoreSection>
              {dealHistories.map((deal, index) => (
                <DealHistoryCard key={index} storeName={deal.storeName} period={deal.period} />
              ))}
              </StoreSection>
            )}
          </RecordList>
      </RecordSection>
      </PageWrapper>
    </PageContainer>
  )
}

export default StudentGroupProfile

const OrganizationWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;   
  font-weight: 600;  
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%; 
`;

const NoWrapItem = styled.span`
text-align: center;
  white-space: nowrap;  
  &:not(:last-child) {
    margin-right: 8px; 
  }
`;

const PageContainer = styled.div`
width: 100%;
position: relative;
display: flex;
`;

const PageWrapper = styled.div`
  gap: 59px;
  display: flex;
  flex-direction: row;
  position: relative;
  padding: 49px 59.5px 195px;
  max-width: 1200px; 
  width: 100%;
  box-sizing: border-box;
`;

// 버튼 포함 왼쪽 그룹
const ProfileSection = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  text-align: center;
  font-size: 24px;
  color: #1a2d06;
  font-family: Pretendard;
  max-width: 500px;
`;

// 버튼 제외 왼쪽 그룹
const ProfileGroup = styled.div`
align-self: stretch;
display: flex;
flex-direction: column;
align-items: center;
gap: 30px;
width: 100%;
`;

const ButtonGroup = styled.div`
position: relative;
width: 100%;
display: flex;
flex-direction: row;
align-items: center;
justify-content: flex-start;
gap: 15px;
text-align: left;
font-size: 16px;
color: #898989;
font-family: Pretendard;
`;

// divider랑 제휴이력 오른쪽 박스랑 item
const RecordSection = styled.div`
display: inline-flex;
  flex: 2.5;
  align-items: center;
  gap: 24px;
color: #1a2d06;
font-family: Pretendard;
`;

const Title = styled.div`
align-self: stretch;
position: relative;
font-weight: 600;
white-space: nowrap;
`;

const RecordContainer= styled.div`
display: flex;
  width: 100%;
  min-width: 885px;
  min-height: 340px;
  gap: 24px;

`;

const ImageContainer = styled.img`
width: 210px;
position: relative;
background-color: #d9d9d9;
height: 210px;
border-radius: 50%;
object-fit: cover;
`;

// title + detail
const ContentWrapper = styled.div`
width: 100%;
position: relative;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
gap: 10px;
text-align: center;
font-size: 24px;
color: #1a2d06;
font-family: Pretendard;
`;

const DetailSection = styled.div`
display: flex;
flex-direction: column;
gap: 7px;
text-align: left;
font-size: 16px;
`;

const Divider = styled.div`
width: 1px;
position: relative;
border-right: 1px solid #e7e7e7;
box-sizing: border-box;
height: 431px;
`;

const StoreSection = styled.div`
display: grid;
  width: 100%;
  min-width: 885px;
  min-height: 340px;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
`;

const RecordList = styled.div`
display: flex;
  align-items: flex-start;
  align-content: flex-start;
  gap: 18px 24px;
  align-self: stretch;
  flex-wrap: wrap;
`;

const FavoriteBox = styled.div`
width: 115px;
border-radius: 5px;
border: 1px solid #898989;
box-sizing: border-box;
height: 40px;
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
padding: 5px;
gap: 10px;
min-width: 85px;
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

const StyledBtn = styled.button`
display: flex;
width: 100%;
max=width: 219px;
padding: 13px 81px;
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