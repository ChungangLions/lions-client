import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import OwnerInfo from '../../components/common/cards/OwnerInfo';
import CardSection from '../../components/common/cards/OrgCardSection';
import FavoriteBtn from '../../components/common/buttons/FavoriteBtn';
import StatusBtn from '../../components/common/buttons/StatusBtn';
import SendProposalBtn from '../../components/common/buttons/SendProposalBtn';
import EditBtn from '../../components/common/buttons/EditBtn';
import SaveBtn from '../../components/common/buttons/SaveBtn';
import Modal from '../../components/common/buttons/Modal';
import InputBox from '../../components/common/inputs/InputBox';
import PeriodPicker from '../../components/common/inputs/PeriodPicker';
import DatePicker from '../../components/common/inputs/DatePicker';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import useOwnerProfile from '../../hooks/useOwnerProfile';
import PartnershipTypeBox from '../../components/common/buttons/PartnershipTypeButton';

// 제휴 유형 아이콘
import { AiOutlineDollar } from "react-icons/ai"; // 할인형
import { MdOutlineAlarm, MdOutlineArticle, MdOutlineRoomService  } from "react-icons/md"; // 타임형, 리뷰형, 서비스제공형
import { getProposal, editProposal, editProposalStatus, getAIDraftProposal } from '../../services/apis/proposalAPI';
import { fetchGroupProfile } from '../../services/apis/groupProfileAPI';
import useUserStore from '../../stores/userStore';
import { getOwnerProfile } from '../../services/apis/ownerAPI';
import GroupCard from '../../components/common/cards/GroupCard';

const GroupSendSuggestDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [newGroupProposal, setNewGroupProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const { proposal } = location.state || {};
  const ownerId = proposal.recipient.id;
  console.log("받아온 proposal 데이터: ", proposal);
  console.log("ownerId: ", ownerId);

  const { userId} = useUserStore();

  const Week = {data: ['월', '화', '수', '목', '금', '토', '일']};
  const Time = {
    data: Array.from({ length: 48 }, (_, i) => {
      const hour = String(Math.floor(i / 2)).padStart(2, "0");
      const min = i % 2 === 0 ? "00" : "30";
      return `${hour}:${min}`;
    }), 
  };

  const [profile, setProfile] = useState();
  const [ownerProfile, setOwnerProfile] = useState();
  const [profileLoading, setProfileLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // AI Proposal state
  const [isAILoading, setIsAILoading] = useState(false);
  const [aiProposalData, setAiProposalData] = useState(null);

  // Editable form state
  const [editableForm, setEditableForm] = useState({
    apply_target: '',
    benefit_description: '',
    contact_info: '',
    period_start: '',
    period_end: '',
    time_windows: [],
    partnership_type: []
  });

  // 시간대 상태 관리
  const [busyHours, setBusyHours] = useState([]);

  // Period picker state
  const [partnershipPeriod, setPartnershipPeriod] = useState({
    startYear: '',
    startMonth: '',
    startDay: '',
    endYear: '',
    endMonth: '',
    endDay: ''
  });

  const getGroupProfile = async (userId) => {
    try {
      const groupProfile = await fetchGroupProfile(userId);
      console.log("그룹 프로필:", groupProfile);
      setProfile(groupProfile);
    } catch (error) {
      console.error("프로필 가져오기 실패:", error);
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  };


  const openModal = (message) => {
    setModalMessage(message);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage('');
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


  const fetchOwnerProfile = async (ownerId) => {
    try {
      const ownerProfileData = await getOwnerProfile(ownerId);
      console.log("사장 프로필:", ownerProfileData);
      setOwnerProfile(ownerProfileData);
    } catch (error) {
      console.error("프로필 가져오기 실패:", error);
      setOwnerProfile(null);
    } finally {
      setProfileLoading(false);
    }
  };


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

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        setLoading(true);
        const response = await getProposal(proposal.id);
        console.log("새로운 proposal 데이터: ", response);
        setNewGroupProposal(response);
        
        // Initialize editable form with current data
        setEditableForm({
          apply_target: response.apply_target || '',
          benefit_description: response.benefit_description || '',
          contact_info: response.contact_info || '',
          period_start: response.period_start || '',
          period_end: response.period_end || '',
          time_windows: response.time_windows || [],
          partnership_type: response.partnership_type ? (Array.isArray(response.partnership_type) ? response.partnership_type : [response.partnership_type]) : []
        });

        // 시간대 데이터를 DatePicker 형식으로 파싱하여 설정
        if (response.time_windows && response.time_windows.length > 0) {
          const parsedTimeWindows = parseTimeWindowsToDatePicker(response.time_windows);
          setBusyHours(parsedTimeWindows);
        } else {
          // 기존 데이터가 없으면 기본 행 추가
          setBusyHours([{ id: Date.now(), day: '', start: '', end: '' }]);
        }

        // Initialize period picker with current data
        if (response.partnership_period) {
          const periodMatch = response.partnership_period.match(/(\d+)년\s*(\d+)월\s*(\d+)일\s*~\s*(\d+)년\s*(\d+)월\s*(\d+)일/);
          if (periodMatch) {
            setPartnershipPeriod({
              startYear: periodMatch[1],
              startMonth: periodMatch[2],
              startDay: periodMatch[3],
              endYear: periodMatch[4],
              endMonth: periodMatch[5],
              endDay: periodMatch[6]
            });
          }
        }
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


  // 그룹 프로필이 로드되면 연락처 정보 업데이트
  useEffect(() => {
    if (profile?.contact && editableForm.contact_info !== profile.contact) {
      setEditableForm(prev => ({
        ...prev,
        contact_info: profile.contact
      }));
    }
  }, [profile?.contact]);

  // 기본 시간대 행 추가 (컴포넌트 마운트 시 한 번만 실행)
  useEffect(() => {
    if (busyHours.length === 0) {
      setBusyHours([{ id: Date.now(), day: '', start: '', end: '' }]);
    }
  }, []);


  useEffect(() => {
    if (ownerId) {
      fetchOwnerProfile(ownerId);
    }
  }, [ownerId]);

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

  // 상태에 따른 StatusBtn variant 선택
  const BTN_STATUS_MAP = (status) => {
    if (!status) return '알 수 없음';
    
    switch (status) {
      case 'UNREAD':
        return '미열람';
      case 'READ':
        return '열람';
      case 'PARTNERSHIP':
        return '제휴체결';
      case 'REJECTED':
        return '거절';
      case 'DRAFT':
        return '작성중';
      default:
        return status;
    }
  };

  // 수정/전송 버튼 핸들러
  const handleEdit = () => {
    setIsEditMode(true);
  };

  // 수정 모드 토글 함수
  const toggleEditMode = () => {
    setIsEditMode(true);
  };

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

  const handleSend = async () => {
    try {
      // Validation
      if (!editableForm.partnership_type || editableForm.partnership_type.length === 0) {
        openModal('제휴 유형을 선택해주세요.');
        return;
      }

      if (!editableForm.apply_target || 
          !editableForm.benefit_description || 
          !formatPartnershipPeriod()) {
        openModal('제휴 조건을 모두 입력해주세요.');
        return;
      }

      // 시간대 데이터 검증
      const validTimeWindows = parseDatePickerToTimeWindows(busyHours);
      if (validTimeWindows.length === 0) {
        openModal('적용 시간대를 입력해주세요.');
        return;
      }

      if (!editableForm.contact_info?.trim()) {
        openModal('연락처를 입력해주세요.');
        return;
      }

      const statusData = {
        status: "UNREAD",
        comment: ""
      };

      const response = await editProposalStatus(newGroupProposal.id, statusData);
      openModal('제안서가 전송되었습니다.');
      console.log("제안서 상태 변경 완료", response);
      
      // Update local status
      setNewGroupProposal(prev => ({
        ...prev,
        current_status: 'UNREAD'
      }));
    } catch (error) {
      console.error('제안서 전송 오류:', error);
      openModal('제안서 전송에 실패했습니다.');
    }
  };

  const handleSave = async () => {
    try {
      console.log('저장할 partnership_type:', editableForm.partnership_type);
      
      const updateData = {
        partnership_type: editableForm.partnership_type && editableForm.partnership_type.length > 0 
          ? editableForm.partnership_type 
          : [],
        apply_target: editableForm.apply_target,
        time_windows: parseDatePickerToTimeWindows(busyHours),
        benefit_description: editableForm.benefit_description,
        period_start: formatPeriodStart() || null,
        period_end: formatPeriodEnd() || null,
        contact_info: editableForm.contact_info,
      };

      console.log('busyHours 원본 데이터:', busyHours);
      console.log('파싱된 time_windows:', parseDatePickerToTimeWindows(busyHours));
      console.log('제안서 데이터:', updateData);

      const response = await editProposal(newGroupProposal.id, updateData);
      console.log('제안서 수정 완료:', response);
      
      // Update local state
      setNewGroupProposal(prev => ({
        ...prev,
        ...editableForm
      }));
      
      setIsEditMode(false);
      openModal('제안서가 저장되었습니다.');
    } catch (error) {
      console.error('제안서 수정 실패:', error);
      openModal('제안서 저장에 실패했습니다.');
    }
  };

  const handleCancel = () => {
    setIsEditMode(false);
    // Reset form to original values
    setEditableForm({
      apply_target: newGroupProposal?.apply_target || '',
      benefit_description: newGroupProposal?.benefit_description || '',
      contact_info: profile?.contact || newGroupProposal?.contact_info || '',
      period_start: newGroupProposal?.period_start || '',
      period_end: newGroupProposal?.period_end || '',
      time_windows: newGroupProposal?.time_windows || [],
      partnership_type: newGroupProposal?.partnership_type ? (Array.isArray(newGroupProposal.partnership_type) ? newGroupProposal.partnership_type : [newGroupProposal.partnership_type]) : []
    });
  };

  const handleInputChange = (field, value) => {
    setEditableForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePeriodChange = (field, value) => {
    setPartnershipPeriod(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatPartnershipPeriod = () => {
    const { startYear, startMonth, startDay, endYear, endMonth, endDay } = partnershipPeriod;
    
    if (!startYear || !startMonth || !startDay || !endYear || !endMonth || !endDay) {
      return '';
    }
    
    return `${startYear}년 ${startMonth}월 ${startDay}일 ~ ${endYear}년 ${endMonth}월 ${endDay}일`;
  };

    // 제휴 기간 시작일을 파싱하는 함수
    const formatPeriodStart = () => {
      const { startYear, startMonth, startDay } = partnershipPeriod;
      
      if (!startYear || !startMonth || !startDay) {
        return '';
      }
      
      return `${startYear}-${startMonth}-${startDay}`;
    };
  
    // 제휴 기간 종료일을 파싱하는 함수
    const formatPeriodEnd = () => {
      const { endYear, endMonth, endDay } = partnershipPeriod;
      
      if (!endYear || !endMonth || !endDay) {
        return '';
      }
      
      return `${endYear}-${endMonth}-${endDay}`;
    };

  const handlePartnershipTypeToggle = (type) => {
    setEditableForm(prev => {
      const currentTypes = prev.partnership_type || [];
      const typeKey = type === '할인형' ? 'DISCOUNT' : 
                     type === '타임형' ? 'TIME' : 
                     type === '리뷰형' ? 'REVIEW' : 
                     type === '서비스제공형' ? 'SERVICE' : type;
      
      if (currentTypes.includes(typeKey)) {
        return {
          ...prev,
          partnership_type: currentTypes.filter(t => t !== typeKey)
        };
      } else {
        return {
          ...prev,
          partnership_type: [...currentTypes, typeKey]
        };
      }
    });
  };

  // 시간대 데이터를 DatePicker 형식으로 파싱하는 함수
  const parseTimeWindowsToDatePicker = (timeWindows) => {
    if (!Array.isArray(timeWindows) || timeWindows.length === 0) {
      return [];
    }

    return timeWindows.map((window, index) => ({
      id: index,
      day: window.days && window.days.length > 0 ? window.days[0] : '', // 첫 번째 요일만 사용
      start: window.start || '',
      end: window.end || ''
    }));
  };

  // DatePicker 형식을 시간대 데이터로 파싱하는 함수
  const parseDatePickerToTimeWindows = (datePickerData) => {
    if (!Array.isArray(datePickerData) || datePickerData.length === 0) {
      return [];
    }

    return datePickerData
      .filter(item => item.day && item.start && item.end)
      .map(item => ({
        days: [item.day], // 단일 요일을 배열로 변환
        start: item.start,
        end: item.end
      }));
  };

  // 시간대 변경 핸들러
  const handleDropdownChange = (index, field, value, setter) => {
    setter(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  // 시간대 행 추가 핸들러
  const handleAddRow = (setter) => {
    setter(prev => [...prev, { id: Date.now(), day: '', start: '', end: '' }]);
  };

  // 시간대 행 제거 핸들러
  const handleRemoveRow = (index, setter) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  // AI 제안서 생성 함수
  const handleAIGenerate = async () => {
    try {
      setIsAILoading(true);
      
      // AI 제안서 생성 API 호출
      const aiProposal = await getAIDraftProposal(
        ownerId, // recipient (사장님 ID)
        profile?.contact || editableForm.contact_info || '' // 연락처 정보
      );
      
      setAiProposalData(aiProposal);
      
      // AI 제안서 페이지로 이동 (기존 AIProposalDetail 페이지 형식에 맞춤)
      navigate('/student-group/ai-proposal', { 
        state: { 
          organization: ownerProfile, // 사장님 정보
          proposalData: aiProposal, // AI가 생성한 제안서 데이터
          isAI: true // AI 제안서임을 표시
        } 
      });
      
    } catch (error) {
      console.error('AI 제안서 생성 실패:', error);
      openModal('AI 제안서 생성에 실패했습니다.');
    } finally {
      setIsAILoading(false);
    }
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

  if (loading || profileLoading) {
    return (
      <ProposalContainer>
        <LoadingContainer>
          <LoadingText>로딩중 ...</LoadingText>
        </LoadingContainer>
      </ProposalContainer>
    );
  }

  return (
    <ProposalContainer>
      <ProposalSection>
        <ProposalWrapper>
          <ProposalHeader>
            <HeaderTitle>
              <p>{senderInfo.university} {senderInfo.department} {senderInfo.council_name}</p>
              <p>제휴 요청 제안서 </p>
            </HeaderTitle>
                         <HeaderContent>
               <p>안녕하세요.</p>
               <p>저희 학생회는 학생들의 복지 향상과 지역 사회와의 상생을 목표로 제휴 활동을 진행하고 있습니다.</p>
               <p>'{ownerProfile?.profile_name || '가게'}'와의 협력은 학생들에게 실질적인 혜택을 제공함과 동시에,</p>
               <p>가게에도 긍정적인 효과를 가져올 수 있을 것이라 확신합니다.</p>
             </HeaderContent>
          </ProposalHeader>
          <LineDiv />
                     <SectionWrapper>
             {ownerProfile && <OwnerInfo profileData={ownerProfile}/>}
            
            {/* 제휴 유형, 제휴 조건, 연락처 */}
            <DetailSection> 
              {/* 제휴 유형 */}
              <DetailBox> 
                <Title> 
                  <div>제휴 유형</div>
                 
                </Title> 
                <ContentBox>  
                  {partnershipTypes.map(({ type, icon: IconComponent }) => {
                    const typeKey = type === '할인형' ? 'DISCOUNT' : 
                                   type === '타임형' ? 'TIME' : 
                                   type === '리뷰형' ? 'REVIEW' : 
                                   type === '서비스제공형' ? 'SERVICE' : type;
                    
                    // 편집 모드에서는 editableForm의 데이터를 사용하고, 읽기 모드에서는 newGroupProposal의 데이터를 사용
                    const isSelected = isEditMode 
                      ? (editableForm.partnership_type || []).includes(typeKey)
                      : (newGroupProposal?.partnership_type || []).includes(typeKey);
                    
                    
                    return (
                      <PartnershipTypeBox 
                        key={type}
                        children={type} 
                        IconComponent={IconComponent}
                        isSelected={isSelected}
                        onClick={isEditMode ? () => handlePartnershipTypeToggle(type) : () => {}}
                        disabled={!isEditMode}
                      />
                    );
                  })}
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
                  <ConditionItem>
                    <ConditionLabel>적용 대상</ConditionLabel>
                    <InputBox 
                      defaultText="(예시) 중앙대학교 경영학부 소속 학생" 
                      width="100%"
                      border="1px solid #E9E9E9"
                      value={editableForm.apply_target}
                      onChange={(e) => handleInputChange('apply_target', e.target.value)}
                      disabled={!isEditMode}
                    />
                  </ConditionItem>
                  <ConditionItem>
                    <ConditionLabel>혜택 내용</ConditionLabel>
                    <InputBox 
                      defaultText="(예시) 아메리카노 10% 할인" 
                      width="100%"
                      border="1px solid #E9E9E9"
                      value={editableForm.benefit_description}
                      onChange={(e) => handleInputChange('benefit_description', e.target.value)}
                      disabled={!isEditMode}
                    />
                  </ConditionItem>
                  <ConditionItem>
                    <ConditionLabel>제휴 기간</ConditionLabel>
                    <PeriodPicker 
                      value={partnershipPeriod}
                      onChange={handlePeriodChange}
                      withDay={true}
                      disabled={!isEditMode}
                    />
                  </ConditionItem>
                  <ConditionItem>
                    <ConditionLabel>적용 시간대</ConditionLabel>
                    {busyHours.map((schedule, idx) => (
                      <DatePicker
                        key={schedule.id || idx}
                        idx={idx}
                        schedule={schedule}
                        total={busyHours.length}
                        onChange={(i, f, v) => handleDropdownChange(i, f, v, setBusyHours)}
                        onAdd={() => handleAddRow(setBusyHours)}
                        onRemove={(i) => handleRemoveRow(i, setBusyHours)}
                        dateData={Week}
                        timeData={Time}
                        disabled={!isEditMode}
                      />
                    ))}
                  </ConditionItem>
                </ConditionsBox>
              </DetailBox>

              {/* 연락처 */}
              <DetailBox style={{ marginTop: '10px' }}>
                <Title> <div>연락처</div> </Title>
                <InputBox 
                  defaultText="텍스트를 입력해주세요."
                  width="100%"
                  value={profile?.contact || editableForm.contact_info}
                  onChange={(e) => handleInputChange('contact_info', e.target.value)}
                  disabled={!isEditMode}
                />
              </DetailBox>
            </DetailSection>
          </SectionWrapper>
          <Signature>{senderInfo.university} {senderInfo.department} '{senderInfo.council_name}' 드림</Signature>
        </ProposalWrapper>
      </ProposalSection>

      {/* 오른쪽 섹션 */}
      <ReceiverSection style={{ top: getProposalContainerTop() }}>
                 <ReceiverWrapper>
             {/* ownerProfile 띄우기 */}
             {ownerProfile && (
               <GroupCard 
                 key={ownerProfile.id}
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
                 store={mappedOwnerProfile} 
               />
             )}
          {/* <CardSection 
            cardType={"proposal"} 
            organization={ownerProfile} 
            // ButtonComponent={() => <FavoriteBtn organization={profile} />} 
          /> */}
          </ReceiverWrapper>
          <ButtonWrapper>
            {newGroupProposal?.current_status === 'DRAFT' || newGroupProposal?.current_status === 'READ' ? (
              <>
                                 {!isEditMode ? (
                   <EditBtn onClick={toggleEditMode} isEditMode={isEditMode} />
                 ) : (
                   <SaveBtn onClick={handleSave} />
                 )}
                <SendProposalBtn onClick={handleSend}/>
              </>
            ) : (
              <StatusBtn status={newGroupProposal?.current_status}>
                {BTN_STATUS_MAP(newGroupProposal?.current_status)}된 제안서입니다.
              </StatusBtn>
            )}
            <AIProposalBtn onClick={handleAIGenerate} disabled={isAILoading}>
              {isAILoading ? 'AI 제안서 생성 중...' : 'AI가 만든 제안서 보러가기'}
            </AIProposalBtn>
          </ButtonWrapper>
        
      </ReceiverSection>
      <Modal isOpen={isModalOpen} onClose={closeModal} message={modalMessage} />
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
border:none;
`;

const ReceiverWrapper = styled.div`
width: 100%;
box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.05);
border-radius: 5px;
border: 1px solid none;
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
  flex-direction: column;
  gap: 8px;
  width: 100%;
  margin-top: 4px;
`;


// const ButtonWrapper = styled.div`
//   display: grid;
//   grid-template-columns: 1fr 2fr;
//   gap: 8px;
//   width: 100%;
//   margin-top: 4px;

//   & > *:nth-child(3) {
//     grid-column: 1 / -1;
//   }
// `;



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
flex-direction: column;
align-items: flex-start;
justify-content: flex-start;
padding: 15px 20px;
gap: 20px;
font-size: 16px;
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

const AIProposalBtn = styled.button`
  width: 100%;
  position: relative;
  border-radius: 5px;
  border: 1px solid #70AF19;
  box-sizing: border-box;
  height: 45px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 13px 20px;
  text-align: center;
  font-size: 16px;
  color: #70AF19;
  font-family: Pretendard;
  cursor: pointer;
  background-color: transparent;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background-color: #70AF19;
    color: #e9f4d0;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: #f5f5f5;
    color: #999;
    border-color: #ddd;
  }
`;

