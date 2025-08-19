import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import Menu from "../../layout/Menu";
import { Dropdown } from "../../components/common/inputs/Dropdown";
import InputBox from "../../components/common/inputs/InputBox";
import PhotoUpload from "../../components/common/inputs/PhotoUpload";
import PhotoUploadWithInput from "../../components/common/inputs/PhotoUploadWithInput";
import DatePicker from "../../components/common/inputs/DatePicker";
import { editOwnerProfile, getOwnerProfile } from "../../services/apis/ownerAPI";
import { FaCheck } from "react-icons/fa6";
import useUserStore from "../../stores/userStore";

// ---- 샘플 데이터 ----
const sampleType = { data: ["일반 음식점", "카페", "술집", "기타"] }
const Day = { data: ["월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"] };
const Time = {
  data: Array.from({ length: 48 }, (_, i) => {
    const hour = String(Math.floor(i / 2)).padStart(2, "0");
    const min = i % 2 === 0 ? "00" : "30";
    return `${hour}:${min}`;
  }),
};

const SECTIONS = [
  { key: "photo", label: "대표 사진", refKey: "photo" },
  { key: "campus", label: "주변 캠퍼스", refKey: "campus" },
  { key: "type", label: "업종", refKey: "type" },
  { key: "contact", label: "연락처", refKey: "contact" },
  { key: "name", label: "상호명", refKey: "name" },
  { key: "comment", label: "한 줄 소개", refKey: "comment" },
  { key: "openHours", label: "영업 시간", refKey: "openHours" },
  { key: "menu", label: "대표 메뉴", refKey: "menu" },
  { key: "goal", label: "제휴 목표", refKey: "goal" },
  { key: "revenue", label: "평균 인당 매출", refKey: "revenue" },
  { key: "margin", label: "마진율", refKey: "margin" },
  { key: "busy", label: "바쁜 시간대", refKey: "busy" },
  { key: "free", label: "한산한 시간대", refKey: "free" },
  { key: "extra", label: "추가 제공 서비스", refKey: "extra" },
];

// 임의로 채운 !!! 수정 전 예시 저장 데이터 !!!
const storePhoto = [];
const menuImage = [
  { name: "", price: "", image: [] },
];

const GoalButtons = { 
  new_customer: false, 
  repeat_visit: false, 
  clear_stock: false, 
  peak_time_spread: false, 
  sns_promotion: false, 
  collect_review: false, 
  goalEtc: false
};

const ServiceButtons = { drinks: false , side_menu: false };
const sampleCampus = {
  name: '중앙대학교',
  address: "서울특별시 동작구 흑석로 84 (흑석동, 중앙대학교)",
};


// ---- 학교 api 연결 ----
const apiKey = process.env.REACT_APP_CAREER_API_KEY;

async function fetchCampusList(searchText) {
  const CAMPUS_URL = "https://www.career.go.kr/cnet/openapi/getOpenApi";
  const params = new URLSearchParams({
    apiKey: apiKey,
    svcType: "api",
    svcCode: "SCHOOL",
    contentType: "json",
    gubun: "univ_list",
    searchSchulNm: searchText,
  });

  const url = `${CAMPUS_URL}?${params.toString()}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.dataSearch && data.dataSearch.content) {
    const items = Array.isArray(data.dataSearch.content) ? data.dataSearch.content : [data.dataSearch.content];
    return items.map(item => ({
      name: item.schoolName,
      address: item.adres
    }));
  }
  return [];
}

//---- 학교 검색 modal ----

function CampusSearchModal({ visible, onClose, onSelect }) {
  const [inputValue, setInputValue] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 검색 버튼 클릭 핸들러
  const handleSearchClick = async () => {
    setLoading(true);
    const campuses = await fetchCampusList(inputValue.trim());
    setSearchResults(campuses);
    setLoading(false);
    setSelectedIdx(-1);
  };

  return visible ? (
  <ModalOverlay>
    <ModalContainer>
      <ModalHeader>대학 검색</ModalHeader>
      <SearchRow>
        <ModalInput
          placeholder="예: 중앙대학교, 서울대, 연세대 등"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          style={{ flex: 1, marginRight: 6, padding: 8, fontSize: 16 }}
          onKeyDown={e => { if (e.key === 'Enter') handleSearchClick(); }}
          autoFocus
        />
        <SearchBtnBox onClick={handleSearchClick} style={{ padding: '8px 14px' }}>검색</SearchBtnBox>
      </SearchRow>
      {loading && <div>검색 중...</div>}
      {!!error && (
        <div style={{ color: "#c00", whiteSpace: "pre-line" }}>
          {error}
        </div>
      )}
      {searchResults !== null && (
        <div>
          <div style={{ marginBottom: 8 }}>검색 결과 {searchResults.length}건</div>
          <ResultList>
            {searchResults.length === 0
              ? <ResultItem>검색 결과가 없습니다.</ResultItem>
              : searchResults.map((campus, idx) => (
                  <ResultItem
                    key={campus.name + campus.address}
                    selected={selectedIdx === idx}
                    onClick={() => {
                      setSelectedIdx(idx);
                      if (onSelect) onSelect(campus);
                    }}
                  >
                    <div><b>{campus.name}</b></div>
                    <div style={{color: "#889"}}>{campus.address}</div>
                  </ResultItem>
                ))
            }
          </ResultList>
        </div>
      )}
      <ModalCloseBtn onClick={onClose}>x</ModalCloseBtn>
    </ModalContainer>
  </ModalOverlay>
  ) : null;
}


const OwnerEditMyPage = () => {

  // ---- 예시 데이터로 값 채워져 있는 상태, 나중에 데이터 받으면 수정해야 함 ----
  const [photoState, setPhotoState] = useState(storePhoto);
  const [campusValue, setCampusValue] = useState(sampleCampus);
  const [typeValue, setTypeValue] = useState("");
  const [contactValue, setContactValue] = useState("");
  const [nameValue, setNameValue] = useState("");
  const [commentValue, setCommentValue] = useState("");
  const [menuList, setMenuList] = useState(menuImage);
  const [revenueValue, setRevenueValue] = useState("");
  const [marginValue, setMarginValue] = useState("");

  const [openHours, setOpenHours] = useState([]);
  const [busyHours, setBusyHours] = useState([]);
  const [freeHours, setFreeHours] = useState([]);

  const [goalButtons, setGoalButtons] = useState(GoalButtons);
  const [serviceButtons, setServiceButtons] = useState(ServiceButtons);
  
  // 기타 입력 폼 저장용
  const [otherServiceValue, setOtherServiceValue] = useState("");
  const [otherGoalValue, setOtherGoalValue] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showCampusModal, setShowCampusModal] = useState(false);

  const [scrollY, setScrollY] = useState(0);

  const [profileId, setProfileId] = useState(null);

  const businessTypeMap = {
  RESTAURANT: '일반 음식점',
  CAFE: '카페',
  BAR: '술집',
  };
  
  const { userId } = useUserStore();

  // api data 배열로 변환
  const parseSchedule = (schedule) => {
    if (!schedule) return [] ;

    const dayMap = {
      월: "월요일",
      화: "화요일",
      수: "수요일",
      목: "목요일",
      금: "금요일",
      토: "토요일",
      일: "일요일",
    };
    
    // 객체를 배열로 변환
    return Object.entries(schedule).map(([day, time]) => {
      if (!time) {
        return { day: dayMap[day] || day, start: null, end: null};
      }

      const [start, end] = time.split("-");

      return {
        day: dayMap[day] || day, 
        start: start ? start.trim() : null,
        end: end ? end.trim() : null,
      };
    });
  };

  // 시간 데이터 다시 api 데이터 형식으로
  const convertToApiFormat = (data) => {
  const shortDayMap = {
    월요일: "월",
    화요일: "화",
    수요일: "수",
    목요일: "목",
    금요일: "금",
    토요일: "토",
    일요일: "일",
  };

  return data.reduce((acc, cur) => {
    const shortDay = shortDayMap[cur.day] || cur.day;
    acc[shortDay] = `${cur.start}-${cur.end}`;
    return acc;
  }, {});
};

  // 제공 가능 서비스 유형 api 데이터 변환
  const ServiceType = (Service, otherService) => {
    const services = Service ? Service.split(",") : []; // 서비스에 문자열로 들어가 있는 경우 ','를 기준으로 분기

  return {
    drinks: services.includes("DRINK"),
    side_menu: services.includes("SIDE_MENU"),
    serviceEtc: otherService && otherService.trim().length > 0
  };
};

  const GoalType = (Goal, otherGoal) => {
    const goals = Goal ? Goal.split(",") : []; // 문자열로 들어가 있는 경우 ','를 기준으로 분기

  return {
    new_customer: goals.includes("new_customer"),
    repeat_visit: goals.includes("repeat_visit"),
    clear_stock: goals.includes("clear_stock"),
    peak_time_spread: goals.includes("peak_time_spread"),
    sns_promotion: goals.includes("sns_promotion"),
    collect_review: goals.includes("collect_review"),
    goalEtc: otherGoal && otherGoal.trim().length > 0
  };
};

  // 사진 데이터 변환
  const storePhotoUrls = (photos) => {
    if ( !photos) return [];
    return photos.map(photo => photo.image);
    }

  const parsePhotos = (photos) => {
  return photos.map((url, index) => ({
    id: index + 1, // id를 어쩌지 ? ... 
    image: url,
    order: index,
    uploaded_at: new window.Date().toISOString(), // 지금 시각
  }));
};


  // 사장님 프로필 조회 
  useEffect(() => {
    const fetchProfile = async () => { 
      try {
        const ownerId = userId;
        const data = await getOwnerProfile(ownerId);
        console.log(data);

        setCommentValue(data.comment);
        setNameValue(data.profile_name);
        setContactValue(data.contact);
        setTypeValue(businessTypeMap[data.business_type]);
        setRevenueValue(data.average_sales);
        setMarginValue(data.margin_rate);
        setOpenHours(parseSchedule(data.business_day));
        setBusyHours(parseSchedule(data.peak_time));
        setFreeHours(parseSchedule(data.off_peak_time));
        setServiceButtons(ServiceType(data.available_service, data.available_service_other));
        setPhotoState(storePhotoUrls(data.photos));
        setMenuList(data.menus);
        

        // 수정용 프로필 id
        setProfileId(data.id);
        console.log("메뉴",data.menus);

      } catch (error) {
        console.error("프로필 데이터 조회 실패:", error);
        
      }
    };
    fetchProfile();
  }, []);

  // 프로필 수정
  const serviceData= Object.entries(serviceButtons)
  .filter(([key, value]) => key!== "serviceEtc" && value)  // 기타 제외 true인 값만
  .map(([key]) => key.toUpperCase())  // 대문자로 하는 이유가 있나 ..? 
  .join(",");

  const goalData= Object.entries(goalButtons)
  .filter(([key, value]) => key!== "goalEtc" && value)  // 기타 제외 true인 값만
  .map(([key]) => key)  
  .join(",");

  const handleProfileUpdate = async () => {
    try {
      
      const updateData = {
        profile_name: nameValue, 
        comment: commentValue,
        photos: parsePhotos(photoState),
        contact: contactValue,
        menus: menuList,
        campus: campusValue?.name,
        business_day : convertToApiFormat(openHours),
        business_type : typeValue,
        average_sales : Number(revenueValue), // 백엔드 데이터베이스상 string이 아닌 숫자타입
        margin_rate: marginValue,
        peak_time : convertToApiFormat(busyHours),
        off_peak_time : convertToApiFormat(freeHours),
        available_service : serviceData,
        available_service_other: serviceButtons.serviceEtc ? otherServiceValue : "",
        partnership_goal : goalData,
        partnership_goal_other : goalButtons.goalEtc ? otherGoalValue : "",

      };
      console.log("updateData:", updateData);
      await editOwnerProfile(profileId, updateData);
      alert("프로필 수정 완료!");
    } catch (error) {
      console.error("프로필 수정 실패:", error);
      console.log(localStorage.getItem("accessToken"));
      console.log(profileId);
    
    }
  };

  // ---- 우측 리스트 스크롤 구현 ----
  useEffect(() => {       // 스크롤 위치 감지
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getProgressContainerTop = () => {       // ProgressContainer 위치 계산
    const minTop = 50;
    const maxTop = 230;
    
    if (scrollY <= 0) return maxTop;
    if (scrollY >= 500) return minTop;
    
    const progress = Math.min(scrollY / 500, 1);
    return maxTop - (progress * (maxTop - minTop));
  };

  // 각 섹션별 ref (리스트 아이템 클릭했을 때 이동값값)
  const sectionRefs = {
    photo: useRef(),
    campus: useRef(),
    type: useRef(),
    contact: useRef(),
    name: useRef(),
    comment: useRef(),
    openHours: useRef(),
    menu: useRef(),
    goal: useRef(),
    revenue: useRef(),
    margin: useRef(),
    busy: useRef(),
    free: useRef(),
    extra: useRef(),
  };
  const scrollToSection = (key) => {
    sectionRefs[key].current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // 진행상황 체크 용도
  const isFilledText = val => typeof val === "string" && val.trim() !== "";
  const isFilledList = arr => Array.isArray(arr) && arr.length > 0;
  const isFilledSchedule = arr => Array.isArray(arr) && arr.some(v => v.day && v.start && v.end);
  const isFilledButtons = obj => obj && Object.values(obj).some(Boolean);
  const isFilledCampus = val =>
    val && typeof val === "object" && typeof val.name === "string" && val.name.trim() !== "";

  const isSectionFilled = {
    photo: isFilledList(photoState),
    campus: isFilledCampus(campusValue),
    type: isFilledText(typeValue),
    contact: isFilledText(contactValue),
    name: isFilledText(nameValue),
    comment: isFilledText(commentValue),
    openHours: isFilledSchedule(openHours),
    menu: isFilledList(menuList),
    goal: isFilledButtons(goalButtons),
    revenue: isFilledText(revenueValue),
    margin: isFilledText(marginValue),
    busy: isFilledSchedule(busyHours),
    free: isFilledSchedule(freeHours),
    extra: isFilledButtons(serviceButtons),
  };
  const allFilled = Object.values(isSectionFilled).every(Boolean);

  // 저장 로직
    const handleSave = async() => {
        if (!allFilled) {
          alert("아직 정보를 다 채우지 않았습니다!");
        } else {
          try {
            await handleProfileUpdate();
            setShowModal(true);
        } catch (error) {
          console.error("프로필 수정 실패 :", error);
        }
      }
    };

  // 버튼 토글
  const toggleGoalButton = (key) => {
    setGoalButtons(prev => ({ ...prev, [key]: !prev[key] }));
  };
  const toggleServiceButton = (key) => {
    setServiceButtons(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // DatePicker 핸들러
  const handleAddRow = (setFn) => setFn(prev => [...prev, { day: "", start: "", end: "" }]);
  const handleRemoveRow = (idx, setFn) => setFn(prev => prev.filter((_, i) => i !== idx));
  const handleDropdownChange = (idx, field, value, setFn) => {
    setFn(prev => {
      const updated = [...prev];
      updated[idx][field] = value;
      return updated;
    });
  };


  // ----------- 렌더링 -----------
  return (
    <PageContainer>
      <Menu />

      <TitleContainer>
        <Title> 제휴 프로필 설정 </Title>
        <SubTitle> 우리 가게에 딱 맞는 제휴 조건을 찾기 위해 정보를 입력해주세요. </SubTitle>
      </TitleContainer>
      <ContentSection>
      <MainContainer>
        <EditContainer>
          {/* 대표 사진 */}
          <TitleContainer ref={sectionRefs.photo}>
            <Title> 대표 사진 </Title>
            <SubTitle> 상표, 로고, 매장 사진 등 자유롭게 사진을 등록해주세요. (최대 10장) </SubTitle>
          </TitleContainer>
          <PhotoUpload value={photoState} onChange={setPhotoState} />

          {/* 주변 캠퍼스 */}
          <TitleContainer ref={sectionRefs.campus}>
            <Title> 주변 캠퍼스 </Title>
             <SubTitle>가게 근처 캠퍼스를 검색하여 입력해 주세요.</SubTitle>
          </TitleContainer>
          <SearchCampusButton 
            onClick={() => setShowCampusModal(true)}
          > {campusValue ? campusValue.name : "대학 검색"} </SearchCampusButton>
          <CampusSearchModal
            visible={showCampusModal}
            onClose={() => setShowCampusModal(false)}
            onSelect={campus => {
              setCampusValue(campus);
              setShowCampusModal(false);
            }}
          />

          {/* 업종 */}
          <TitleContainer ref={sectionRefs.type}>
            <Title> 업종 </Title>
            <SubTitle> 가게의 업종을 선택해 주세요. </SubTitle>
          </TitleContainer>
          <Dropdown props={sampleType} value={typeValue} onChange={setTypeValue} />

          <TitleContainer ref={sectionRefs.contact}>
          <Title> 연락처 </Title>
            <SubTitle> 가게의 연락처를 입력해 주세요. 가게의 프로필에 표시돼요. </SubTitle>
          </TitleContainer>
          <InputBox defaultText="텍스트 입력" value={contactValue} onChange={e => setContactValue(e.target.value)} />

          {/* 상호명 */}
          <TitleContainer ref={sectionRefs.name}>
            <Title> 상호명 </Title>
            <SubTitle> 가게의 상호명을 입력해 주세요. </SubTitle>
          </TitleContainer>
          <InputBox defaultText="상호명 입력" value={nameValue} onChange={e => setNameValue(e.target.value)} />

          {/* 한 줄 소개 */}
          <TitleContainer ref={sectionRefs.comment}>
            <Title> 한 줄 소개 </Title>
            <SubTitle> 우리 가게를 잘 나타내는 한 줄 소개를 입력해 주세요. (25자 미만)</SubTitle>
          </TitleContainer>
          <InputBox defaultText="텍스트 입력" value={commentValue} onChange={e => setCommentValue(e.target.value)} />

          {/* 영업 시간 */}
          <TitleContainer ref={sectionRefs.openHours}>
            <Title> 영업 시간 </Title>
            <SubTitle> 요일별 영업 시간을 선택해 주세요. </SubTitle>
          </TitleContainer>
          {openHours.map((schedule, idx) => (
            <DatePicker
              key={idx}
              idx={idx}
              schedule={schedule}
              total={openHours.length}
              onChange={(i, f, v) => handleDropdownChange(i, f, v, setOpenHours)}
              onAdd={() => handleAddRow(setOpenHours)}
              onRemove={(i) => handleRemoveRow(i, setOpenHours)}
              dateData={Day}
              timeData={Time}
            />
          ))}

          {/* 대표 메뉴 */}
          <TitleContainer ref={sectionRefs.menu}>
            <Title> 대표 메뉴 </Title>
            <SubTitle>우리 가게의 대표 메뉴와 가격을 입력해 주세요. (최대 8개)</SubTitle>
            <PhotoUploadWithInput
              maxCount={50}
              inputPlaceholder1="메뉴명"
              inputPlaceholder2="가격"
              value={menuList}
              onChange={setMenuList}
            />
          </TitleContainer>

          {/* 제휴 목표 */}
          <TitleContainer ref={sectionRefs.goal}>
            <Title> 제휴 목표 </Title>
            <SubTitle> 
              <p>가게가 제휴를 통해 얻고자 하는 목표를 선택해주세요.</p>
              <p>※ 프로필 수정 시 제휴 목표를 수정하면 제휴 유형이 달라질 수 있습니다. </p>
              <p>학생단체가 이전 제휴 유형을 기반으로 제안을 검토할 수 있으므로, 변경 시 신중히 판단해 주세요.</p>
              </SubTitle>
          </TitleContainer>
          <ButtonGroup>
            <TextButton $active={goalButtons.goal1} onClick={() => toggleGoalButton('new_customer')}>신규 고객 유입</TextButton>
            <TextButton $active={goalButtons.goal2} onClick={() => toggleGoalButton('repeat_visit')}>재방문 증가</TextButton>
            <TextButton $active={goalButtons.goal3} onClick={() => toggleGoalButton('clear_stock')}>재고 소진</TextButton>
            <TextButton $active={goalButtons.goal4} onClick={() => toggleGoalButton('peak_time_spread')}>피크타임 분산</TextButton>
            <TextButton $active={goalButtons.goal5} onClick={() => toggleGoalButton('sns_promotion')}>SNS 홍보</TextButton>
            <TextButton $active={goalButtons.goal6} onClick={() => toggleGoalButton('collect_review')}>리뷰 확보</TextButton>
            <TextButton $active={goalButtons.goalEtc} onClick={() => toggleGoalButton('goalEtc')}>기타</TextButton>
          </ButtonGroup>
          {goalButtons.goalEtc && 
          (<InputBox 
          defaultText="기타 입력"
          value={otherGoalValue} 
          onChange={e => setOtherGoalValue(e.target.value)} />)}

          {/* 평균 인당 매출 & 마진율 */}
          <SubColumn>
            <ColumnLayout>
              <TitleContainer ref={sectionRefs.revenue}>
                <Title> 평균 인당 매출 </Title>
                <SubTitle> 고객 한 명당 평균 매출액을 입력해 주세요.</SubTitle>
              </TitleContainer>
              <InputBox
                type="number"
                defaultText="평균 인당 매출"
                value={revenueValue}
                onChange={e => setRevenueValue(e.target.value)}
                unit="원"
                width="351px"
              />
            </ColumnLayout>
            <ColumnLayout>
              <TitleContainer ref={sectionRefs.margin}>
                <Title> 마진율 </Title>
                <SubTitle>
                  <p>우리 가게 평균 마진율을 입력해 주세요.</p>
                  <p>※ 마진율 (%) = (총매출 - 총원가) ÷ 총매출 × 100</p>
                </SubTitle>
              </TitleContainer>
              <InputBox
                type="number"
                defaultText="마진율"
                value={marginValue}
                onChange={e => setMarginValue(e.target.value)}
                unit="%"
                width="351px"
              />
            </ColumnLayout>
          </SubColumn>

          {/* 바쁜/한산한 시간대 */}
          <SubColumn>
            <ColumnLayout>
              <TitleContainer ref={sectionRefs.busy}>
                <Title> 바쁜 시간대 </Title>
                <SubTitle> 가게가 가장 바쁜 시간대를 입력해 주세요. </SubTitle>
              </TitleContainer>
              {busyHours.map((schedule, idx) => (
                <DatePicker
                  key={idx}
                  idx={idx}
                  schedule={schedule}
                  total={busyHours.length}
                  onChange={(i, f, v) => handleDropdownChange(i, f, v, setBusyHours)}
                  onAdd={() => handleAddRow(setBusyHours)}
                  onRemove={(i) => handleRemoveRow(i, setBusyHours)}
                  dateData={Day}
                  timeData={Time}
                />
              ))}
            </ColumnLayout>
            <ColumnLayout>
              <TitleContainer ref={sectionRefs.free}>
                <Title> 한산한 시간대 </Title>
                <SubTitle> 가게가 가장 한산한 시간대를 입력해 주세요.</SubTitle>
              </TitleContainer>
              {freeHours.map((schedule, idx) => (
                <DatePicker
                  key={idx}
                  idx={idx}
                  schedule={schedule}
                  total={freeHours.length}
                  onChange={(i, f, v) => handleDropdownChange(i, f, v, setFreeHours)}
                  onAdd={() => handleAddRow(setFreeHours)}
                  onRemove={(i) => handleRemoveRow(i, setFreeHours)}
                  dateData={Day}
                  timeData={Time}
                />
              ))}
            </ColumnLayout>
          </SubColumn>

          {/* 추가 서비스 */}
          <TitleContainer ref={sectionRefs.extra}>
            <Title> 추가 제공 가능 서비스 </Title>
            <SubTitle>
              <p>제휴 시 서비스로 제공 가능한 메뉴를 입력해 주세요. </p>
              <p>※ 작성하신 메뉴가 반드시 제휴에서 제공되는 것은 아니며, 제휴 유형이 ‘서비스 제공형’으로 결정될 경우에만 해당 메뉴가 서비스로 제공됩니다.</p>
            </SubTitle>
          </TitleContainer>
          <ButtonGroup>
            <TextButton $active={serviceButtons.drinks} onClick={() => toggleServiceButton('drinks')}>음료수</TextButton>
            <TextButton $active={serviceButtons.side_menu} onClick={() => toggleServiceButton('side_menu')}>사이드 메뉴</TextButton>
            <TextButton $active={serviceButtons.serviceEtc} onClick={() => toggleServiceButton('serviceEtc')}>기타</TextButton>
          </ButtonGroup>
          {serviceButtons.serviceEtc && 
          <InputBox 
          defaultText="기타 입력" 
          value={otherServiceValue} 
          onChange={e => setOtherServiceValue(e.target.value)}  />}
        </EditContainer>
      </MainContainer>

      {/* 우측 진행상황/저장 - MainContainer 밖으로 이동 */}
      <ProgressContainer style={{ top: getProgressContainerTop() }}>
        <SaveButton onClick={handleSave}>
          저장하기
        </SaveButton>
        <ProgressList>
          {SECTIONS.map((item) => (
            <ProgressItem
              key={item.key}
              $filled={isSectionFilled[item.key]}
              onClick={() => scrollToSection(item.refKey)}
            >
              <ProgressSection>
              <FaCheck /> 
              {item.label}
              </ProgressSection>
            </ProgressItem>
          ))}
        </ProgressList>
      </ProgressContainer>
      </ContentSection>
        {showModal && (
            <ModalOverlay>
                <ModalBox>
                    <ModalText>
                        AI가 우리 가게 프로필에 딱 맞는 제휴 제안서를 완성했어요.
                    </ModalText>
                    <ModalBtnRow>
                        <ModalBtn onClick={() => setShowModal(false)}>닫기</ModalBtn>
                        <ModalBtnPrimary onClick={() => {
                        setShowModal(false); 
                        // 페이지 이동 추가해야 함
                        }}>
                        제안서 확인하러 가기
                        </ModalBtnPrimary>
                    </ModalBtnRow>
                </ModalBox>
            </ModalOverlay>
            )}
    </PageContainer>
  );
};

export default OwnerEditMyPage;

const PageContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  color: #1A2D06;
  position: relative;
`;

const TitleContainer = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 20px;
`;

const SubTitle = styled.div`
  font-weight: 400;
  font-size: 16px;
  p {
  margin: 0;
  }
`;

const MainContainer = styled.div`
  background-color: #f4f4f4;
  gap: 10px;
  margin-top: 10px;
  width: 100%;
  position: relative;
`;

const EditContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0px 117px 25px;
  border: 1px solid none;
  align-items: start;
`;

const SubColumn = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 93px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin: 10px 0;
`;

const TextButton = styled.button`
  padding: 10px;
  border: 1px solid black;
  font-size: 16px;
  font-weight: 400;
  background-color: ${({ $active }) => ($active ? "#D9D9D9" : "white")};
  transition: background-color 0.1s;

  &:hover {
    background-color: ${({ $active }) => ($active ? "#c0c0c0" : "#f0f0f0")};
  }
`;

const ColumnLayout = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProgressContainer = styled.div`
  position: sticky;
  width: 100%;
  height: 587px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transition: top 0.1s ease-out; // 부드러운 움직임을 위한 transition
  justify-content: flex-start;
  gap: 10px;
  text-align: left;
  font-size: 20px;
  color: #e9f4d0;
  font-family: Pretendard;
  box-sizing: border-box;
`;

const ProgressList = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;          // 아이템 간격
  margin: 0;          // 기본 여백 제거!
  padding: 0;
  width: 197px;
justify-content: flex-start;

`;

const ProgressItem = styled.li`
  font-size: 20px;
  cursor: pointer;
  color: ${({ $filled }) => ($filled ? "#64a10f" : "#898989")};
  font-weight: 400;
  transition: color 0.2s;
  margin: 0;      // 혹시 li의 마진 생길 경우
  padding: 0;
  list-style: none;
`;

const ProgressSection = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: flex-start;
gap: 10px;
width: 100%;
`;
const SaveButton = styled.button`
box-sizing: border-box;
width: 100%;
position: relative;
border-radius: 5px;
background-color: #64a10f;
height: 85px;
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
padding: 21px 102px;
font-size: 20px;
color: #e9f4d0;
font-family: Pretendard;
font-weight: 600;
border: none;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.27);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const ModalBox = styled.div`
  width: 492px;
  height: 213px;
  padding: 59px 58px;
  justify-content: center;
  gap: 50px; // 값이 없길래 임의로 넣음
  flex-shrink: 0;
  background: #F8F8F8;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ModalText = styled.div`
    color: #000;
    font-size: 16px;
    font-weight: 400;
    line-height: normal;
`;

const ModalBtnRow = styled.div`
  display: flex;
  gap: 20px;
`;

const ModalBtn = styled.button`
    display: flex;
    width: 90px;
    padding: 10px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border: 1px solid #000;
    cursor: pointer;
    background: #F8F8F8;
`;

const ModalBtnPrimary = styled(ModalBtn)`
    width: 204px;
    padding: 10px;
    background: #3D3D3D;
    color: #FFFFFF;
`;

const SearchCampusButton = styled.button`
  position: relative;
  display: inline-block;
  width: 795px;
  padding: 10px;
  margin-top: 10px;
  background-color: #D9D9D9;
  border: 0px;
  font-size: 16px;
  font-weight: 400;
  text-align: start;

  &:hover {
    opacity: 80%;
  }
`;

// 모달 박스
const ModalContainer = styled.div`
  background: #fff;
  max-width: 540px;
  width: 100%;
  padding: 38px 36px 28px 36px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ModalHeader = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #000;
  margin-bottom: 10px;
`;

const SearchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 18px;
`;

const ModalInput = styled.input`
  flex: 1;
  padding: 11px 18px;
  font-size: 16px;
  border: 1px solid #000;
  background: #fff;
  border-radius: 10px;
`;

const SearchBtnBox = styled.div`
  display: flex;
  align-items: center;
  background: #D9D9D9;
  padding: 0 17px;
  height: 40px;
  color: #fff;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  user-select: none;
  &:hover { opacity: 80%; }
`;

const ResultList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 14px;
  max-height: 330px;
  overflow-y: auto;

  scrollbar-width: thin;
  scrollbar-color: #888 #eee;
`;

const ResultItem = styled.div`
  // background: ${({ selected }) => (selected ? "#fff" : "#D9D9D9")};
  border: 1px solid #000;
  padding: 14px 18px;
  font-size: 17px;
  color: #000;
  cursor: pointer;
  transition: background 0.15s, border 0.14s;
  margin-right: 5px;
  &:hover { background: #D9D9D9; border-color: #000; }
`;

// 닫기(X) 버튼
const ModalCloseBtn = styled.button`
  position: absolute;
  top: 18px;
  right: 22px;
  background: none;
  border: none;
  font-size: 24px;
  color: #222222;
  cursor: pointer;
  &:hover { opacity: 80%; }
`;

const ResultTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #000;
  margin-bottom: 6px;
  margin-top: 4px;
`;

const ContentSection = styled.div`
display: flex;
flex-direction: row;
gap: 24px;
`;