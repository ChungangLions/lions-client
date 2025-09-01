// profileData : 가게 프로필 
// groupProfile : 학생회 정보
import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import SendProposalBtn from '../../components/common/buttons/SendProposalBtn';
import OwnerInfo from '../../components/common/cards/OwnerInfo';
import CardSection from '../../components/common/cards/OrgCardSection';
import EditBtn from '../../components/common/buttons/EditBtn';
import SaveBtn from '../../components/common/buttons/SaveBtn';
import FavoriteBtn from '../../components/common/buttons/FavoriteBtn';
import Modal from '../../components/common/buttons/Modal';
import { useLocation, useNavigate } from 'react-router-dom';
import useOwnerProfile from '../../hooks/useOwnerProfile';
import InputBox from '../../components/common/inputs/InputBox';
import PeriodPicker from '../../components/common/inputs/PeriodPicker';
import PartnershipTypeBox from '../../components/common/buttons/PartnershipTypeButton';
import DatePicker from '../../components/common/inputs/DatePicker';
import { fetchGroupProfile } from '../../services/apis/groupProfileAPI';

// 제휴 유형 아이콘
import { AiOutlineDollar } from "react-icons/ai"; // 할인형
import { MdOutlineAlarm, MdOutlineArticle, MdOutlineRoomService  } from "react-icons/md"; // 타임형, 리뷰형, 서비스제공형
import createProposal, { editProposal, editProposalStatus, getProposal } from '../../services/apis/proposalAPI';
import useUserStore from '../../stores/userStore';
import { getOwnerProfile } from '../../services/apis/ownerAPI';
import OrgCardSection from '../../components/common/cards/OrgCardSection';
import GroupCard from '../../components/common/cards/GroupCard';


const AIGroupProposalDetail = () => {
  const location = useLocation();
  const { organization, proposalData, isAI: isAIFromState } = location.state || {}; // organiztion undefined로 뜸뜸
  const isAI = typeof isAIFromState === 'boolean' ? isAIFromState : Boolean(proposalData); // proposalData 있으면 ai 돌렸다는거니까 isAI = true
  console.log(location.state);
  const { profileData } = location.state || {};
  console.log("넘어온 데이터 확인", profileData);

  const Week = {data: ['월', '화', '수', '목', '금', '토', '일']};
  const Time = {
    data: Array.from({ length: 48 }, (_, i) => {
      const hour = String(Math.floor(i / 2)).padStart(2, "0");
      const min = i % 2 === 0 ? "00" : "30";
      return `${hour}:${min}`;
    }), 
  };

  const { storeName, contactInfo } = useOwnerProfile();
  console.log(contactInfo);

  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [proposalStatus, setProposalStatus] = useState('');

  // 제휴 유형 선택
  const [selectedPartnershipTypes, setSelectedPartnershipTypes] = useState([]);

  // proposalData로부터 초기 선택 상태 -> 오류 수정 ! 
    useEffect(() => {
      const normalizePartnershipTypes = (types) => {
        const reverseMap = {
          DISCOUNT: '할인형',
          TIME: '타임형',
          REVIEW: '리뷰형',
          SERVICE: '서비스제공형',
        };
        if (!Array.isArray(types)) return [];
        return types.map((t) => reverseMap[t] || t).filter(Boolean);
      };
  
      if (proposalData?.partnership_type?.length) {
        setSelectedPartnershipTypes(normalizePartnershipTypes(proposalData.partnership_type));
      }
    }, [proposalData]);

  // 제안서 상태 가져오기
  useEffect(() => {
    if (proposalData?.current_status) {
      setProposalStatus(proposalData.current_status);
    } else if (proposalData?.id) {
      const fetchProposalStatus = async () => {
        try {
          const proposal = await getProposal(proposalData.id);
          setProposalStatus(proposal.status);
        } catch (error) {
          console.error('제안서 상태 조회 실패:', error);
        }
      };
      fetchProposalStatus();
    }
  }, [proposalData?.id, proposalData?.current_status]);

      // 현재 로그인된 사용자 정보 불러오기
  const [ groupProfile, setGroupProfile] = useState(null);
  const [ isLoading, setIsLoading] = useState(true);
  const { userId } = useUserStore();

  useEffect(() => {
    console.log("UseEffect 실행됨, userId:", userId); // 뭐지? 안 뜸 
    
    const getProfile = async() => {
      try {
        setIsLoading(true);
        const groupProfile = await fetchGroupProfile(userId);
        setGroupProfile(groupProfile);
        console.log("학생단체 데이터", groupProfile);
        console.log("제휴이력 데이터:", groupProfile?.record, groupProfile?.partnership_count);
      } catch(error) {
        console.error("학생 단체 프로필 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (userId) {
      getProfile();
    } else {
      setIsLoading(false);
    }
  }, [userId]);
    
    const navigate = useNavigate();
    const handleCardClick = (ownerId) => {
      navigate(`/student-group/store-profile/${ownerId}`);
    }; 
  
  // 제휴 조건 입력 
  const [partnershipConditions, setPartnershipConditions] = useState({
    applyTarget: '',
    benefitDescription: '',
    timeWindows: []
  });

  // 시간대 상태 관리
  const [busyHours, setBusyHours] = useState([]);

  // 제휴 기간 (PeriodPicker용)
  const [partnershipPeriod, setPartnershipPeriod] = useState({
    startYear: '',
    startMonth: '',
    startDay: '',
    endYear: '',
    endMonth: '',
    endDay: ''
  });

  const [expectedEffects, setExpectedEffects] = useState('');
  const [contact, setContact] = useState('');

  const [ proposalId, setProposalId] = useState(proposalData.id); // 이미 생성됐는지 확인

  // 시간대 데이터를 DatePicker 형식으로 파싱하는 함수
  const parseTimeWindowsToDatePicker = (timeWindows) => {
    console.log('parseTimeWindowsToDatePicker 호출됨, 입력:', timeWindows);
    
    if (!Array.isArray(timeWindows) || timeWindows.length === 0) {
      console.log('timeWindows가 배열이 아니거나 비어있음');
      return [];
    }

    // 요일 매핑 함수
    const mapDayToShort = (day) => {
      const dayMap = {
        '월요일': '월',
        '화요일': '화',
        '수요일': '수',
        '목요일': '목',
        '금요일': '금',
        '토요일': '토',
        '일요일': '일',
        '월': '월',
        '화': '화',
        '수': '수',
        '목': '목',
        '금': '금',
        '토': '토',
        '일': '일'
      };
      return dayMap[day] || day;
    };

    let result = [];
    let idCounter = 0;

    timeWindows.forEach((window, index) => {
      console.log(`처리 중인 window ${index}:`, window);
      
      if (window.days && Array.isArray(window.days)) {
        console.log(`window ${index}의 days 배열:`, window.days);
        // 각 요일을 별도의 행으로 생성
        window.days.forEach((day) => {
          const mappedDay = mapDayToShort(day);
          console.log(`요일 매핑: ${day} -> ${mappedDay}`);
          result.push({
            id: idCounter++,
            day: mappedDay,
            start: window.start || '',
            end: window.end || ''
          });
        });
      } else if (window.days && window.days.length > 0) {
        // 단일 요일인 경우
        const mappedDay = mapDayToShort(window.days[0]);
        console.log(`단일 요일 매핑: ${window.days[0]} -> ${mappedDay}`);
        result.push({
          id: idCounter++,
          day: mappedDay,
          start: window.start || '',
          end: window.end || ''
        });
      }
    });

    console.log('최종 파싱 결과:', result);
    return result;
  };

  // 사장님 프로필 가져오기 -> proposalData.recipient.id로 API 호출
  const [profileId, setProfileId] = useState(proposalData?.recipient?.id); // 이 profileId로 제안서 불러오기 

  useEffect(() => {
  const fetchProfile = async () => { 
    try {
      const ownerId = proposalData?.recipient?.id;
      if (ownerId) {
        const data = await getOwnerProfile(ownerId);
        setProfileId(data.id);
      }
    } catch(error){
      console.error('사장님 프로필 조회 실패:', error);
    }
  } 
  fetchProfile();
}, [proposalData?.recipient?.id]); 

  
      // 제안서가 있다면 proposalData 가져오기
  useEffect(() => {
    if (!proposalData) return;

    setPartnershipConditions({
      applyTarget: proposalData.apply_target || '',
      benefitDescription: proposalData.benefit_description || '',
      timeWindows: proposalData.time_windows || []
    });

    // 시간대 데이터를 DatePicker 형식으로 파싱하여 설정
    if (proposalData.time_windows && proposalData.time_windows.length > 0) {
      console.log('원본 time_windows:', proposalData.time_windows);
      const parsedTimeWindows = parseTimeWindowsToDatePicker(proposalData.time_windows);
      console.log('파싱된 busyHours:', parsedTimeWindows);
      setBusyHours(parsedTimeWindows);
    } else {
      // 기존 데이터가 없으면 기본 행 추가
      setBusyHours([{ id: Date.now(), day: '', start: '', end: '' }]);
    }

    // 제휴 기간 문자열을 파싱
    if (proposalData.period_start && proposalData.period_end) {
      // "2025-08-25" 형식
      const startDate = new Date(proposalData.period_start);
      const endDate = new Date(proposalData.period_end);
      
      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        setPartnershipPeriod({
          startYear: startDate.getFullYear().toString(),
          startMonth: (startDate.getMonth() + 1).toString(),
          startDay: startDate.getDate().toString(),
          endYear: endDate.getFullYear().toString(),
          endMonth: (endDate.getMonth() + 1).toString(),
          endDay: endDate.getDate().toString()
        });
      }
    } else if (proposalData.partnership_period) {
      //  형식 맞추기
      const periodMatch = proposalData.partnership_period.match(/(\d+)년\s*(\d+)월\s*(\d+)일\s*~\s*(\d+)년\s*(\d+)월\s*(\d+)일/);
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

    setExpectedEffects(proposalData.expected_effects || '');
    if (contactInfo) setContact(contactInfo);
  }, [proposalData, contactInfo]);



  // groupProfile이 로드되면 contact 정보 업데이트
  useEffect(() => {
    if (groupProfile?.contact && !contact) {
      setContact(`직책: ${groupProfile.position || ''}\n연락처: ${groupProfile.contact}`);
    }
  }, [groupProfile, contact]);


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
    setIsEditMode(true);
  };

  // 제휴 조건 입력 
  const handleConditionChange = (field, value) => {
    setPartnershipConditions(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 제휴 기간 변경 핸들러
  const handlePeriodChange = (field, value) => {
    setPartnershipPeriod(prev => ({
      ...prev,
      [field]: value
    }));
  };

      // 제휴 기간을 문자열로 변환하는 함수
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


  const openModal = (message) => {
    setModalMessage(message);
    setIsModalOpen(true);
  };


  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage('');
  };

  // 수정하기

  const handleEdit = async () => {
    
    const updateData = {
      recipient: proposalData?.recipient,
      partnership_type: selectedPartnershipTypes,
      apply_target: partnershipConditions.applyTarget,
      time_windows: parseDatePickerToTimeWindows(busyHours),
      benefit_description: partnershipConditions.benefitDescription,
      period_start: formatPeriodStart(),
      period_end: formatPeriodEnd(),
      contact_info: contact || proposalData.contact_info,
      expected_effects : expectedEffects,
      title: '제안서',
      contents: '제휴 내용',
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
      // 제안서 상태가 DRAFT가 아닌 경우가 전송상태
      if (proposalStatus && proposalStatus !== 'DRAFT') {
        openModal('이미 전송된 제안서예요');
        return;
      }

      // **저장하기는 필드 검증 필요 없음 
      if (selectedPartnershipTypes.length === 0) {
        alert('제휴 유형을 선택해주세요.');
        return;
      }

      if (!partnershipConditions.applyTarget || 
          !partnershipConditions.benefitDescription || 
          !formatPartnershipPeriod()) {
        alert('제휴 조건을 모두 입력해주세요.');
        return;
      }

      // 시간대 데이터 검증
      const validTimeWindows = parseDatePickerToTimeWindows(busyHours);
      if (validTimeWindows.length === 0) {
        alert('적용 시간대를 입력해주세요.');
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
        time_windows: parseDatePickerToTimeWindows(busyHours), // 적용 시간대
        benefit_description: partnershipConditions.benefitDescription, // 혜택 내용
        period_start: formatPeriodStart(), // 제휴 기간 시작일
        period_end: formatPeriodEnd(), // 제휴 기간 종료일
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
                openModal('제안서가 전송되었습니다.');
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
        time_windows: parseDatePickerToTimeWindows(busyHours), // 적용 시간대
        benefit_description: partnershipConditions.benefitDescription, // 혜택 내용
        period_start: formatPeriodStart() || null,
        period_end: formatPeriodEnd() || null,
        contact_info: contact || contactInfo, // 연락처
        title: '제안서',
        contents: '제휴 내용',
      };

      createData.expected_effects = expectedEffects;

      console.log('제안서 데이터:', createData);

    try {
      const response = await editProposal(proposalId, createData); // "DRAFT"인 상태로 생성됨
      setIsEditMode(false);
      openModal('제안서가 저장되었어요.\n 보낸 제안에서 저장된 제안서를 확인할 수 있어요');
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

  // 오른쪽 카드 클릭 : 사장님 프로필 전달 필요 

//     const handleCardClick = (org) => {
//     navigate('/student-group/owner-profile', {
//       state: {
//         store,
//         userType: 'student-group'
//       }
//     });
//   };

console.log("데이터확인:", proposalData, profileData, groupProfile);

const mappedOwnerProfile = profileData ? {
    name: profileData.profile_name,
    caption: profileData.comment,
    storeType: profileData.business_type
  } : null;

  
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
                      <ItemDescription>학생이 SNS, 커뮤니티 등에 매장 후기/사진을 업로드하면 즉시 보상을 제공하는 제휴 방식</ItemDescription>
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
                    {busyHours.map((schedule, idx) => {
                      console.log(`DatePicker ${idx} schedule:`, schedule);
                      return (
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
                      );
                    })}
                  </ConditionItem>
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
                    value={expectedEffects?.split('.').filter(sentence => sentence.trim()).join('\n')}
                    onChange={(e) => setExpectedEffects(e.target.value)}
                    disabled={!isEditMode}
                    multiline={true}
                  />
                </DetailBox>
              )}

              <DetailBox style={{ marginTop: '10px' }}>
                <Title> <div>연락처</div> </Title>
                <InputBox 
                  defaultText="텍스트를 입력해주세요."
                  width="100%"
                  value={`직책: ${groupProfile?.position || ''}\n연락처: ${groupProfile?.contact || ''}`}
                  onChange={(e) => setContact(e.target.value)}
                  disabled={!isEditMode}
                  multiline={true}
                />
              </DetailBox>
              

              
            </DetailSection>
          </SectionWrapper>
          <Signature> {groupProfile?.university_name} {groupProfile?.department} {groupProfile?.council_name} 드림</Signature>
        </ProposalWrapper>
      </ProposalSection>

      {/* 오른쪽 섹션 */}
        <ReceiverSection style={{ top: getProposalContainerTop() }}>
          <ReceiverWrapper>

            {/* 사장님 프로필 카드 불러오기 profileData 불러오면 사장님 프로필 정보 볼 수 있음*/}
            

          {/* {profileData && (
             <GroupCard
               
               organization={groupProfile}
               onClick={() => handleCardClick(groupProfile, groupProfile.id)}
             />
           )} */}

            {/* ownerProfile 띄우기 */}
                       <GroupCard 
                                   key={profileData?.id}
                                   imageUrl={profileData?.photos?.[0]?.image}
                                   onClick={() => profileData?.user && handleCardClick(profileData.user)} // userId
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

            <ButtonWrapper>
              {!isEditMode ? (
                <EditBtn onClick={toggleEditMode} isEditMode={isEditMode} />
              ) : (
                <SaveBtn onClick={handleSave} />
              )}
              <SendProposalBtn onClick={handleSend}/>
            </ButtonWrapper>
          </ReceiverWrapper>
        </ReceiverSection>
        <Modal isOpen={isModalOpen} onClose={closeModal} message={modalMessage} />
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
border:none;
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
border:none;
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
  gap: 8px;
`;

// const ButtonWrapper = styled.div`
//   display: grid;
//   grid-template-columns: 1fr 1fr;
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
flex-direction: column;
align-items: flex-start;
justify-content: flex-start;
padding: 20px;
gap: 25px;
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
  gap: 12px;
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
margin-bottom: 4px;
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