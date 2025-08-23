// TO DO LIST
// 1. (백이랑) partnership_goal이 여러 개일 경우 제대로 fetch 안 되는 중 수정 필요
// 2. (백한테 확인 받아야 함) 이미지 잘 들어가는지 확인

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
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { IoIosClose } from "react-icons/io";

// ---- 샘플 데이터 ----
const sampleType = { data: ["일반 음식점", "카페", "술집", "기타"] };
const Day = { data: ["월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"] };
const Time = {
  data: Array.from({ length: 48 }, (_, i) => {
    const hour = String(Math.floor(i / 2)).padStart(2, "0");
    const min = i % 2 === 0 ? "00" : "30";
    return `${hour}:${min}`;
  }),
};

const SECTIONS = [
  { type: "section", label: "기본 정보" },
  { key: "photo", label: "대표 사진", refKey: "photo" },
  { key: "campus", label: "주변 캠퍼스", refKey: "campus" },
  { key: "type", label: "업종", refKey: "type" },
  { key: "contact", label: "연락처", refKey: "contact" },
  { key: "name", label: "상호명", refKey: "name" },
  { key: "comment", label: "한 줄 소개", refKey: "comment" },
  { key: "openHours", label: "영업 시간", refKey: "openHours" },
  { key: "menu", label: "대표 메뉴", refKey: "menu" },
  { type: "section", label: "제휴 관련 정보" },
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

const initialGoalButtons = { 
  goal_new_customers: false, 
  goal_revisit: false, 
  goal_clear_stock: false, 
  goal_spread_peak: false, 
  goal_sns_marketing: false, 
  goal_collect_reviews: false, 
  goal_other: false
};

const ServiceButtons = { service_drink: false, service_side_menu: false, service_other: false };
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


const OwnerEditMyPage = () => {
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

  const [goalButtons, setGoalButtons] = useState(initialGoalButtons);
  const [serviceButtons, setServiceButtons] = useState(ServiceButtons);
  
  // 기타 입력 폼 저장용
  const [otherServiceValue, setOtherServiceValue] = useState("");
  const [otherGoalValue, setOtherGoalValue] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showCampusModal, setShowCampusModal] = useState(false);

  const [scrollY, setScrollY] = useState(0);

  const [profileId, setProfileId] = useState(null);
  const navigate = useNavigate();

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



  const convertToApiBusiness = (data) => {
    const toBusinessType = {
      카페: "CAFE",
      '일반 음식점': "RESTAURANT",
      술집: "BAR",
    };

    return toBusinessType[data] || data;

  };

  // 사진 데이터 변환 (조회용)
  const storePhotoUrls = (photos) => {
    if ( !photos) return [];
    return photos.map(photo => photo.image);
    }

  const parsePhotos = (photos) => {
    const formData = new FormData();

    photos.forEach((photo, idx) => {
      formData.append("photos", photo);
      formData.append("orders", idx);
    });

    return formData;
  };

  // const formData = new FormData();
  // photos.forEach((p, i) => {
  //   formData.append("photos", p.file);
  //   formData.append("orders", p.order);
  // });


  // const parsePhotos = (photos) => photos.map((file, index) => ({
  //   file: file,
  //   order: index,
  // }));      

  // 사장님 프로필 조회 
  useEffect(() => {
    const fetchProfile = async () => { 
      try {
        const ownerId = userId;
        const data = await getOwnerProfile(ownerId);
        console.log(data);

        const parsedMenus = data.menus.map(menu => ({
          file: menu.image || "",
          value1: menu.name || "",
          value2: menu.price ? String(menu.price) : "",
        }));

        setCommentValue(data.comment);
        setNameValue(data.profile_name);
        setContactValue(data.contact);
        setTypeValue(businessTypeMap[data.business_type]);
        setRevenueValue(data.average_sales);
        setMarginValue(data.margin_rate);
        setOpenHours(parseSchedule(data.business_day));
        setBusyHours(parseSchedule(data.peak_time));
        setFreeHours(parseSchedule(data.off_peak_time));
        setPhotoState(storePhotoUrls(data.photos));
        setMenuList(parsedMenus);
        // 서버에서 받은 개별 boolean 필드들 확인
        //  console.log("서버에서 받은 service_other:", data.service_other);
        //  console.log("서버에서 받은 goal_other:", data.goal_other);
         
         // 개별 boolean 필드들로 직접 설정
         setServiceButtons({
           service_drink: Boolean(data.service_drink),
           service_side_menu: Boolean(data.service_side_menu),
           service_other: Boolean(data.service_other)
         });
         
         setGoalButtons({
           goal_new_customers: Boolean(data.goal_new_customers),
           goal_revisit: Boolean(data.goal_revisit),
           goal_clear_stock: Boolean(data.goal_clear_stock),
           goal_spread_peak: Boolean(data.goal_spread_peak),
           goal_sns_marketing: Boolean(data.goal_sns_marketing),
           goal_collect_reviews: Boolean(data.goal_collect_reviews),
           goal_other: Boolean(data.goal_other)
         });
         setOtherServiceValue(data.service_other_detail || '');
         setOtherGoalValue(data.goal_other_detail || '');
        

        // 수정용 프로필 id
        setProfileId(data.id);
        // console.log("메뉴",data.menus);

      } catch (error) {
        console.error("프로필 데이터 조회 실패:", error);
        
      }
    };
    fetchProfile();
  }, []);

  // 프로필 수정 - 새로운 boolean 형식으로 전송

  const handleProfileUpdate = async () => {
    try {
      
      const formData = new FormData();
      
      // 사진 데이터 추가
      photoState.forEach((photo, index) => {
        formData.append('photos', photo);
        formData.append('orders', index);
      });
      
      // 메뉴 사진 데이터 추가
      menuList.forEach((menu, index) => {
        formData.append('menus', menu);
        formData.append('menu_orders', index);
      });
      
      // 텍스트 데이터 추가
      formData.append('profile_name', nameValue);
      formData.append('comment', commentValue);
      formData.append('contact', contactValue);
      formData.append('campus_name', campusValue || '');
      formData.append('business_day', JSON.stringify(convertToApiFormat(openHours)));
      formData.append('business_type', convertToApiBusiness(typeValue));
      formData.append('average_sales', Number(revenueValue));
      formData.append('margin_rate', marginValue);
             formData.append('peak_time', JSON.stringify(convertToApiFormat(busyHours)));
       formData.append('off_peak_time', JSON.stringify(convertToApiFormat(freeHours)));
       
               // 새로운 boolean 형식으로 서비스 데이터 전송
        formData.append('service_drink', serviceButtons.service_drink);
        formData.append('service_side_menu', serviceButtons.service_side_menu);
        formData.append('service_other', serviceButtons.service_other);
        formData.append('service_other_detail', serviceButtons.service_other ? otherServiceValue : '');
        
        // 새로운 boolean 형식으로 목표 데이터 전송
        formData.append('goal_new_customers', goalButtons.goal_new_customers);
        formData.append('goal_revisit', goalButtons.goal_revisit);
        formData.append('goal_clear_stock', goalButtons.goal_clear_stock);
        formData.append('goal_spread_peak', goalButtons.goal_spread_peak);
        formData.append('goal_sns_marketing', goalButtons.goal_sns_marketing);
        formData.append('goal_collect_reviews', goalButtons.goal_collect_reviews);
        formData.append('goal_other', goalButtons.goal_other);
        formData.append('goal_other_detail', goalButtons.goal_other ? otherGoalValue : '');
      
      console.log("FormData 내용: ", FormData);
      // for (let [key, value] of formData.entries()) {
      //   console.log(key, value);
      // }
      
      await editOwnerProfile(profileId, formData);
      alert("프로필 수정 완료!");
    } catch (error) {
      console.error("프로필 수정 실패:", error);
      // console.log(localStorage.getItem("accessToken"));
      // console.log(profileId);
    
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
    const minTop = -130;
    const maxTop = 250;
    
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
  const isFilledCampus = val => typeof val === "string" && val.trim() !== "";  
  const isFilledNum = val => typeof val === "number" && !isNaN(val) && val > 0;

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
    revenue: isFilledNum(revenueValue),
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
        // setShowModal(true);
        navigate('/owner/mypage');
      } catch (error) {
        console.error("프로필 수정 실패 :", error);
      }
    }
  };

  // 버튼 토글
  const toggleGoalButton = (key) => {
    setGoalButtons(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
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
          <EditTitle>기본 정보</EditTitle>
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
          > {campusValue ? campusValue : "대학 검색"} <SearchIcon /></SearchCampusButton>
          <CampusSearchModal
            visible={showCampusModal}
            onClose={() => setShowCampusModal(false)}
            onSelect={campus => {
              setCampusValue(campus.name);
              setShowCampusModal(false);
            }}
          />
          <SubSubColumn>
            <ColumnLayout>
              <TitleContainer ref={sectionRefs.type}>
                <Title> 업종 </Title>
                <SubTitle> 가게의 업종을 선택해 주세요. </SubTitle>
              </TitleContainer>
              <Dropdown props={sampleType} value={typeValue} onChange={setTypeValue} width="100%"/>
            </ColumnLayout>
            <ColumnLayout>
              <TitleContainer ref={sectionRefs.name}>
                <Title> 상호명 </Title>
                <SubTitle> 가게의 상호명을 입력해 주세요. </SubTitle>
              </TitleContainer>
              <InputBox defaultText="상호명 입력" value={nameValue} onChange={e => setNameValue(e.target.value)} width="100%"/>
            </ColumnLayout>
          </SubSubColumn>
          

          <TitleContainer ref={sectionRefs.contact}>
          <Title> 연락처 </Title>
            <SubTitle> 가게의 연락처를 입력해 주세요. 가게의 프로필에 표시돼요. </SubTitle>
          </TitleContainer>
          <InputBox defaultText="텍스트 입력" value={contactValue} onChange={e => setContactValue(e.target.value)} />
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
              inputPlaceholder2="0,000원"
              value={menuList}
              onChange={setMenuList}
            />
          </TitleContainer>

          <EditTitle style={{marginTop: '60px'}}> 제휴 관련 정보</EditTitle>
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
             <TextButton $active={goalButtons.goal_new_customers} onClick={() => toggleGoalButton('goal_new_customers')}>신규 고객 유입</TextButton>
             <TextButton $active={goalButtons.goal_revisit} onClick={() => toggleGoalButton('goal_revisit')}>재방문 증가</TextButton>
             <TextButton $active={goalButtons.goal_clear_stock} onClick={() => toggleGoalButton('goal_clear_stock')}>재고 소진</TextButton>
             <TextButton $active={goalButtons.goal_spread_peak} onClick={() => toggleGoalButton('goal_spread_peak')}>피크타임 분산</TextButton>
             <TextButton $active={goalButtons.goal_sns_marketing} onClick={() => toggleGoalButton('goal_sns_marketing')}>SNS 홍보</TextButton>
             <TextButton $active={goalButtons.goal_collect_reviews} onClick={() => toggleGoalButton('goal_collect_reviews')}>리뷰 확보</TextButton>
             <TextButton $active={goalButtons.goal_other} onClick={() => toggleGoalButton('goal_other')}>기타</TextButton>
           </ButtonGroup>
           {goalButtons.goal_other &&  
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
                defaultText="숫자"
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
                defaultText="숫자"
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
             <TextButton $active={serviceButtons.service_drink} onClick={() => toggleServiceButton('service_drink')}>음료수</TextButton>
             <TextButton $active={serviceButtons.service_side_menu} onClick={() => toggleServiceButton('service_side_menu')}>사이드 메뉴</TextButton>
             <TextButton $active={serviceButtons.service_other} onClick={() => toggleServiceButton('service_other')}>기타</TextButton>
           </ButtonGroup>
           {serviceButtons.service_other &&  
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
      </ContentSection>
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
                        navigate('/owner/mypage');
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
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 10px;
  margin-top: 10px;
  position: relative;
// background-color: #F4F4F4;
  // gap: 10px;
  // margin-top: 10px;
  // width: 100%;
  // position: relative;
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

const EditTitle = styled.div`
    color: var(--main-main600, #64A10F);
    font-family: Pretendard;
    font-size: 24px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
`;

const SubColumn = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 72px;
`;

const SubSubColumn = styled.div`
  display: grid;
  grid-template-columns: 1fr 2.4fr;
  gap: 93px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin: 10px 0;
`;

const TextButton = styled.button`
display: flex;
padding: 10px;
justify-content: center;
align-items: center;
gap: 10px;
border-radius: 5px;
border: 1px solid  #898989;

font-family: Pretendard;
font-size: 16px;
font-style: normal;
font-weight: 400;
line-height: normal;
transition: background-color 0.1s;

  background-color: ${({ $active }) => ($active ? "#64A10F" : "#FFF")};
  color: ${({ $active }) => ($active ? "#E9F4D0" : "#898989")};
  &:hover {
    background-color: ${({ $active }) => ($active ? "#64A10F" : "#E9F4D0")};
    color: ${({ $active }) => ($active ? "#E9F4D0" : "#898989")};
  }
`;

const ColumnLayout = styled.div`
  display: flex;
  flex-direction: column;
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
// position: sticky;
  // width: 100%;
  // height: 587px;
  // display: flex;
  // flex-direction: column;
  // align-items: flex-start;
  // transition: top 0.1s ease-out; // 부드러운 움직임을 위한 transition
  // justify-content: flex-start;
  // gap: 10px;
  // text-align: left;
  // font-size: 20px;
  // color: #e9f4d0;
  // font-family: Pretendard;
  // box-sizing: border-box;
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
  color: #000;
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

const ContentSection = styled.div`
display: flex;
flex-direction: row;
gap: 24px;
`;