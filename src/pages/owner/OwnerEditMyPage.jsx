import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import Menu from "../../components/common/layout/Menu";
import { Dropdown } from "../../components/common/inputs/Dropdown";
import InputBox from "../../components/common/inputs/InputBox";
import PhotoUpload from "../../components/common/inputs/PhotoUpload";
import PhotoUploadWithInput from "../../components/common/inputs/PhotoUploadWithInput";
import DatePicker from "../../components/common/inputs/DatePicker";

// ---- 샘플 데이터 ----
const sampleType = { data: ["한식", "중식", "일식", "카페", "술집", "기타"] }
const Date = { data: ["월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"] };
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
  { key: "name", label: "상호명", refKey: "name" },
  { key: "description", label: "한 줄 소개", refKey: "description" },
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
const samplePhoto = ["https://via.placeholder.com/150"];
const sampleMenu = [
  { file: "https://via.placeholder.com/100", value1: "김치찌개", value2: "8000" },
  { file: "https://via.placeholder.com/100", value1: "된장찌개", value2: "7500" }
];
const sampleSchedule = [
  { day: "월요일", start: "09:00", end: "18:00" },
  { day: "화요일", start: "09:00", end: "18:00" }
];
const sampleGoalButtons = { goal1: true, goal2: true, goal3: true };
const sampleServiceButtons = { service1: true, service2: true };
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
  const [photoState, setPhotoState] = useState(samplePhoto);
  const [campusValue, setCampusValue] = useState(sampleCampus);
  const [typeValue, setTypeValue] = useState("한식");
  const [nameValue, setNameValue] = useState("맛있는 한식당");
  const [descriptionValue, setDescriptionValue] = useState("정성이 가득한 한식집");
  const [menuList, setMenuList] = useState(sampleMenu);
  const [revenueValue, setRevenueValue] = useState("15000");
  const [marginValue, setMarginValue] = useState("40");

  const [openHours, setOpenHours] = useState(sampleSchedule);
  const [busyHours, setBusyHours] = useState(sampleSchedule);
  const [freeHours, setFreeHours] = useState(sampleSchedule);

  const [goalButtons, setGoalButtons] = useState(sampleGoalButtons);
  const [serviceButtons, setServiceButtons] = useState(sampleServiceButtons);

  const [showModal, setShowModal] = useState(false);
  const [showCampusModal, setShowCampusModal] = useState(false);

  const [scrollY, setScrollY] = useState(0);

  // ---- 우측 리스트 스크롤 구현 ----
  useEffect(() => {       // 스크롤 위치 감지
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getProgressContainerTop = () => {       // ProgressContainer 위치 계산
    const minTop = 70;
    const maxTop = 245;
    
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
    name: useRef(),
    description: useRef(),
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
    name: isFilledText(nameValue),
    description: isFilledText(descriptionValue),
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
    const handleSave = () => {
        if (!allFilled) {
            alert("아직 정보를 다 채우지 않았습니다!");
        } else {
            setShowModal(true);
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
            <SubTitle> 어쩌구저쩌구어쩌저자ㅓ이ㅏ저ㅣㅏㅓ이ㅏㅉㅈ </SubTitle>
          </TitleContainer>
          <SearchCampusButton 
            onClick={() => setShowCampusModal(true)}
          > 대학 검색 </SearchCampusButton>
          {campusValue && (
            <ResultTitle>
              선택한 캠퍼스: {campusValue.name}
            </ResultTitle>
          )}
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
            <SubTitle> 어쩌구저쩌구어쩌저자ㅓ이ㅏ저ㅣㅏㅓ이ㅏㅉㅈ </SubTitle>
          </TitleContainer>
          <Dropdown props={sampleType} value={typeValue} onChange={setTypeValue} />

          {/* 상호명 */}
          <TitleContainer ref={sectionRefs.name}>
            <Title> 상호명 </Title>
            <SubTitle> 어쩌구저쩌구어쩌저자ㅓ이ㅏ저ㅣㅏㅓ이ㅏㅉㅈ </SubTitle>
          </TitleContainer>
          <InputBox defaultText="상호명 입력" value={nameValue} onChange={e => setNameValue(e.target.value)} />

          {/* 한 줄 소개 */}
          <TitleContainer ref={sectionRefs.description}>
            <Title> 한 줄 소개 </Title>
            <SubTitle> 어쩌구저쩌구어쩌저자ㅓ이ㅏ저ㅣㅏㅓ이ㅏㅉㅈ </SubTitle>
          </TitleContainer>
          <InputBox defaultText="텍스트 입력" value={descriptionValue} onChange={e => setDescriptionValue(e.target.value)} />

          {/* 영업 시간 */}
          <TitleContainer ref={sectionRefs.openHours}>
            <Title> 영업 시간 </Title>
            <SubTitle> 어쩌구저쩌구어쩌저자ㅓ이ㅏ저ㅣㅏㅓ이ㅏㅉㅈ </SubTitle>
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
              dateData={Date}
              timeData={Time}
            />
          ))}

          {/* 대표 메뉴 */}
          <TitleContainer ref={sectionRefs.menu}>
            <Title> 대표 메뉴 </Title>
            <SubTitle> 어쩌구저쩌구어쩌저자ㅓ이ㅏ저ㅣㅏㅓ이ㅏㅉㅈ </SubTitle>
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
            <SubTitle> 어쩌구저쩌구어쩌저자ㅓ이ㅏ저ㅣㅏㅓ이ㅏㅉㅈ </SubTitle>
          </TitleContainer>
          <ButtonGroup>
            <TextButton $active={goalButtons.goal1} onClick={() => toggleGoalButton('goal1')}>신규 고객 유입</TextButton>
            <TextButton $active={goalButtons.goal2} onClick={() => toggleGoalButton('goal2')}>재방문 증가</TextButton>
            <TextButton $active={goalButtons.goal3} onClick={() => toggleGoalButton('goal3')}>재고 소진</TextButton>
            <TextButton $active={goalButtons.goal4} onClick={() => toggleGoalButton('goal4')}>피크타임 분산</TextButton>
            <TextButton $active={goalButtons.goal5} onClick={() => toggleGoalButton('goal5')}>SNS 홍보</TextButton>
            <TextButton $active={goalButtons.goal6} onClick={() => toggleGoalButton('goal6')}>리뷰 확보</TextButton>
            <TextButton $active={goalButtons.goalEtc} onClick={() => toggleGoalButton('goalEtc')}>기타</TextButton>
          </ButtonGroup>
          {goalButtons.goalEtc && (<InputBox defaultText="기타 입력" />)}

          {/* 평균 인당 매출 & 마진율 */}
          <SubColumn>
            <ColumnLayout>
              <TitleContainer ref={sectionRefs.revenue}>
                <Title> 평균 인당 매출 </Title>
                <SubTitle> 어쩌구저쩌구어쩌저자ㅓ이ㅏ저ㅣㅏㅓ이ㅏㅉㅈ </SubTitle>
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
                <SubTitle> 어쩌구저쩌구어쩌저자ㅓ이ㅏ저ㅣㅏㅓ이ㅏㅉㅈ </SubTitle>
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
                <SubTitle> 어쩌구저쩌구어쩌저자ㅓ이ㅏ저ㅣㅏㅓ이ㅏㅉㅈ </SubTitle>
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
                  dateData={Date}
                  timeData={Time}
                />
              ))}
            </ColumnLayout>
            <ColumnLayout>
              <TitleContainer ref={sectionRefs.free}>
                <Title> 한산한 시간대 </Title>
                <SubTitle> 어쩌구저쩌구어쩌저자ㅓ이ㅏ저ㅣㅏㅓ이ㅏㅉㅈ </SubTitle>
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
                  dateData={Date}
                  timeData={Time}
                />
              ))}
            </ColumnLayout>
          </SubColumn>

          {/* 추가 서비스 */}
          <TitleContainer ref={sectionRefs.extra}>
            <Title> 추가 제공 가능 서비스 </Title>
            <SubTitle> 어쩌구저쩌구어쩌저자ㅓ이ㅏ저ㅣㅏㅓ이ㅏㅉㅈ </SubTitle>
          </TitleContainer>
          <ButtonGroup>
            <TextButton $active={serviceButtons.service1} onClick={() => toggleServiceButton('service1')}>음료수</TextButton>
            <TextButton $active={serviceButtons.service2} onClick={() => toggleServiceButton('service2')}>사이드 메뉴</TextButton>
            <TextButton $active={serviceButtons.serviceEtc} onClick={() => toggleServiceButton('serviceEtc')}>기타</TextButton>
          </ButtonGroup>
          {serviceButtons.serviceEtc && <InputBox defaultText="기타 입력" />}
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
              V {item.label}
            </ProgressItem>
          ))}
        </ProgressList>
      </ProgressContainer>
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
  width: 1380px;
  margin: 0 auto;
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
`;

const MainContainer = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 10px;
  margin-top: 10px;
`;

const EditContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 50px 117px;
  border: 1px solid black;
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
  position: fixed;
  right: 80px;
  width: 327px;
  height: 587px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  z-index: 999;
  transition: top 0.1s ease-out; // 부드러운 움직임을 위한 transition
`;

const ProgressList = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;          // 아이템 간격
  margin: 0;          // 기본 여백 제거!
  padding: 0;
  width: 197px;
`;

const ProgressItem = styled.li`
  font-size: 20px;
  cursor: pointer;
  color: ${({ $filled }) => ($filled ? "#000000" : "#9C9C9C")};
  font-weight: 400;
  transition: color 0.2s;
  margin: 0;      // 혹시 li의 마진 생길 경우
  padding: 0;
  list-style: none;
`;


const SaveButton = styled.button`
    height: 85px;
    padding: 21px 102px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    align-self: stretch;
    border: 0px;
    color: black;
    font-size: 20px;
    font-weight: 600;
    line-height: normal;
    background-color: #D9D9D9;
    margin-bottom: 10px;
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