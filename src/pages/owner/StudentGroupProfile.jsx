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
import { fetchGroupProfile, getGroupPartnership } from '../../services/apis/groupProfileAPI'
import { fetchProposal, getProposal } from '../../services/apis/proposalAPI'
import { fetchLikes, toggleLikes } from '../../services/apis/likesapi'
import MenuGroup from '../../layout/MenuGroup'
import Menu from '../../layout/Menu'
import useVenueStore from '../../stores/venueStore'

const StudentGroupProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const {userId} = useUserStore(); // 
  const location = useLocation();
  const userType = location.state?.userType || "student-group";
  const previousPage = location.state?.previousPage || "";
  const [isLikeActive, setIsLikeActive] = useState(false);
  const { organization } = location.state || {};
  const [partnershipData, setPartnershipData] = useState([]);
  const [dealHistories, setDealHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { stores } = useVenueStore();
  // console.log("location.state", location.state);
  // console.log("userType", userType);

  const groupId = organization?.user || userId


  console.log("로그인 유저",userId);

  const { studentSize, groupDepartment, groupName, groupImage, partnershipEnd, partnershipStart, termEnd, termStart, partnershipCount, contact, university} = useGroupProfile(groupId);


  const detailCards = [
        { title: '임기', content: `${termStart} ~ ${termEnd}` }, 
        { title: '인원수', content: `${studentSize}명`},
        { title: '희망 제휴 기간', content: `${partnershipStart} ~ ${partnershipEnd}`},
    ];

    useEffect(() => {
      const fetchPartnership = async () => { 
        setLoading(true);
        try {
          const send = await getGroupPartnership(groupId);
          const receive = await getGroupPartnership(groupId, 'received');

          console.log("send data(단체가 보낸 제안 데이터): ", send);
          console.log("receive data(단체가 보낸 제안 데이터): ", receive);
          
          // send와 receive 데이터를 합치고 PARTNERSHIP 상태인 것만 필터링
          const sendPartnership = (send || []).filter(p => p.status === "PARTNERSHIP");
          const receivePartnership = (receive || []).filter(p => p.status === "PARTNERSHIP");
          
          // 두 배열을 합쳐서 partnershipData에 저장
          const combinedPartnership = [...sendPartnership, ...receivePartnership];
          
          console.log("제휴 체결된 데이터:", combinedPartnership);
          setPartnershipData(combinedPartnership);
        } catch (error) {
          console.error("프로필 데이터 조회 실패:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchPartnership();
         }, [groupId]); 

           // 제휴 이력 데이터 처리 로직
      useEffect(() => {
        const processDealHistories = async () => {
          try {
            // 1. getGroupPartnership을 이용해서 send와 receive 데이터 가져오기
            const sendData = await getGroupPartnership(groupId, 'send');
            const receiveData = await getGroupPartnership(groupId, 'received');
            
            console.log("send 데이터:", sendData);
            console.log("receive 데이터:", receiveData);
            
            // PARTNERSHIP 상태인 것만 필터링하여 proposalIds 리스트 생성
            const sendPartnership = (sendData || []).filter(p => p.status === "PARTNERSHIP");
            const receivePartnership = (receiveData || []).filter(p => p.status === "PARTNERSHIP");
            
            // proposalIds 리스트 생성 (id 값들만 추출)
            const proposalIds = [
              ...sendPartnership.map(p => p.id),
              ...receivePartnership.map(p => p.id)
            ].filter(id => id); // null/undefined 제거
            
            console.log("proposalIds:", proposalIds);
            
            if (proposalIds.length === 0) {
              setDealHistories([]);
              return;
            }
            
            // 2. getProposal(id)를 이용해서 각 제안서의 상세 정보 가져오기
            const proposalDetails = await Promise.all(
              proposalIds.map(id => getProposal(id))
            );
            
            console.log("proposalDetails:", proposalDetails);
            
                         // 3. 모든 proposal을 유지하고, STUDENT_GROUP이 아닌 쪽의 id를 추출
             console.log("모든 proposalDetails:", proposalDetails);
             
                           // storeId 리스트 생성 (STUDENT_GROUP이 아닌 쪽의 id)
              const storeIds = proposalDetails.map(proposal => {
                const authorRole = proposal.author?.user_role;
                const recipientRole = proposal.recipient?.user_role;
                
                // STUDENT_GROUP이 아닌 쪽의 id를 반환
                if (authorRole === 'STUDENT_GROUP') {
                  return proposal.recipient?.id;
                } else if (recipientRole === 'STUDENT_GROUP') {
                  return proposal.author?.id;
                }
                return null;
              }).filter(id => id) // null 제거
                // .filter((id, index, self) => self.indexOf(id) === index); // 중복 제거
            
            console.log("storeIds:", storeIds);
            
            // 4. venueStore에서 일치하는 가게 정보 가져오기
            const storeInfo = storeIds.map(storeId => {
              const matchingStore = stores.find(store => store.id === storeId);
              return {
                storeId: storeId,
                name: matchingStore?.name || '알 수 없는 가게',
                photo: matchingStore?.photo || null
              };
            });
            
            console.log("storeInfo:", storeInfo);
            
            // 5. 최종 dealHistories 리스트 생성
             const finalDealHistories = proposalDetails.map(proposal => {
               // 해당 proposal의 storeId 찾기 (STUDENT_GROUP이 아닌 쪽)
               let storeId;
               const authorRole = proposal.author?.user_role;
               const recipientRole = proposal.recipient?.user_role;
               const length = proposal.length || 0;
               
               if (authorRole === 'STUDENT_GROUP') {  
                 storeId = proposal.recipient?.id;
               } else if (recipientRole === 'STUDENT_GROUP') {
                 storeId = proposal.author?.id;
               }
               
               // storeInfo에서 해당 가게 정보 찾기
               const store = storeInfo.find(s => s.storeId === storeId);
               
               return {
                 storeName: store?.name || '알 수 없는 가게',
                 period: `${proposal?.period_start} ~ ${proposal?.period_end}` || '알 수 없는 기간',
                 photo: store?.photo || null
               };
             });
            
            console.log("최종 dealHistories:", finalDealHistories);
            setDealHistories(finalDealHistories);
            
          } catch (error) {
            console.error("제휴 이력 처리 실패:", error);
            setDealHistories([]);
          }
        };
        
        if (stores.length > 0) {
          processDealHistories();
        }
      }, [stores, groupId]);
  
    //console.log(organization);

  useEffect(() => {
    async function fetchData() {
      const list = await fetchLikes('given');
      // 추천한 가게 id 배열 생성
      const likedStoreIds = list.map(item => item.target.id);
      console.log("likedStoreIds: ", likedStoreIds);
      // 버튼 활성화 여부 결정
      if (likedStoreIds.includes(groupId)) {
        console.log('true');
        setIsLikeActive(true);
      } else {
        console.log('false');
        setIsLikeActive(false);
      }

      console.log("그룹 id:", groupId, "active 여부:", isLikeActive);
    }
    fetchData();
  }, [groupId, isLikeActive]);
  
  const handleHeartClick = async (event) => {
    event.stopPropagation();
    setIsLikeActive(!isLikeActive);
    try {
      await toggleLikes(groupId);
    } catch (error) {
      console.error("좋아요 토글 실패:", error);
      setIsLikeActive(isLikeActive);
    }
  };


  if (loading) {
    return (
      <PageContainer>
        {userType === "owner" && previousPage === 'wishlist' && <Menu />}
        {userType === "student-group" && <MenuGroup />}
        <LoadingContainer>
          <LoadingText>로딩중 ...</LoadingText>
        </LoadingContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {userType === "owner" && previousPage === 'wishlist' && <Menu />}
      {userType === "student-group" && <MenuGroup />}
      <ContentContainer>
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
              <FavoriteBox onClick={handleHeartClick} >
                <FavoriteBtn userId={groupId} isLikeActive={isLikeActive} customColor="#898989" useCustomIcon={true} />
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
                <DealHistoryCard key={index} storeName={deal.storeName} period={deal.period} storeImage={deal.photo} />
              ))}
              </StoreSection>
            )}
          </RecordList>
      </RecordSection>
        </PageWrapper>
      </ContentContainer>
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

const PageWrapper = styled.div`
  gap: 59px;
  display: flex;
  flex-direction: row;
  position: relative;
  padding: 49px 0px 195px;
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
font-size: 24px;
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
width: 100%;
border-radius: 5px;
border: 1px solid #898989;
box-sizing: border-box;
height: 40px;
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
padding: 10px;
gap: 5px;
max-width: 130px;
cursor: pointer;
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
