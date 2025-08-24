// TO DO LIST
// 1. 반응형 적용시켜야 하나,,?? 그러면 progresscontainer 위치 수정 필요

import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import InputBox from "../../components/common/inputs/InputBox";
import PhotoUpload from "../../components/common/inputs/PhotoUpload";
import useStudentStore from "../../stores/studentStore";
import { patchStudentProfile } from "../../services/apis/studentProfileApi";
import { FiSearch } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa6";
import { IoIosClose } from "react-icons/io";

const SECTIONS = [
  { key: "photo", label: "프로필 사진", refKey: "photo" },
  { key: "name", label: "이름", refKey: "name" },
  { key: "campus", label: "학교", refKey: "campus" },
];


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
          placeholder="대학명을 입력해주세요."
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSearchClick(); }}
          autoFocus
        />
        <SearchBtnBox onClick={handleSearchClick}>검색</SearchBtnBox>
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
                    <div styled={{fontWeight: 600}}><b>{campus.name}</b></div>
                    <div style={{fontWeight: 400}}>주소 {campus.address}</div>
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


const StudentEditMyPage = () => {
  const { id, profileId, name, university_name, image, setProfileInfo } = useStudentStore();

  const [photoState, setPhotoState] = useState(image ? [image] : []);
  const [campusName, setCampusName] = useState(university_name || "");
  const [nameValue, setNameValue] = useState(name);
  
  // 사진 상태 추적을 위한 변수들
  const [originalImage, setOriginalImage] = useState(image);
  const [imageDeleted, setImageDeleted] = useState(false);

  // 사진 삭제 처리 함수
  const handlePhotoDelete = (photoIndex) => {
    // 사진이 삭제되었음을 표시
    setImageDeleted(true);
    // 현재 상태에서 제거
    setPhotoState(prev => prev.filter((_, index) => index !== photoIndex));
  };

  const [showModal, setShowModal] = useState(false);
  const [showCampusModal, setShowCampusModal] = useState(false);

  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();

    const handleSave = async () => {
        if (!allFilled) {
            alert("아직 정보를 다 채우지 않았습니다!");
            return;
        } 

        const formData = new FormData();
        formData.append('name', nameValue);
        formData.append('university_name', campusName);
        
        // 백엔드 API 형식에 맞춰 사진 데이터 처리
        
        // 1. 사진이 삭제된 경우
        if (imageDeleted && photoState.length === 0) {
            formData.append('delete_image', 'true');
        }
        
        // 2. 새로 업로드된 사진이 있는 경우
        if (photoState.length > 0 && photoState[0] instanceof File) {
            formData.append('image', photoState[0]);
        }

        try {
            const updatedProfile = await patchStudentProfile(profileId, formData);
            setProfileInfo(updatedProfile.user);
            // setShowModal(true);
            navigate(`/student/mypage`);
        } catch (err) {
            alert("저장 중 오류 발생: " + err.message);
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
    const minTop = -148;
    const maxTop = 210;
    
    if (scrollY <= 0) return maxTop;
    if (scrollY >= 500) return minTop;
    
    const progress = Math.min(scrollY / 500, 1);
    return maxTop - (progress * (maxTop - minTop));
  };

  // 각 섹션별 ref (리스트 아이템 클릭했을 때 이동값값)
  const sectionRefs = {
    photo: useRef(),
    name: useRef(),
    campus: useRef(),
  };
  const scrollToSection = (key) => {
    sectionRefs[key].current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // 진행상황 체크 용도
  const isFilledText = val => typeof val === "string" && val.trim() !== "";
  const isFilledCampus = val => typeof val === "string" && val.trim() !== "";
  
  // 사진 섹션: 사진이 있거나 삭제된 경우 모두 완료로 간주
  const isPhotoFilled = photoState.length > 0 || imageDeleted;

  const isSectionFilled = {
    photo: isPhotoFilled,
    name: isFilledText(nameValue),
    campus: isFilledCampus(campusName),
  };
  const allFilled = Object.values(isSectionFilled).every(Boolean);

  // ----------- 렌더링 -----------
  return (
    <PageContainer>

      <TitleContainer>
        <Title> 프로필 수정정 </Title>
        <SubTitle> 프로필필 정보를 입력해주세요. </SubTitle>
      </TitleContainer>

      <MainContainer>
        <EditContainer>
            <EditTitle>기본 정보</EditTitle>

          <TitleContainer ref={sectionRefs.photo}>
            <Title> 프로필 사진 </Title>
            <SubTitle> 프로필 사진을 자유롭게 등록해주세요. (최대 1장) </SubTitle>
          </TitleContainer>
          <PhotoUpload 
            value={photoState} 
            onChange={setPhotoState} 
            onDelete={handlePhotoDelete}
            maxCount={1} 
          />

          <TitleContainer ref={sectionRefs.name}>
            <Title> 이름 </Title>
            <SubTitle> 이름을 입력해 주세요. </SubTitle>
          </TitleContainer>
          <InputBox defaultText="텍스트 입력" value={nameValue} onChange={e => setNameValue(e.target.value)} />

          {/* 주변 캠퍼스 */}
          <TitleContainer ref={sectionRefs.campus}>
            <Title> 학교 </Title>
             <SubTitle>소속 대학을 입력해 주세요.</SubTitle>
          </TitleContainer>
          <SearchCampusButton 
            onClick={() => setShowCampusModal(true)}
          > {campusName ? campusName : "대학 검색"} <SearchIcon /></SearchCampusButton>
          <CampusSearchModal
            visible={showCampusModal}
            onClose={() => setShowCampusModal(false)}
            onSelect={campus => {
              setCampusName(campus.name);
              setShowCampusModal(false);
            }}
          />
        </EditContainer>
      </MainContainer>

      {/* 우측 진행상황/저장 - MainContainer 밖으로 이동 */}
      <ProgressContainer style={{ top: getProgressContainerTop() }}>
        <SaveButton onClick={handleSave}>
          저장하기
        </SaveButton>
        <ProgressList>
          <EditTitle style={{color: "#1A2D06"}}>기본 정보</EditTitle>
          {SECTIONS.map((item) => (
            <ProgressItem
              key={item.key}
              $filled={isSectionFilled[item.key]}
              onClick={() => scrollToSection(item.refKey)}
            >
              <FaCheck /> {item.label}
            </ProgressItem>
          ))}
        </ProgressList>
      </ProgressContainer>
        {/* {showModal && (
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
            )} */}
    </PageContainer>
  );
};

export default StudentEditMyPage;

const PageContainer = styled.div`
  width: 100%;
  margin: 0 auto;
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
`;

const EditTitle = styled.div`
    color: var(--main-main600, #64A10F);
    font-family: Pretendard;
    font-size: 24px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
`;

const MainContainer = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 10px;
  margin-top: 10px;
  position: relative;
`;

const EditContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 50px 117px;
  align-items: start;
  background: #F4F4F4;
  top: 148px;
  left: 30px;
  border-radius: 5px;

`;

const ProgressContainer = styled.div`
  position: fixed;
  right: 45px;
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
//   width: 197px;
  align-self: stretch;
`;

const ProgressItem = styled.li`
    font-family: Pretendard;
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  cursor: pointer;
  color: ${({ $filled }) => ($filled ? "#64A10F" : "#898989")};
  transition: color 0.2s;
  margin: 0;      // 혹시 li의 마진 생길 경우
  padding: 0;
  list-style: none;
`;


const SaveButton = styled.button`
    display: flex;
    width: 327px;
    height: 85px;
    padding: 21px 102px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    align-self: stretch;
    color: var(--main-main100, #E9F4D0);
    font-family: Pretendard;
    font-size: 20px;
    font-weight: 600;
    line-height: normal;
    margin-bottom: 21px;
    border-radius: 5px;
    border: 0px;
    background: var(--main-main600, #64A10F);
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
  height: 30px;
  background: none;
  border: none;
  font-size: 24px;
  color: #222222;
  cursor: pointer;
  storke-width: 2;
  &:hover { opacity: 80%; }
`;