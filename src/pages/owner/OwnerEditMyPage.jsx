// To Do list
// 1. 기본 데이터 넣어놓고 수정이 되는지 확인 (V)
// 2. 시간 + - 독립적으로 작동하는지 확인 (V)
// 3. ?? DatePicker: 요일 사이즈 늘리고 시간 사이즈 줄이기 피드백 받기 (V)
// 4. ?? 오른쪽 리스트 고정시키긴 했는데, 지금 내 컴 기준으로 리스트가 다 안 보여서 맨 밑에 요소 확인 불가 피드백 받기 (미해결)
// 5. 프로필 수정 페이지에 있을 때, 메뉴 '프로필' 표시돼야 함 (V)
// 6. ?? 대학 검색의 경우, (시현이가 원하는 대로면) 아마 외부 api 가져와서 해야할 것 같은데,, 이거 백엔드가 해주는 건가?? (미해결)

import React, { useRef, useState } from "react";
import Header from "../../components/common/layout/Header";
import styled from "styled-components";
import Menu from "../../components/common/layout/Menu";
import { Dropdown } from "../../components/common/inputs/Dropdown";
import InputBox from "../../components/common/inputs/InputBox";
import PhotoUpload from "../../components/common/inputs/PhotoUpload";
import PhotoUploadWithInput from "../../components/common/inputs/PhotoUploadWithInput";
import DatePicker from "../../components/common/inputs/DatePicker";

// ---- 샘플 데이터 ----
const sampleUniversity = { data: ["중앙대학교", "숭실대학교", "서울대학교"] };
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
  { key: "extra", label: "추가 서비스", refKey: "extra" },
  { key: "revenue", label: "평균 인당 매출", refKey: "revenue" },
  { key: "margin", label: "마진율", refKey: "margin" },
  { key: "busy", label: "바쁜 시간대", refKey: "busy" },
  { key: "free", label: "한산한 시간대", refKey: "free" },
];

// 임의로 채운 !!! 예시 데이터 !!!
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

const OwnerEditMyPage = () => {
  // 1. 예시 데이터로 값 채우기
  const [photoState, setPhotoState] = useState(samplePhoto);
  const [campusValue, setCampusValue] = useState("중앙대학교");
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

  // 각 섹션별 ref
  const sectionRefs = {
    photo: useRef(),
    campus: useRef(),
    type: useRef(),
    name: useRef(),
    description: useRef(),
    openHours: useRef(),
    menu: useRef(),
    goal: useRef(),
    extra: useRef(),
    revenue: useRef(),
    margin: useRef(),
    busy: useRef(),
    free: useRef(),
  };
  const scrollToSection = (key) => {
    sectionRefs[key].current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // 2. 진행상황 체크
  const isFilledText = val => typeof val === "string" && val.trim() !== "";
  const isFilledList = arr => Array.isArray(arr) && arr.length > 0;
  const isFilledSchedule = arr => Array.isArray(arr) && arr.some(v => v.day && v.start && v.end);
  const isFilledButtons = obj => obj && Object.values(obj).some(Boolean);

  const isSectionFilled = {
    photo: isFilledList(photoState),
    campus: isFilledText(campusValue),
    type: isFilledText(typeValue),
    name: isFilledText(nameValue),
    description: isFilledText(descriptionValue),
    openHours: isFilledSchedule(openHours),
    menu: isFilledList(menuList),
    goal: isFilledButtons(goalButtons),
    extra: isFilledButtons(serviceButtons),
    revenue: isFilledText(revenueValue),
    margin: isFilledText(marginValue),
    busy: isFilledSchedule(busyHours),
    free: isFilledSchedule(freeHours),
  };
  const allFilled = Object.values(isSectionFilled).every(Boolean);

  // 3. 저장 로직
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
      <Header />
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
          <Dropdown props={sampleUniversity} value={campusValue} onChange={setCampusValue} />

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

        {/* 우측 진행상황/저장 */}
        <ProgressContainer>
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
                {/* 체크 표시할 만한 기호를 못 찾음,, 벡터를 넣거나 다른 형식 필요할 듯 */}
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
      </MainContainer>
    </PageContainer>
  );
};

export default OwnerEditMyPage;

const PageContainer = styled.div`
  margin: 30px;
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
  grid-template-columns: 1029px 327px;
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
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ $active }) => ($active ? "#c0c0c0" : "#f0f0f0")};
  }
`;

const ColumnLayout = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProgressContainer = styled.div`
  position: fixed; // 아예 이 부분을 고정시켜버림
  left: 1083px;
  top: 207px;
  width: 327px;
  height: 587px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;  // ← 저장하기 버튼과 리스트 align 맞춤!
  z-index: 999;
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
