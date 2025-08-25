import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import InputBox from "../../components/common/inputs/InputBox";
import PhotoUpload from "../../components/common/inputs/PhotoUpload";
import { FaCheck } from "react-icons/fa6";
import useUserStore from "../../stores/userStore";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { editGroupProfile, fetchGroupProfile } from "../../services/apis/groupProfileAPI";
import PeriodPicker from "../../components/common/inputs/PeriodPicker";
import { IoIosClose } from "react-icons/io";
import MenuGroup from "../../layout/MenuGroup";

const SECTIONS = [
  { type: "section", label: "기본 정보" },
  { key: "photo", label: "대표 사진", refKey: "photo" },
  { key: "campus", label: "대학", refKey: "campus" },
  { key: "department", label: "소속", refKey: "department" },
  { key: "position", label: "직책", refKey: "position" },
  { key: "students", label: "소속 단위 학생 수", refKey: "students" },
  { key: "term", label: "임기", refKey: "term" },
  { type: "section", label: "제휴 관련 정보" },  
  { key: "period", label: "제휴 기간", refKey: "period" },
];

const sampleCampus = '중앙대학교';

// const sampleCampus = {
//   name: '중앙대학교',
//   address: "서울특별시 동작구 흑석로 84 (흑석동, 중앙대학교)",
// };

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
      <CloseRow>
        <ModalCloseBtn onClick={onClose} />
      </CloseRow>
      <ModalHeader>대학 검색</ModalHeader>
      <SearchRow>
        <ModalInput
          placeholder="대학 검색"
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
    </ModalContainer>
  </ModalOverlay>
  ) : null;
}


const GroupEditMyPage = () => {
  const [photoState, setPhotoState] = useState([]);
  const [campusValue, setCampusValue] = useState(sampleCampus);
  const [department, setDepartment] = useState("");
  const [councilName, setCouncilName] = useState("");
  const [position, setPosition] = useState("");
  const [students, setStudents] = useState(0);
  const [term, setTerm] = React.useState({
    startYear: "", startMonth: "",
    endYear: "", endMonth: "",
  });
  const [period, setPeriod] = React.useState({
    startYear: "", startMonth: "", startDay: "",
    endYear: "", endMonth: "", endDay: ""
  });

  // 사진 ID 추적을 위한 상태 추가
  const [originalPhotos, setOriginalPhotos] = useState([]);
  const [deletedPhotoIds, setDeletedPhotoIds] = useState([]);

    const handlePeriodChange = (field, val) => {
        setPeriod(prev => ({
            ...prev,
            [field]: val
        }));
    };

  const [showCampusModal, setShowCampusModal] = useState(false);

  const [profileId, setProfileId] = useState(null);
  const navigate = useNavigate();
  const { userId } = useUserStore();


  function makeDateString(year, month, day='01') {
    if (!year || !month || !day) return ""; // 값 없으면 빈 문자열 반환

    // month, day를 항상 두 자리로 포맷 (예: '08', '21')
    const mm = month.toString().padStart(2, '0');
    const dd = day.toString().padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  }

  // 사진 데이터 변환 (조회용)
  const storePhotoUrls = (photos) => {
    if (!photos) return [];
    return photos.map(photo => ({
      id: photo.id,
      image: photo.image
    }));
  }

  function parseDateString(dateStr) {
    if (!dateStr) return { year: "", month: "", day: "" };
    const [year, month, day] = dateStr.split("-");
    return { year, month, day };
  }    

  // 사진 삭제 처리 함수
  const handlePhotoDelete = (photoIndex) => {
    const photo = photoState[photoIndex];
    
    // 원본 사진인 경우 ID를 삭제 목록에 추가
    if (photo && photo.id) {
      setDeletedPhotoIds(prev => [...prev, photo.id]);
    }
    
    // 현재 상태에서 제거
    setPhotoState(prev => prev.filter((_, index) => index !== photoIndex));
  };

  // 학생 단체 프로필 조회 
  useEffect(() => {
    const fetchProfile = async () => { 
      try {
        const groupId = userId;
        const data = await fetchGroupProfile(groupId);
        console.log(data);

        // 원본 사진 데이터 저장 (ID 추적용) - 화면 표시용으로 변환
        setOriginalPhotos(storePhotoUrls(data.photos));

        const termStart = parseDateString(data.term_start);
        const termEnd = parseDateString(data.term_end);
        const periodStart = parseDateString(data.partnership_start);
        const periodEnd = parseDateString(data.partnership_end);

        setPhotoState(storePhotoUrls(data.photos));
        setCampusValue(data.university_name);
        setDepartment(data.council_name);
        setCouncilName(data.department);
        setPosition(data.position);
        setStudents(data.student_size);
        setTerm({
            startYear: termStart.year,
            startMonth: termStart.month,
            endYear: termEnd.year,
            endMonth: termEnd.month,
        });
        setPeriod({
            startYear: periodStart.year,
            startMonth: periodStart.month,
            startDay: periodStart.day,
            endYear: periodEnd.year,
            endMonth: periodEnd.month,
            endDay: periodEnd.day,
        });
     
        // 수정용 프로필 id
        setProfileId(data.id);

      } catch (error) {
        console.error("프로필 데이터 조회 실패:", error);
      }
    };
    fetchProfile();
  }, []);


  const handleProfileUpdate = async () => {
    try {
      
      const formData = new FormData();
      
      // 삭제할 사진 ID 목록 추가
      deletedPhotoIds.forEach(photoId => {
        formData.append('photos_to_delete', photoId);
      });
      
      // 새로 추가할 사진 파일들 (기존 사진이 아닌 새로운 파일들만)
      const newPhotos = photoState.filter(photo => 
        !photo.id // ID가 없으면 새로 추가된 사진
      );
      newPhotos.forEach(photo => {
        formData.append('new_photos', photo.image || photo);
      });
      
      // 텍스트 데이터 추가
      formData.append('university_name', campusValue);
      formData.append('department', department);
      formData.append('council_name', councilName);
      formData.append('position', position);
      formData.append('student_size', students);
      formData.append('term_start', makeDateString(term.startYear, term.startMonth));
      formData.append('term_end', makeDateString(term.endYear, term.endMonth));
      formData.append('partnership_start', makeDateString(period.startYear, period.startMonth, period.startDay));
      formData.append('partnership_end', makeDateString(period.endYear, period.endMonth, period.endDay));
      
      console.log("FormData 내용:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      
      await editGroupProfile(profileId, formData);
      alert("프로필 수정 완료!");

    } catch (error) {
      console.error("프로필 수정 실패:", error);
      console.log(localStorage.getItem("accessToken"));
      console.log(profileId);
    
    }
  };



  // 각 섹션별 ref (리스트 아이템 클릭했을 때 이동값값)
  const sectionRefs = {
    photo: useRef(),
    campus: useRef(),
    department: useRef(),
    councilName: useRef(),
    position: useRef(),
    students: useRef(),
    term: useRef(),
    period: useRef(),
  };

  const scrollToSection = (key) => {
    sectionRefs[key].current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // 진행상황 체크 용도
  const isFilledText = val => typeof val === "string" && val.trim() !== "";
  const isFilledList = arr => Array.isArray(arr) && arr.length > 0;
  const isFilledCampus = val => typeof val === "string" && val.trim() !== "";  
  const isFilledNum = val => !isNaN(val) && val > 0;
  const isFilledTerm = (term) =>
    !!term.startYear && !!term.startMonth &&
    !!term.endYear && !!term.endMonth;
  const isFilledPeriod = (period) =>
    !!period.startYear && !!period.startMonth && !!period.startDay &&
    !!period.endYear && !!period.endMonth && !!period.endDay;


  const isSectionFilled = {
    photo: isFilledList(photoState),
    campus: isFilledCampus(campusValue),
    department: isFilledText(department),
    councilName: isFilledText(councilName),
    position: isFilledText(position),
    students: isFilledNum(students),
    term: isFilledTerm(term),
    period: isFilledPeriod(period),
  };

  const allFilled = Object.values(isSectionFilled).every(Boolean);

  // 저장 로직
  const handleSave = async() => {
    if (!allFilled) {
      alert("아직 정보를 다 채우지 않았습니다!");
    } else {
      try {
        await handleProfileUpdate();
        // setShowModal(true);
        navigate('/student-group/mypage');
      } catch (error) {
        console.error("프로필 수정 실패 :", error);
      }
    }
  };


  // ----------- 렌더링 -----------
  return (
    <PageContainer>
      <MenuGroup />
      <TitleContainer>
        <Title> 제휴 프로필 설정 </Title>
        <SubTitle> 우리 학생회에 딱 맞는 제휴 조건을 찾기 위해 정보를 입력해주세요. </SubTitle>
      </TitleContainer>
      <ContentSection>
      <MainContainer>
        <EditContainer>
          <EditTitle>기본 정보</EditTitle>
          {/* 대표 사진 */}
          <TitleContainer ref={sectionRefs.photo}>
            <Title> 대표 사진 </Title>
            <SubTitle> 학생단체 대표 사진(로고, 단체사진 등)을 자유롭게 등록해 주세요. (최대 2장) </SubTitle>
          </TitleContainer>
          <PhotoUpload 
            value={photoState} 
            onChange={setPhotoState} 
            onDelete={handlePhotoDelete}
            maxCount={2}
          />

          {/* 학교 */}
          <TitleContainer ref={sectionRefs.campus}>
            <Title> 학교 </Title>
             <SubTitle>소속 대학을 입력해 주세요.</SubTitle>
          </TitleContainer>
          <SearchCampusButton 
            onClick={() => setShowCampusModal(true)}
          > {campusValue ? campusValue : "대학 검색"} <SearchIcon /></SearchCampusButton>
          <CampusSearchModal
            visible={showCampusModal}
            onClose={() => setShowCampusModal(false)}
            onSelect={campus => {
              setCampusValue(campus.name);
              setShowCampusModal(false);
            }}
          />

          {/* 소속 */}
          <TitleContainer ref={sectionRefs.department}>
            <Title> 소속 </Title>
            <SubTitle> 소속을 입력해 주세요. 예) 제37대 경영학부 학생회, 영화제작동아리</SubTitle>
          </TitleContainer>
          <InputBox defaultText="텍스트 입력" value={department} onChange={e => setDepartment(e.target.value)} />

          {/* 단체명 */}
          <TitleContainer ref={sectionRefs.councilName}>
            <Title> 단체명 </Title>
            <SubTitle> 단체명을 입력해 주세요. 예) 다움, 반영 </SubTitle>
          </TitleContainer>
          <InputBox defaultText="텍스트 입력" value={councilName} onChange={e => setCouncilName(e.target.value)} />

          {/* 직책 */}
          <TitleContainer ref={sectionRefs.position}>
            <Title> 직책 </Title>
            <SubTitle> 해당 소속에서 제휴 관련 담당자의 직책을 입력해 주세요. 예) 기획국원, 회장, 사업국장 </SubTitle>
          </TitleContainer>
          <InputBox defaultText="텍스트 입력" value={position} onChange={e => setPosition(e.target.value)} />

          {/* 학생 수 */}
          <TitleContainer ref={sectionRefs.students}>
            <Title> 소속 단위 학생 수 </Title>
            <SubTitle> 해당 학생단체에 속한 학생 수를 입력해 주세요.</SubTitle>
          </TitleContainer>
          <InputBox defaultText="숫자 입력" type='number' value={students} onChange={e => setStudents(e.target.value)} unit="명"/>

          {/* 임기 */}
          <TitleContainer ref={sectionRefs.term}>
            <Title> 임기 </Title>
            <SubTitle> 해당 학생단체의 임기를 입력해 주세요. </SubTitle>
          </TitleContainer>
          <PeriodPicker
            value={term}
            onChange={(sy, sm, ey, em) => handlePeriodChange(sy, sm, ey, em, setTerm)}
            withDay={false}
          />

          <EditTitle style={{marginTop: '60px'}}> 제휴 관련 정보</EditTitle>
          
          {/* 제휴 기간 */}
          <TitleContainer ref={sectionRefs.period}>
            <Title> 제휴 기간 </Title>
            <SubTitle> 제휴하고자 하는 기간을 입력해 주세요. </SubTitle>
          </TitleContainer>
          <PeriodPicker
            value={period}
            onChange={(sy, sm, sd, ey, em, ed) => handlePeriodChange(sy, sm, sd, ey, em, ed, setPeriod)}
            withDay={true}
          />
        </EditContainer>
        
        {/* 우측 진행상황/저장 */}
        <ProgressContainer>
        <SaveButton onClick={handleSave}>
          저장하기
        </SaveButton>
        <ProgressList>
          {SECTIONS.map((item) =>
            item.type === "section" ? (
              <SectionHeader key={item.label}>{item.label}</SectionHeader>
            ) : (
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
      </MainContainer>
      </ContentSection>
    </PageContainer>
  );
};

export default GroupEditMyPage;

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
  margin-bottom: 10px;
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
  display: flex;
  gap: 40px;
  margin-top: 10px;
  position: relative;
  align-items: flex-start;
`;

const EditContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 50px 180px 50px 117px;
  align-items: start;
  background: #F4F4F4;
  border-radius: 5px;
  flex: 1;
`;

const EditTitle = styled.div`
    color: var(--main-main600, #64A10F);
    font-family: Pretendard;
    font-size: 24px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
`;

const ProgressContainer = styled.div`
  position: sticky;
  top: 80px;
  width: 327px;
  height: 587px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  z-index: 999;
  max-height: calc(100vh - 100px);
  flex-shrink: 0;
`;

const ProgressList = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;          // 아이템 간격
  margin: 0;          // 기본 여백 제거!
  padding: 0;
//   width: 197px;
  align-self: stretch;
//   display: flex;
//   flex-direction: column;
//   align-items: flex-start;
//   gap: 15px;          // 아이템 간격
//   margin: 0;          // 기본 여백 제거!
//   padding: 0;
//   width: 197px;
// justify-content: flex-start;

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

const SectionHeader = styled.div`
color:  #1A2D06;
font-family: Pretendard;
font-size: 24px;
font-style: normal;
font-weight: 600;
line-height: normal;
margin-top: 35px;
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
height: 70px;
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

const ModalBtn = styled.button`
    display: flex;
    width: 90px;
    padding: 10px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border: 1px solid #1A2D06;
    cursor: pointer;
    background: #F8F8F8;
`;

const SearchCampusButton = styled.button`
    display: flex;
    width: 210px;
    padding: 10px;
    align-items: center;
    gap: 10px;
  position: relative;
  margin-top: 10px;
    border-radius: 5px;
    border: 1px solid  #898989;
    background: #FFF;

    color:  #898989;
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  

  &:hover {
    opacity: 80%;
  }
`;

const SearchIcon = styled(FiSearch)`
  width: 24px;
  position: absolute;
  right: 9px;
  top: 7px;
  height: 24px;
  overflow: hidden;
  flex-shrink: 0;
  z-index: 1;
  color: #898989;
`;

// 모달 박스
const ModalContainer = styled.div`
    display: flex;
    width: 600px;
    height: 402px;
    max-height: 560px;
    padding: 20px 63px 100px 63px;
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
    flex-shrink: 0;
    border-radius: 5px;
    background: #FFF;
`;

const ModalHeader = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #1A2D06;
  margin-bottom: 10px;
`;

const SearchRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  // justify-content: center;
  gap: 8px;
  margin-bottom: 40px;
`;

const ModalInput = styled.input`
    display: flex;
    flex: 1 1 0;
    height: 40px;
    padding: 0 10px;
    align-items: center;
    gap: 10px;
    border-radius: 5px;
    border: 1px solid var(--main-main950, #1A2D06);
    background: #fff;
    color: var(--, #898989);
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`;

const SearchBtnBox = styled.div`
    display: flex;
    width: 105px;
    height: 40px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 5px;
    background: var(--main-main600, #64A10F);
    color: var(--main-main100, #E9F4D0);
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    cursor: pointer;
    user-select: none;
    &:hover { opacity: 80%; }
`;

const ResultList = styled.div`
  display: flex;
  flex-direction: column;
  width: 600px; // 
  gap: 10px;
  margin-top: 14px;
  max-height: 200px;
  overflow-y: auto;

  scrollbar-width: thin;
  scrollbar-color: #888 #eee;
`;

const ResultItem = styled.div`
    display: flex;
    height: 80px;
    flex: 1;
    padding: 20px;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 10px;
    align-self: stretch;
    border-radius: 5px;
    border: 1px solid  #898989;

    color: #1A2D06;
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    line-height: normal;

  // background: ${({ selected }) => (selected ? "#fff" : "#64A10F")};
  cursor: pointer;
  transition: background 0.15s, border 0.14s;
  //  margin-right: 5px;
  &:hover { background: #64A10F; border-color: #FFF; color:#E9F4D0; }
`;

// 닫기(X) 버튼
const CloseRow = styled.div`
  display: flex;
  flex-direction: row-reverse;
  width: 100%;
  // align-items: end;
  align-self: stretch;
  margin-top: 10px;
`;

const ModalCloseBtn = styled(IoIosClose)`
  width: 30px;
  height: 24px;
  background: none;
  border: none;
  font-size: 24px;
  color: #222222;
  cursor: pointer;
  storke-width: 2;
  &:hover { opacity: 80%; }
`;

const ContentSection = styled.div`
display: flex;
flex-direction: row;
gap: 24px;
`;