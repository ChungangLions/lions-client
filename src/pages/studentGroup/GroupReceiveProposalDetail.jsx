import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import OwnerInfo from '../../components/common/cards/OwnerInfo';
import CardSection from '../../components/common/cards/OrgCardSection';
import FavoriteBtn from '../../components/common/buttons/FavoriteBtn';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useOwnerProfile from '../../hooks/useOwnerProfile';
import PartnershipTypeBox from '../../components/common/buttons/PartnershipTypeButton';
import { getOwnerProfile } from '../../services/apis/ownerAPI';
import { fetchProposal } from '../../services/apis/proposalAPI';
import MenuGroup from '../../layout/MenuGroup';

// 제휴 유형 아이콘
import { AiOutlineDollar } from "react-icons/ai"; // 할인형
import { MdOutlineAlarm, MdOutlineArticle, MdOutlineRoomService  } from "react-icons/md"; // 타임형, 리뷰형, 서비스제공형
import { fetchGroupProfile } from '../../services/apis/groupProfileAPI';
import useUserStore from '../../stores/userStore';
import AcceptBtn from '../../components/common/buttons/proposal/AcceptBtn';
import RejectBtn from '../../components/common/buttons/proposal/RejectBtn';
import GroupCard from '../../components/common/cards/GroupCard';

const GroupReceiveProposalDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { proposal } = location.state || {};
  
  // 상태 관리
  const [proposalData, setProposalData] = useState(null);
  const [ownerProfile, setOwnerProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log("넘어온 제안서 데이터", proposal);
  console.log("URL 파라미터 ID", id);

  // 제휴 유형 매핑
  const mapPartnershipType = (type) => {
    const typeMap = {
      'DISCOUNT': '할인형',
      'TIME': '타임형',
      'REVIEW': '리뷰형',
      'SERVICE': '서비스제공형',
    };
    return typeMap[type] || type;
  };

  // 제휴 유형을 배열로 변환
  const getPartnershipTypes = (proposal) => {
    if (!proposal?.partnership_type) return [];
    if (Array.isArray(proposal.partnership_type)) {
      return proposal.partnership_type.map(type => mapPartnershipType(type));
    }
    return [mapPartnershipType(proposal.partnership_type)];
  };

  // time_windows 객체를 문자열로 변환하는 함수
  const formatTimeWindows = (timeWindows) => {
    try {
      if (!timeWindows) return '(입력되지 않음)';
      
      if (typeof timeWindows === 'string') {
        return timeWindows;
      }
      
      if (Array.isArray(timeWindows)) {
        const formattedTimes = timeWindows.map(time => {
          if (typeof time === 'string') return time;
          if (typeof time === 'object' && time !== null) {
            const days = Array.isArray(time.days) 
              ? time.days.map(day => Array.isArray(day) ? day[0] : day).join(", ")
              : typeof time.days === 'string' ? time.days : '';
            return `${days} ${time.start || ''} ~ ${time.end || ''}`;
          }
          return '';
        }).filter(time => time !== '');
        return formattedTimes.length > 0 ? formattedTimes.join(" / ") : '(입력되지 않음)';
      }
      
      if (typeof timeWindows === 'object' && timeWindows !== null) {
        const days = Array.isArray(timeWindows.days) 
          ? timeWindows.days.map(day => Array.isArray(day) ? day[0] : day).join(", ")
          : typeof timeWindows.days === 'string' ? timeWindows.days : '';
        const result = `${days} ${timeWindows.start || ''} ~ ${timeWindows.end || ''}`;
        return result.trim() ? result : '(입력되지 않음)';
      }
      
      return '(입력되지 않음)';
    } catch (error) {
      console.error('Error formatting time windows:', error);
      return '(입력되지 않음)';
    }
  };

  // 제휴 유형 데이터
  const partnershipTypes = [
    { type: '할인형', icon: AiOutlineDollar },
    { type: '타임형', icon: MdOutlineAlarm },
    { type: '리뷰형', icon: MdOutlineArticle },
    { type: '서비스제공형', icon: MdOutlineRoomService }
  ];

  const [scrollY, setScrollY] = useState(0);

  // 스크롤 위치 감지
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const {userId } = useUserStore();

  // 현재 로그인된 학생단체 프로필

  const [orgProfile, setOrgProfile ] = useState() ;

  useEffect(() => {
  const loadProfile = async () => {
    try {
      const groupProfile = await fetchGroupProfile(userId);
      setOrgProfile(groupProfile);
      console.log("학생단체", groupProfile); 
    } catch (error) {
      console.error("학생단체 프로필 불러오기 실패:", error);
    }
  };

  if (userId) {
    loadProfile();
  }
}, [userId]);




  // 제안서 데이터와 사장님 프로필 
  useEffect(() => {
    const fetchProposalData = async () => {
      try {
        setLoading(true);
        
        let currentProposal = proposal;
        
        // 전달받은 proposal이 없으면 API에서 가져오기
        if (!currentProposal && id) {
          const proposalsResponse = await fetchProposal();
          const proposals = proposalsResponse.results || proposalsResponse;
          currentProposal = proposals.find(p => p.id === parseInt(id));
        }
        
        if (!currentProposal) {
          throw new Error('제안서를 찾을 수 없습니다.');
        }

        console.log("가져온 제안서 데이터:", currentProposal);
        setProposalData(currentProposal);

        // 사장님 프로필 정보 가져오기
        if (currentProposal.author?.id) {
          try {
            const profile = await getOwnerProfile(currentProposal.author.id);
            console.log("사장님 프로필:", profile);
            setOwnerProfile(profile);
          } catch (error) {
            console.error('사장님 프로필 가져오기 실패:', error);
          }
        }
        
      } catch (error) {
        console.error('제안서 데이터 가져오기 실패:', error);

      } finally {
        setLoading(false);
      }
    };

    fetchProposalData();
  }, [proposal, id]);

  const getProposalContainerTop = () => {
    const minTop = 0;
    const midTop = 300;
    const maxTop = 600;
    
    const stage1Threshold = 200;
    const stage2Threshold = 600;

    if (scrollY <= stage1Threshold) {
      const progress = scrollY / stage1Threshold;
      const easedProgress = Math.pow(progress, 0.5); 
      return minTop + (easedProgress * (midTop - minTop));
    }
    
    if (scrollY <= stage2Threshold) {
      const progress = (scrollY - stage1Threshold) / (stage2Threshold - stage1Threshold);
      const easedProgress = 1 - Math.pow(1 - progress, 2); 
      return midTop + (easedProgress * (maxTop - midTop));
    }
 
    return maxTop;
  };

  // 뒤로가기
  const handleBack = () => {
    navigate('/student-group/mypage/received-suggest');
  };

  if (loading) {
    return (
      <Container>
        <LoadingMessage>제안서 정보를 불러오는 중...</LoadingMessage>
      </Container>
    );
  }

  if (!proposalData) {
    return (
      <Container>
        <ErrorMessage>제안서를 찾을 수 없습니다.</ErrorMessage>
        <BackButton onClick={handleBack}>뒤로가기</BackButton>
      </Container>
    );
  }

    const handleCardClick = (id) => {
    navigate(`/student-group/store-profile/${id}`, {
      state: { userType: "studentOrganization" }
    });
  };


  // GroupCard props 맞추기
  const mappedOwnerProfile = ownerProfile ? {
    name: ownerProfile.profile_name,
    caption: ownerProfile.comment,
    storeType: ownerProfile.business_type
  } : null;



  return (
    <ProposalContainer>
      <ProposalSection>
        <ProposalWrapper>
          <ProposalHeader>
            <HeaderTitle>
              <p>{orgProfile.university_name} {orgProfile.department} {orgProfile.council_name}</p>
              <p>제휴 요청 제안서</p>
            </HeaderTitle>
            <HeaderContent>
              <p>안녕하세요.</p>
              <p>귀 학생회의 적극적인 학생 복지 및 교내 활동 지원에 항상 감사드립니다.</p>
              <p>저희 '{ownerProfile?.profile_name}'는 학생들에게 더 나은 혜택을 제공하고자, 아래와 같이 제휴를 제안드립니다.</p>
            </HeaderContent>
          </ProposalHeader>
          <LineDiv />
          <SectionWrapper>
            {/* 사장님 정보 섹션 */}
            <DetailSection> 
              {/* 사장님 정보 */}
              <DetailBox>
                 <OwnerInfo profileData = {ownerProfile}/>
              </DetailBox>
              
              {/* 제휴 유형 */}
              <DetailBox> 
                <Title> 
                  <div>제휴 유형</div>
                </Title> 
                <ContentBox>  
                  {partnershipTypes.map(({ type, icon: IconComponent }) => (
                    <PartnershipTypeBox 
                      key={type}
                      children={type} 
                      IconComponent={IconComponent}
                      isSelected={getPartnershipTypes(proposalData).includes(type)}
                      onClick={() => {}} // 읽기 전용이므로 클릭 불가
                      disabled={true}
                    />
                  ))}
                </ContentBox>
                <TextBox>
                  <TypeList>
                    <TypeItem>
                      <ItemTitle>할인형)</ItemTitle>
                      <ItemDescription>학생증 제시 또는 특정 조건 충족 시, 메뉴 가격을 일정 비율 할인하여 제공하는 제휴 방식</ItemDescription>
                    </TypeItem>
                    <TypeItem>
                      <ItemTitle>타임형)</ItemTitle>
                      <ItemDescription>매장의 한산 시간대에 한정하여 특정 혜택을 집중 제공하는 제휴 방식</ItemDescription>
                    </TypeItem>
                    <TypeItem>
                      <ItemTitle>리뷰형)</ItemTitle>
                      <ItemDescription>학생이 Type, 커뮤니티 등에 매장 후기/사진을 업로드하면 즉시 보상을 제공하는 제휴 방식</ItemDescription>
                    </TypeItem>
                    <TypeItem>
                      <ItemTitle>서비스 제공형)</ItemTitle>
                      <ItemDescription>본 메뉴 구매 시 무료 메뉴, 음료, 토핑, 사이드, 쿠폰 등 부가적인 서비스를 추가 제공하는 제휴 방식</ItemDescription>
                    </TypeItem>
                  </TypeList>
                </TextBox>
              </DetailBox>
              
              {/* 제휴 조건 */}
              <DetailBox>
                <Title> <div>제휴 조건</div> </Title>
                <ConditionsBox>
                  <ConditionGroup>
                    <ConditionItem>
                      <ConditionLabel>적용 대상</ConditionLabel>
                      <ConditionContent>
                        <p>{proposalData.apply_target || '(입력되지 않음)'}</p>
                      </ConditionContent>
                    </ConditionItem>
                    <ConditionItem>
                      <ConditionLabel>혜택 내용</ConditionLabel>
                      <ConditionContent>
                        <p>{proposalData.benefit_description || '(입력되지 않음)'}</p>
                      </ConditionContent>
                    </ConditionItem>
                  </ConditionGroup>
                  <ConditionGroup>
                    <ConditionItem>
                      <ConditionLabel>적용 시간대</ConditionLabel>
                      <ConditionContent>
                        <p>{formatTimeWindows(proposalData?.time_windows)}</p>
                      </ConditionContent>
                    </ConditionItem>
                    <ConditionItem>
                      <ConditionLabel>제휴 기간</ConditionLabel>
                      <ConditionContent>
                         <p>
                          {proposalData.period_start && proposalData.period_end
                            ? `${proposalData.period_start} ~ ${proposalData.period_end}`
                            : "(입력되지 않음)"}
                        </p>

                      </ConditionContent>
                    </ConditionItem>
                  </ConditionGroup>
                </ConditionsBox>
              </DetailBox>
              <DetailBox>
                <Title> <div>연락처</div> </Title>
                <ConditionsBox>
                <ConditionContent>
                  <p>{proposalData.contact_info || '(입력되지 않음)'}</p>
                </ConditionContent>
                </ConditionsBox>
              </DetailBox>
            </DetailSection>
          </SectionWrapper>
          <Signature>'{ownerProfile?.profile_name || proposalData.author?.name || '사장님'}' 드림</Signature>
        </ProposalWrapper>
      </ProposalSection>


      {/* 오른쪽 섹션 - 제안서 정보 */}
      <ReceiverSection style={{ top: getProposalContainerTop() }}>
        <ReceiverWrapper>
          <SelectedCardWrapper $isSelected={true}>
            {/* ownerProfile 띄우기 */}
            <GroupCard 
                        key={ownerProfile?.id}
                        imageUrl={ownerProfile?.photos?.[0]?.image}
                        onClick={() => ownerProfile?.user && handleCardClick(ownerProfile.user)} // userId
                        likes={false}
                        recommends={false}
                        // isBest={ownerProfile.isBest}
                        // likeCount={ownerProfileLikeCounts[ownerProfile.id] || ownerProfile.likes || 0}
                        // ButtonComponent={() => (
                        //   // <FavoriteBtn 
                        //   //   userId={ownerProfile.id} 
                        //   //   isLikeActive={likeStores.includes(store.id)}
                        //   //   onLikeChange={handleLikeChange}
                        //   // />
                        // )}
                        store={mappedOwnerProfile} />
          </SelectedCardWrapper>  
                  </ReceiverWrapper>
          <ButtonWrapper>
            <RejectBtn 
              proposalId={id} 
              onReject={() => {

                alert('제안서가 거절되었습니다.');
              }} 
            />
              <AcceptBtn 
              proposalId={id} 
              onAccept={() => {
                alert('제휴가 체결되었습니다.');
              }} 
            />
            </ButtonWrapper>
            {/* <CloseBtn onClick={handleBack}>닫기</CloseBtn> */}
          
      
      </ReceiverSection>
    </ProposalContainer>
  )
}

export default GroupReceiveProposalDetail

const StatusBtn = styled.button`
width: 100%;
position: relative;
border-radius: 5px;
border: 1px solid #bcbcbc;
box-sizing: border-box;
height: 45px;
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
padding: 13px 81px;
text-align: left;
font-size: 16px;
color: #bcbcbc;
font-family: Pretendard;
`;

const CloseBtn = styled.button`
width: 100%;
position: relative;
border-radius: 5px;
border: 1px solid #898989;
background-color: white;
height: 45px;
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
padding: 13px 81px;
box-sizing: border-box;
text-align: left;
font-size: 16px;
color: #e9f4d0;
font-family: Pretendard;
border: none;
cursor: pointer;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 20px;
`;

const LoadingMessage = styled.div`
  font-size: 18px;
  color: #70AF19;
`;

const ErrorMessage = styled.div`
  font-size: 18px;
  color: #666;
`;

const BackButton = styled.button`
  padding: 10px 20px;
  background-color: #70AF19;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  
  &:hover {
    background-color: #5a8f15;
  }
`;

const SelectedCardWrapper = styled.div`
  border: 1px solid #e7e7e7;
  border-radius: 5px;
  background-color: transparent;
  transition: all 0.2s ease;
  position: relative;
`;

const ProposalContainer= styled.div`
width: 100%;
display: flex;
flex-direction: row;
gap: 19px;
justify-content: space-between;
max-width: 100%;
padding: 0 20px;
box-sizing: border-box;
min-height: 100vh;
`;

const ProposalSection = styled.div`
flex: 64;
min-width: 797px;
position: relative;
border-radius: 5px;
background-color: #f4f6f4;
display: flex;
flex-direction: column;
align-items: center;
justify-content: flex-start;
padding: 31px 58px;
text-align: center;
font-size: 24px;
color: #1a2d06;
font-family: Pretendard;
`;

const ProposalWrapper = styled.div`
  width: 100%;
  max-width: 797px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 34px;
`;

const ProposalHeader = styled.div`
width: 100%;
position: relative;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
padding: 10px;
gap:20px;
`;

const ReceiverSection = styled.div`
flex: 36;
min-width: 448px;
max-width: 500px;
position: sticky;
top: 80px;
display: flex;
flex-direction: column;
align-items: flex-start;
justify-content: flex-start;
gap: 10px;
text-align: left;
font-size: 18px;
color: #1a2d06;
font-family: Pretendard;
height: fit-content;
transition: top 0.3s ease-out;
max-height: calc(100vh - 100px);
`;

const ReceiverWrapper = styled.div`
width: 100%;
box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.05);
border-radius: 5px;
border: 1px solid #e7e7e7;
box-sizing: border-box;
height: auto;
display: flex;
flex-direction: column;
position: relative;
gap: 10px;
max-height: 80vh;
overflow-y: auto;
`;

const SectionWrapper = styled.div`
width: 100%;
position: relative;
display: flex;
flex-direction: column;
align-items: center;
gap: 25px;
text-align: left;
font-size: 20px;
color: #1A2D06;
font-family: Pretendard;
`;

const HeaderTitle = styled.div`
  padding: 10px;
  font-size: 24px;
  p {
    margin: 0;
    font-weight: 600; 
  }`;

const HeaderContent = styled.div`
position: relative;
display: flex;
flex-direction: column;
padding: 10px;
box-sizing: border-box;
justify-content: center;
font-size: 16px;
color: #1A2D06;
text-align: left;
font-family: Pretendard;

p {
    margin: 0;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  border: none;
  gap: 8px;
`;

const LineDiv = styled.div`
width: 100%;
position: relative;
border-top: 1px solid #d9d9d9;
box-sizing: border-box;
height: 1px;
`;

const DetailSection = styled.div`
align-self: stretch;
display: flex;
flex-direction: column;
align-items: flex-start;
justify-content: center;
gap: 25px;
`;

const Signature = styled.div`
position: relative;
width: 100%;
display: flex;
flex-direction: row;
justify-content: flex-end;
padding: 10px;
box-sizing: border-box;
text-align: left;
font-size: 16px;
color: #1A2D06;
font-family: Pretendard;
`;

// 제휴 content 부분
const Title = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: flex-start;
text-align: left;
white-space: nowrap;
div {
    position: relative;
    font-weight: 600;
    white-space: nowrap;
  }
`;

const DetailBox = styled.div`
width: 100%;
position: relative;
display: flex;
flex-direction: column;
align-items: flex-start;
justify-content: flex-start;
gap: 10px;
text-align: left;
font-size: 20px;
color: #1a2d06;
font-family: Pretendard;
`;

const ContentBox = styled.div`
display: flex;
flex-direction: row;
align-items: flex-start;
justify-content: flex-start;
gap: 10px;
text-align: center;
font-size: 16px;
`;

const TextBox = styled.div`
position: relative;
font-size: 14px;
color: #898989;
`;

const TypeList = styled.ul`
  margin: 0;
  font-size: inherit;
  padding-left: 19px;
`;

const TypeItem = styled.li`
  margin-bottom: 0;
`;

const ItemTitle = styled.span`
  font-weight: 600;
  font-family: Pretendard;
  margin-right: 5px;
`;

const ItemDescription = styled.span`
  font-family: Pretendard;
`;

const ConditionsBox = styled.div`
align-self: stretch;
border-radius: 5px;
background-color: #fff;
display: flex;
flex-direction: row;
align-items: flex-start;
justify-content: space-between;
padding: 15px 20px;
gap: 40px;
font-size: 16px;
`;

const ConditionGroup = styled.div`
width: 50%;
display: flex;
flex-direction: column;
align-items: flex-start;
justify-content: flex-start;
gap: 39px;
`;

const ConditionItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 15px;
  width: 100%;
`;

const ConditionLabel = styled.div`
position: relative;
display: flex;
flex-direction: column;
align-items: flex-start;
justify-content: center;
font-size: 16px;
color: #1a2d06;
font-family: Pretendard;
font-weight: 600;
white-space: nowrap;
`;

const ConditionContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #1a2d06;
  font-size: 16px;
  
  p {
    margin: 0;
  }
`;
