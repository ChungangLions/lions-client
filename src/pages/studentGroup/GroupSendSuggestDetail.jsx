import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import OwnerInfo from '../../components/common/cards/OwnerInfo';
import CardSection from '../../components/common/cards/OrgCardSection';
import FavoriteBtn from '../../components/common/buttons/FavoriteBtn';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useOwnerProfile from '../../hooks/useOwnerProfile';
import PartnershipTypeBox from '../../components/common/buttons/PartnershipTypeButton';

// 제휴 유형 아이콘
import { AiOutlineDollar } from "react-icons/ai"; // 할인형
import { MdOutlineAlarm, MdOutlineArticle, MdOutlineRoomService  } from "react-icons/md"; // 타임형, 리뷰형, 서비스제공형
import { getProposal } from '../../services/apis/proposalAPI';
import { fetchGroupProfile } from '../../services/apis/groupProfileAPI';
import useUserStore from '../../stores/userStore';
import { fetchOwnerProfiles } from '../../services/apis/studentProfileApi';

const GroupSendSuggestDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [newGroupProposal, setNewGroupProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const { proposal } = location.state || {};
  console.log("받아온 proposal 데이터: ", proposal);

  const { userId} = useUserStore();

  const [profile, setProfile] = useState();
  const { ownerProfile, setOwnerProfile} = useState();

  const getGroupProfile = async (userId) => {
    try {
      const groupProfile = await fetchGroupProfile(userId);
      console.log("그룹 프로필:", groupProfile);
      setProfile(groupProfile);
    } catch (error) {
      console.error("프로필 가져오기 실패:", error);
      setProfile(null);
    }
  };

//     const getOwnerProfile = async (proposal.name.id) => {
//     try {
//       const ownerProfile = await fetchOwnerProfiles(userId);
//       console.log("사장님 프로필:", ownerProfile);
//       setOwnerProfile(ownerProfile);
//     } catch (error) {
//       console.error("프로필 가져오기 실패:", error);
//       setProfile(null);
//     }
//   };





  useEffect(() => {
    const fetchProposal = async () => {
      try {
        setLoading(true);
        const response = await getProposal(proposal.id);
        console.log("새로운 proposal 데이터: ", response);
        setNewGroupProposal(response);
      } catch (error) {
        console.error("제안서 데이터 가져오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (proposal?.id) {
      fetchProposal();
    } else {
      setLoading(false);
    }
  }, [proposal?.id]);

  // 그룹 프로필 가져오기
  useEffect(() => {
    if (userId) {
      getGroupProfile(userId);
    }
  }, [userId]);

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
  const getPartnershipTypes = () => {
    if (!newGroupProposal?.partnership_type) return [];
    if (Array.isArray(newGroupProposal.partnership_type)) {
      return newGroupProposal.partnership_type.map(type => mapPartnershipType(type));
    }
    return [mapPartnershipType(newGroupProposal.partnership_type)];
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
    navigate('/student-group/mypage/sent-suggest');
  };

//   if (loading) {
//     return (
//       <Container>
//         <LoadingMessage>로딩 중...</LoadingMessage>
//       </Container>
//     );
//   }

  if (!proposal || !newGroupProposal) {
    return (
      <Container>
        <ErrorMessage>제안서 정보를 찾을 수 없습니다.</ErrorMessage>
        <BackButton onClick={handleBack}>뒤로가기</BackButton>
      </Container>
    );
  }

  
  const formattedTimeWindows = newGroupProposal?.time_windows && Array.isArray(newGroupProposal.time_windows)
  ? newGroupProposal.time_windows
      .map(
        (time) =>
          `${(time.days || []).map((day) => day[0]).join(", ")} ${time.start} ~ ${time.end}`
      )
      .join(" / ")
  : '';
  

  // 발신자 정보: 학생 단체
  const senderInfo = {
    id: proposal.id || null,
    name: newGroupProposal.author?.username || null,
    university: profile?.university_name || '중앙대학교',
    department: profile?.department || '',
    council_name: profile?.council_name || newGroupProposal.sender?.name || '',
    student_size: profile?.student_size || 0,
    partnership_start: proposal.partnership_start || '',
    partnership_end: proposal.partnership_end || '',
    period: newGroupProposal.sender?.period || 0,     // 고쳐야할 부분!
    record: proposal.partnership_count || 0,
    is_liked: newGroupProposal.sender?.is_liked || false,     // 고쳐야할 부분!
    user: proposal.id || null,
  };

  return (
    <ProposalContainer>
      <ProposalSection>
        <ProposalWrapper>
          <ProposalHeader>
            <HeaderTitle>
              <p>{senderInfo.university} {senderInfo.department} {senderInfo.council_name}</p>
              <p>제휴 요청 제안서</p>
            </HeaderTitle>
            <HeaderContent>
              <p>안녕하세요.</p>
              <p>저희 학생회는 학생들의 복지 향상과 지역 사회와의 상생을 목표로 제휴 활동을 진행하고 있습니다.</p>
              <p>'{}'와의 협력은 학생들에게 실질적인 혜택을 제공함과 동시에,</p>
              <p>가게에도 긍정적인 효과를 가져올 수 있을 것이라 확신합니다.</p>
            </HeaderContent>
          </ProposalHeader>
          <LineDiv />
          <SectionWrapper>
            <OwnerInfo/>
            
            {/* 제휴 유형, 제휴 조건, 연락처 */}
            <DetailSection> 
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
                      isSelected={getPartnershipTypes().includes(type)}
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
                        <p>{newGroupProposal.apply_target || '(입력되지 않음)'}</p>
                      </ConditionContent>
                    </ConditionItem>
                    <ConditionItem>
                      <ConditionLabel>혜택 내용</ConditionLabel>
                      <ConditionContent>
                        <p>{newGroupProposal.benefit_description || '(입력되지 않음)'}</p>
                      </ConditionContent>
                    </ConditionItem>
                  </ConditionGroup>
                  <ConditionGroup>
                    <ConditionItem>
                      <ConditionLabel>적용 시간대</ConditionLabel>
                      <ConditionContent>
                        <p>{formattedTimeWindows || '(입력되지 않음)'}</p>
                      </ConditionContent>
                    </ConditionItem>
                    <ConditionItem>
                      <ConditionLabel>제휴 기간</ConditionLabel>
                      <ConditionContent>
                        <p>{newGroupProposal.period_start || '(입력되지 않음)'} ~ {newGroupProposal.period_end || '(입력되지 않음)'}</p> 
                      </ConditionContent>
                    </ConditionItem>
                  </ConditionGroup>
                </ConditionsBox>
              </DetailBox>

              {/* 연락처 */}
              <DetailBox>
                <Title> <div>연락처</div> </Title>
                <ConditionContent>
                  <p>{newGroupProposal.contact_info || '(입력되지 않음)'}</p>
                </ConditionContent>
              </DetailBox>
            </DetailSection>
          </SectionWrapper>
          <Signature>'{senderInfo.council_name}' 드림</Signature>
        </ProposalWrapper>
      </ProposalSection>

      {/* 오른쪽 섹션 */}
      <ReceiverSection style={{ top: getProposalContainerTop() }}>
        <ReceiverWrapper>
          <CardSection 
            cardType={"proposal"} 
            organization={senderInfo} 
            ButtonComponent={() => <FavoriteBtn organization={senderInfo} />} 
          />
          <ButtonWrapper>
         
          </ButtonWrapper>
        </ReceiverWrapper>
      </ReceiverSection>
    </ProposalContainer>
  )
}

export default GroupSendSuggestDetail

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 20px;
`;

const ErrorMessage = styled.div`
  font-size: 18px;
  color: #666;
`;

const LoadingMessage = styled.div`
  font-size: 18px;
  color: #70AF19;
  font-weight: 600;
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
  margin-top: 4px;
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

