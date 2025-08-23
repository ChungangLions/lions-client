import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import OwnerInfo from '../../components/common/cards/OwnerInfo';
import CardSection from '../../components/common/cards/OrgCardSection';
import FavoriteBtn from '../../components/common/buttons/FavoriteBtn';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useOwnerProfile from '../../hooks/useOwnerProfile';
import PartnershipTypeBox from '../../components/common/buttons/PartnershipTypeButton';
import { fetchStudentProfile } from '../../services/apis/studentProfileApi';
import { fetchProposal } from '../../services/apis/proposalAPI';

// 제휴 유형 아이콘
import { AiOutlineDollar } from "react-icons/ai"; // 할인형
import { MdOutlineAlarm, MdOutlineArticle, MdOutlineRoomService  } from "react-icons/md"; // 타임형, 리뷰형, 서비스제공형

const OwnerSentProposalDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { proposalOrganizations } = location.state || {};
  
  const { storeName } = useOwnerProfile();
  
  // 상태 관리
  const [proposalData, setProposalData] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log("넘어온데이터", proposalOrganizations);



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

  // 전달받은 proposalOrganizations가 있으면 사용, 없으면 API에서 가져오기
  useEffect(() => {
    const fetchProposalData = async () => {
      try {
        setLoading(true);
        
        if (proposalOrganizations) {
          // OwnerSendSuggest에서 전달받은 데이터가 있는 경우
          console.log("전달받은 제안서 데이터:", proposalOrganizations);
          
          // 단일 제안서를 배열로 변환하여 처리
          const enrichedProposal = {
            ...proposalOrganizations,
            // 제안서 ID 설정
            proposal_id: proposalOrganizations.id,
            // 상태 정보 설정
            status: proposalOrganizations.status,
            // 제안서 정보들
            partnership_type: proposalOrganizations.partnership_type,
            apply_target: proposalOrganizations.apply_target,
            benefit_description: proposalOrganizations.benefit_description,
            time_windows: proposalOrganizations.time_windows,
            partnership_period: proposalOrganizations.partnership_period,
            contact_info: proposalOrganizations.contact_info,
            created_at: proposalOrganizations.created_at,
          };
          
          setProposalData([enrichedProposal]);
          setSelectedProposal(enrichedProposal);
        } else {
          // 전달받은 데이터가 없는 경우 API에서 가져오기
          const proposalsResponse = await fetchProposal();
          const proposals = proposalsResponse.results || proposalsResponse;
          
          // 각 제안서에 대해 학생 프로필 정보 가져오기
          const enrichedProposals = await Promise.all(
            proposals.map(async (proposal) => {
              try {
                // 제안서의 recipient 정보에서 학생 프로필 가져오기
                const studentProfile = await fetchStudentProfile(proposal.recipient);
                
                // 학생 프로필 정보와 제안서 정보 합치기
                const enrichedProposal = {
                  ...proposal,
                  // 학생 프로필 정보
                  id: studentProfile?.id || proposal.recipient,
                  name: studentProfile?.name || proposal.recipient,
                  university: studentProfile?.university || '중앙대학교',
                  department: studentProfile?.department || '',
                  council_name: studentProfile?.council_name || studentProfile?.name || '',
                  student_size: studentProfile?.student_size || 0,
                  partnership_start: studentProfile?.partnership_start || '',
                  partnership_end: studentProfile?.partnership_end || '',
                  period: studentProfile?.period || 0,
                  record: studentProfile?.record || 0,
                  is_liked: studentProfile?.is_liked || false,
                  user: studentProfile?.id || proposal.recipient,
                  // 제안서 정보
                  proposal_id: proposal.id,
                  created_at: proposal.created_at,
                  status: proposal.status,
                  partnership_type: proposal.partnership_type,
                  apply_target: proposal.apply_target,
                  benefit_description: proposal.benefit_description,
                  time_windows: proposal.time_windows,
                  partnership_period: proposal.partnership_period,
                  contact_info: proposal.contact_info,
                };
                
                return enrichedProposal;
              } catch (error) {
                console.error('학생 프로필 정보 가져오기 실패:', error);
                // 프로필 정보를 가져올 수 없는 경우 기본 정보만 사용
                return {
                  ...proposal,
                  id: proposal.recipient,
                  name: proposal.recipient,
                  university: '중앙대학교',
                  department: '',
                  council_name: proposal.recipient,
                  student_size: 0,
                  partnership_start: '',
                  partnership_end: '',
                  period: 0,
                  record: 0,
                  is_liked: false,
                  user: proposal.recipient,
                  proposal_id: proposal.id,
                  created_at: proposal.created_at,
                  status: proposal.status,
                  partnership_type: proposal.partnership_type,
                  apply_target: proposal.apply_target,
                  benefit_description: proposal.benefit_description,
                  time_windows: proposal.time_windows,
                  partnership_period: proposal.partnership_period,
                  contact_info: proposal.contact_info,
                };
              }
            })
          );
          
          setProposalData(enrichedProposals);
          
          // 첫 번째 제안서를 기본 선택
          if (enrichedProposals.length > 0) {
            setSelectedProposal(enrichedProposals[0]);
          }
        }
        
      } catch (error) {
        console.error('제안서 데이터 가져오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProposalData();
  }, [proposalOrganizations]);

  // 카드 클릭 핸들러
  const handleCardClick = (proposal) => {
    setSelectedProposal(proposal);
  };

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
    navigate('/owner/mypage/sent-suggest');
  };

  if (loading) {
    return (
      <Container>
        <LoadingMessage>제안서 정보를 불러오는 중...</LoadingMessage>
      </Container>
    );
  }

  if (!proposalData || proposalData.length === 0) {
    return (
      <Container>
        <ErrorMessage>보낸 제안서가 없습니다.</ErrorMessage>
        <BackButton onClick={handleBack}>뒤로가기</BackButton>
      </Container>
    );
  }

  if (!selectedProposal) {
    return (
      <Container>
        <ErrorMessage>선택된 제안서가 없습니다.</ErrorMessage>
        <BackButton onClick={handleBack}>뒤로가기</BackButton>
      </Container>
    );
  }

  return (
    <ProposalContainer>
      <ProposalSection>
        <ProposalWrapper>
          <ProposalHeader>
            <HeaderTitle>
              <p>{selectedProposal.university} {selectedProposal.department} {selectedProposal.council_name}</p>
              <p>제휴 요청 제안서</p>
            </HeaderTitle>
            <HeaderContent>
              <p>안녕하세요.</p>
              <p>귀 학생회의 적극적인 학생 복지 및 교내 활동 지원에 항상 감사드립니다.</p>
              <p>저희 '{storeName}'는 학생들에게 더 나은 혜택을 제공하고자, 아래와 같이 제휴를 제안드립니다.</p>
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
                      isSelected={getPartnershipTypes(selectedProposal).includes(type)}
                      onClick={() => {}} // 읽기 전용이므로 클릭 불가
                      disabled={true}
                    />
                  ))}
                </ContentBox>
                <TextBox>
                  <TypeList>
                    <TypeItem>
                      <ItemTitle>할인형)</ItemTitle>
                      <ItemDescription>학생증 제시 또는 특정 조건 충족 시, 메뉴 가격을 일정 비율 할인하여 제공하는 방식의 제휴</ItemDescription>
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
                        <p>{selectedProposal.apply_target || '(입력되지 않음)'}</p>
                      </ConditionContent>
                    </ConditionItem>
                    <ConditionItem>
                      <ConditionLabel>혜택 내용</ConditionLabel>
                      <ConditionContent>
                        <p>{selectedProposal.benefit_description || '(입력되지 않음)'}</p>
                      </ConditionContent>
                    </ConditionItem>
                  </ConditionGroup>
                  <ConditionGroup>
                    <ConditionItem>
                      <ConditionLabel>적용 시간대</ConditionLabel>
                      <ConditionContent>
                        <p>{selectedProposal.time_windows || '(입력되지 않음)'}</p>
                      </ConditionContent>
                    </ConditionItem>
                    <ConditionItem>
                      <ConditionLabel>제휴 기간</ConditionLabel>
                      <ConditionContent>
                        <p>{selectedProposal.partnership_period || '(입력되지 않음)'}</p>
                      </ConditionContent>
                    </ConditionItem>
                  </ConditionGroup>
                </ConditionsBox>
              </DetailBox>

              {/* 연락처 */}
              <DetailBox>
                <Title> <div>연락처</div> </Title>
                <ConditionContent>
                  <p>{selectedProposal.contact_info || '(입력되지 않음)'}</p>
                </ConditionContent>
              </DetailBox>
            </DetailSection>
          </SectionWrapper>
          <Signature>'{storeName}' 드림</Signature>
        </ProposalWrapper>
      </ProposalSection>

      {/* 오른쪽 섹션 - 제안서 목록 또는 단일 제안서 정보 */}
      <ReceiverSection style={{ top: getProposalContainerTop() }}>
        <ReceiverWrapper>
              <SelectedCardWrapper $isSelected={true}>
                <CardSection 
                  cardType={"proposal"} 
                  organization={selectedProposal} 
                  ButtonComponent={() => <FavoriteBtn organization={selectedProposal} />}
                />
                {/* <ProposalStatus status={selectedProposal?.status}>
                  {selectedProposal?.status === 'UNREAD' && '미열람'}
                  {selectedProposal?.status === 'READ' && '열람'}
                  {selectedProposal?.status === 'PARTNERSHIP' && '제휴체결'}
                  {selectedProposal?.status === 'REJECTED' && '거절'}
                  {selectedProposal?.status === 'DRAFT' && '작성중'}
                </ProposalStatus> */}
              </SelectedCardWrapper>        
          <ButtonWrapper>
            <StatusBtn>현재 {selectedProposal?.status}된 제안서입니다.</StatusBtn>
            <CloseBtn onClick={handleBack}>닫기</CloseBtn>
          </ButtonWrapper>
        </ReceiverWrapper>
      </ReceiverSection>
    </ProposalContainer>
  )
}

export default OwnerSentProposalDetail

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
background-color: #70af19;
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
border-none;
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

const ProposalListTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1a2d06;
  margin: 0 0 15px 0;
  padding: 0 20px;
`;

const SelectedCardWrapper = styled.div`
  border: 1px solid #e7e7e7;
  border-radius: 5px;
  background-color: transparent;
  transition: all 0.2s ease;
  position: relative;
  
`;

const ProposalStatus = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  color: white;
 
  z-index: 2;
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
color: #000;
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
color: #000;
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
  flex-direction: column;
  border: none;
  gap: 10px;
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
color: #000;
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
