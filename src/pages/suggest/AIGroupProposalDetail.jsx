// 이거 하나에 다하려니까 함수 너무 길어져서 나중에 리팩토링 해야댐 ㅠ 

import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import SendProposalBtn from '../../components/common/buttons/SendProposalBtn';
import OwnerInfo from '../../components/common/cards/OwnerInfo';
import CardSection from '../../components/common/cards/OrgCardSection';
import EditBtn from '../../components/common/buttons/EditBtn';
import SaveBtn from '../../components/common/buttons/SaveBtn';
import FavoriteBtn from '../../components/common/buttons/FavoriteBtn';
import { useLocation } from 'react-router-dom';
import useOwnerProfile from '../../hooks/useOwnerProfile';
import InputBox from '../../components/common/inputs/InputBox';
import PartnershipTypeBox from '../../components/common/buttons/PartnershipTypeButton';

// 제휴 유형 아이콘
import { AiOutlineDollar } from "react-icons/ai"; // 할인형
import { MdOutlineAlarm, MdOutlineArticle, MdOutlineRoomService  } from "react-icons/md"; // 타임형, 리뷰형, 서비스제공형
import createProposal, { editProposal, editProposalStatus } from '../../services/apis/proposalAPI';
import useUserStore from '../../stores/userStore';
import { getOwnerProfile } from '../../services/apis/ownerAPI';


const AIGroupProposalDetail = () => {
  const location = useLocation();
  const { organization, proposalData, isAI: isAIFromState } = location.state || {};
  const isAI = typeof isAIFromState === 'boolean' ? isAIFromState : Boolean(proposalData); // proposalData 있으면 ai 돌렸다는거니까 isAI = true
  console.log(location.state);
  const { profileData } = location.state || {};
  console.log("넘어온 데이터 확인", profileData);

  const { storeName, contactInfo } = useOwnerProfile();
  console.log(contactInfo);

  // 제휴 유형 선택
  const [selectedPartnershipTypes, setSelectedPartnershipTypes] = useState([]);
  
  // 제휴 조건 입력 
  const [partnershipConditions, setPartnershipConditions] = useState({
    applyTarget: '',
    benefitDescription: '',
    timeWindows: '',
    partnershipPeriod: ''
  });

  const [expectedEffects, setExpectedEffects] = useState('');
  const [contact, setContact] = useState(profileData?.contact);

  const [ proposalId, setProposalId] = useState(proposalData.id); // 이미 생성됐는지 확인

  // 사장님 프로필 가져오기 -> 유저 아이디로 API 호출
  const { userId }= useUserStore();
  const { profileId, setProfileId } = useState(profileData?.id); // 이 profileId로 제안서 불러오기 

  useEffect(() => {
  const fetchProfile = async () => { 
    try {
      const ownerId = profileData?.id;
      const data = await getOwnerProfile(ownerId);
      setProfileId(data.id);
    } catch(error){
      console.error(error);
    }
  } 
  fetchProfile();
}, []); 

  
  // 제안서가 있다면 proposalData 가져오기
  useEffect(() => {
    if (!proposalData) return;

    const formattedTimeWindows = Array.isArray(proposalData.time_windows)
      ? proposalData.time_windows
          .map(
            (time) =>
              `${(time.days || []).map((day) => day[0]).join(", ")} ${time.start} ~ ${time.end}`
          )
          .join(" / ")
      : '';

    setPartnershipConditions({
      applyTarget: proposalData.apply_target || '',
      benefitDescription: proposalData.benefit_description || '',
      timeWindows: formattedTimeWindows,
      partnershipPeriod:
        proposalData.period_start && proposalData.period_end
          ? `${proposalData.period_start} ~ ${proposalData.period_end}`
          : '',
    });

    setExpectedEffects(proposalData.expected_effects || '');
    if (contactInfo) setContact(contactInfo);
  }, [proposalData, contactInfo]);


  // 
  const [isEditMode, setIsEditMode] = useState(false);

  // 제휴 유형 토글 
  const togglePartnershipType = (type) => {
    setSelectedPartnershipTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  // 수정 모드 토글 함수
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  // 제휴 조건 입력 
  const handleConditionChange = (field, value) => {
    setPartnershipConditions(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 제휴 유형 매핑 함수
  const mapPartnership = (selected) => {
    const typeMap = {
      '할인형': 'DISCOUNT',
      '타임형': 'TIME',
      '리뷰형': 'REVIEW',
      '서비스제공형': 'SERVICE',
    };

    if (Array.isArray(selected)) {
      return selected.map((label) => typeMap[label]).filter(Boolean);
    }
    return typeMap[selected] || null;
  };

  // 수정하기

  const handleEdit = async () => {
    
    const updateData = {
      recipient: profileData?.user,
      partnership_type: mapPartnership(selectedPartnershipTypes),
      apply_target: partnershipConditions.applyTarget,
      time_windows: partnershipConditions.timeWindows,
      benefit_description: partnershipConditions.benefitDescription,
      partnership_period: partnershipConditions.partnershipPeriod,
      contact_info: contact || proposalData.contact_info,
      expected_effects : proposalData.expectedEffects,
    };
      
    const id = proposalData.id != null ? proposalData.id : proposalId;

    try {
      const response = await editProposal( userId , updateData);
      console.log('제안서 수정 완료:', response);
      setIsEditMode(false);
    } catch (error) {
      console.error('제안서 ID:', id);
      console.error('제안서 수정 실패:', error);
    }
  };

  // 전송하기 누르면 필드 다 채워졌는지 확인 후 제안서 생성
  const handleSend = async () => {
    try {
      // **저장하기는 필드 검증 필요 없음 
      if (selectedPartnershipTypes.length === 0) {
        alert('제휴 유형을 선택해주세요.');
        return;
      }

      if (!partnershipConditions.applyTarget || 
          !partnershipConditions.benefitDescription || 
          !partnershipConditions.timeWindows || 
          !partnershipConditions.partnershipPeriod) {
        alert('제휴 조건을 모두 입력해주세요.');
        return;
      }

      if (!((contact || contactInfo || '').trim())) {
        alert('연락처를 입력해주세요.');
        return;
      }

      const createData = {
        recipient: profileData?.user, // 전송 대상 여기서는 학생 단체의 프로필 아이디 
        partnership_type: selectedPartnershipTypes, // 제휴 유형 
        apply_target: partnershipConditions.applyTarget, // 적용 대상
        time_windows: partnershipConditions.timeWindows, // 적용 시간대
        benefit_description: partnershipConditions.benefitDescription, // 혜택 내용
        partnership_period: partnershipConditions.partnershipPeriod, // 제휴 기간
        contact_info: contact || contactInfo, // 연락처
      };

      if (isAI) {
        createData.expected_effects = expectedEffects;
      }

              console.log('제안서 데이터:', createData);
      
                // 예 누른 순간 제안서 생성이 된 상태이므로 제안서 상태 변경 api 호출
                const statusData = {
                  status: "UNREAD",
                  comment: ""
                };
                const response = await editProposalStatus(proposalId, statusData);
                alert('제안서가 전송되었습니다.');
                console.log("제안서 상태 변경 완료", response);
              
              
            } catch (error) {
              console.error('제안서 전송 오류:', error);
              alert('제안서 전송에 실패했습니다.');
            }
          };


  // 저장하기는 일부 필드 비워져있어도 가능 
  const handleSave = async () => {

    const createData = {
        recipient: organization?.user, // 전송 대상 여기서는 학생 단체의 프로필 아이디 
        partnership_type: selectedPartnershipTypes, // 제휴 유형 
        apply_target: partnershipConditions.applyTarget, // 적용 대상
        time_windows: partnershipConditions.timeWindows, // 적용 시간대
        benefit_description: partnershipConditions.benefitDescription, // 혜택 내용
        partnership_period: partnershipConditions.partnershipPeriod, // 제휴 기간
        contact_info: contact || contactInfo, // 연락처
      };

      createData.expected_effects = expectedEffects;

      console.log('제안서 데이터:', createData);

    try {
      const response = await editProposal(proposalId, createData); // "DRAFT"인 상태로 생성됨
      setIsEditMode(false);
    } catch (error) {
      console.error('제안서 전송 오류:', error);
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

  // ---- 우측 리스트 스크롤 구현 ----
  useEffect(() => {       // 스크롤 위치 감지
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getProposalContainerTop = () => {       
    const minTop = 0;  // 시작 위치
    const midTop = 300; // 중간 위치
    const maxTop = 600; // 최종 위치
    
    const stage1Threshold = 200; // 임계값1
    const stage2Threshold = 600; // 임계값2

    // 시작 위치에서 중간 위치로
    if (scrollY <= stage1Threshold) {
      const progress = scrollY / stage1Threshold;
      const easedProgress = Math.pow(progress, 0.5); 
      return minTop + (easedProgress * (midTop - minTop));
    }
    
    // 중간 위치에서 최종 위치로 
    if (scrollY <= stage2Threshold) {
      const progress = (scrollY - stage1Threshold) / (stage2Threshold - stage1Threshold);
      const easedProgress = 1 - Math.pow(1 - progress, 2); 
      return midTop + (easedProgress * (maxTop - midTop));
    }
 
    // 최대 위치 도달
    return maxTop ;
  };

  
  return (
    <ProposalContainer>
      <ProposalSection>
        <ProposalWrapper>
          <ProposalHeader>
            <HeaderTitle>
            <p>{profileData.profile_name}</p>
            <p>제휴 요청 제안서</p>
            </HeaderTitle>
            <HeaderContent>
                <p>안녕하세요.</p>
              <p>저희 학생회는 학생들의 복지 향상과 지역 사회와의 상생을 목표로 제휴 활동을 진행하고 있습니다.</p>
              <p>'{profileData.profile_name}'와의 협력은 학생들에게 실질적인 혜택을 제공함과 동시에,</p>
              <p>가게에도 긍정적인 효과를 가져올 수 있을 것이라 확신합니다.</p>
            </HeaderContent>
          </ProposalHeader>
          <LineDiv />
          <SectionWrapper>
            <OwnerInfo profileData = {profileData}/>
            {/* 제휴 유형, 제휴 조건, 기대 효과, 연락처 */}
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
                      isSelected={selectedPartnershipTypes.includes(type)}
                      onClick={() => isEditMode && togglePartnershipType(type)}
                      disabled={!isEditMode}
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
                      <InputBox 
                        defaultText="(예시) 중앙대학교 경영학부 소속 학생" 
                        width="100%"
                        border="1px solid #E9E9E9"
                        value={partnershipConditions.applyTarget}
                        onChange={(e) => handleConditionChange('applyTarget', e.target.value)}
                        disabled={!isEditMode}
                      />
                    </ConditionItem>
                    <ConditionItem>
                      <ConditionLabel>혜택 내용</ConditionLabel>
                      <InputBox 
                        defaultText="(예시) 아메리카노 10% 할인" 
                        width="100%"
                        border="1px solid #E9E9E9"
                        value={partnershipConditions.benefitDescription}
                        onChange={(e) => handleConditionChange('benefitDescription', e.target.value)}
                        disabled={!isEditMode}
                      />
                    </ConditionItem>
                  </ConditionGroup>
                  <ConditionGroup>
                    <ConditionItem>
                      <ConditionLabel>적용 시간대</ConditionLabel>
                      <InputBox 
                        defaultText="(예시) 평일 13:00 - 15:00" 
                        width="100%"
                        border="1px solid #E9E9E9"
                        value={partnershipConditions.timeWindows}
                        onChange={(e) => handleConditionChange('timeWindows', e.target.value)}
                        disabled={!isEditMode}
                      />
                    </ConditionItem>
                    <ConditionItem>
                      <ConditionLabel>제휴 기간</ConditionLabel>
                      <InputBox 
                        defaultText="(예시) 2025년 9월 1일 ~ 2025년 11월 30일"
                        width="100%"
                        border="1px solid #E9E9E9"
                        value={partnershipConditions.partnershipPeriod}
                        onChange={(e) => handleConditionChange('partnershipPeriod', e.target.value)}
                        disabled={!isEditMode}
                      />
                    </ConditionItem>
                  </ConditionGroup>
                </ConditionsBox>
              </DetailBox>

              {/* 기대효과: AI 모드에서만 표시 */}
              {isAI && (
                <DetailBox>
                  <Title> <div>기대 효과</div></Title>
                  <InputBox 
                    defaultText="텍스트를 입력해주세요."
                    width="100%"
                    border="1px solid #E9E9E9"
                    value={expectedEffects}
                    onChange={(e) => setExpectedEffects(e.target.value)}
                    disabled={!isEditMode}
                  />
                </DetailBox>
              )}

              <DetailBox>
                <Title> <div>연락처</div> </Title>
                <InputBox 
                  defaultText="텍스트를 입력해주세요."
                  width="100%"
                  value={profileData?.contact}
                  onChange={(e) => setContact(e.target.value)}
                  disabled={!isEditMode}
                />
              </DetailBox>
              

              
            </DetailSection>
          </SectionWrapper>
          <Signature>'{profileData?.profile_name}'드림</Signature>
        </ProposalWrapper>
      </ProposalSection>

      {/* 오른쪽 섹션 */}
        <ReceiverSection style={{ top: getProposalContainerTop() }}>
          <ReceiverWrapper>

            <ButtonWrapper>
              <EditBtn onClick={toggleEditMode} isEditMode={isEditMode} />
              <SaveBtn onClick={handleSave} />
              <SendProposalBtn onClick={handleSend}/>
            </ButtonWrapper>
          </ReceiverWrapper>
        </ReceiverSection>
    </ProposalContainer>

            )
        };

export default AIGroupProposalDetail

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
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  width: 100%;
  margin-top: 4px;

  & > *:nth-child(3) {
    grid-column: 1 / -1;
  }
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

const ConditionInputBox = styled(InputBox)`
color: #898989;
text-align: left;
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
  margin-right: 5px; /* 제목과 내용 사이 간격 추가 */
`;

const ItemDescription = styled.span`
  font-family: Pretendard;
`;

// 제휴 조건
const SectionContainer = styled.div`
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
  font-family: Pretendard, sans-serif;
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

const ConditionTitle = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
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

const TimeWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 22px;
`;

const TimeTitle = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const TimeContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #1a2d06;
  font-size: 16px;
`;

// 제휴 효과
const ContentWrapper = styled.div`
  align-self: stretch;
  border-radius: 5px;
  background-color: #fff;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 15px 20px;
  font-size: 16px;
`;

const InputText= styled(InputBox)`
  margin: 0;
  font-family: inherit;
  font-size: inherit;
`;

const ListItem = styled.li`
  margin-bottom: 0;

  &:last-child {
    font-size: 16px;
    font-family: Pretendard;
    color: #1a2d06;
    list-style: none;
    margin-left: -20px; 
  }
`;