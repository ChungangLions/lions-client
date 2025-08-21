import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import SendProposalBtn from '../../components/common/buttons/SendProposalBtn';
import OwnerInfo from '../../components/common/cards/OwnerInfo';
import CardSection from '../../components/common/cards/OrgCardSection';
import EditBtn from '../../components/common/buttons/EditBtn';
import SaveBtn from '../../components/common/buttons/SaveBtn';
import FavoriteBtn from '../../components/common/buttons/FavoriteBtn';
import { useLocation } from 'react-router-dom';
import { getOwnerProfile } from '../../services/apis/ownerAPI';
import useUserStore from '../../stores/userStore';
import useOwnerProfile from '../../hooks/useOwnerProfile';
import InputBox from '../../components/common/inputs/InputBox';
import PartnershipTypeBox from '../../components/common/buttons/PartnershipTypeButton';

// 제휴 유형 아이콘
import { AiOutlineDollar } from "react-icons/ai"; // 할인형
import { MdOutlineAlarm, MdOutlineArticle, MdOutlineRoomService  } from "react-icons/md"; // 타임형, 리뷰형, 서비스제공형



const ProposalDetail = ({ isAI = false }) => {
  const location = useLocation();
  const { organization } = location.state || {};
  console.log(location.state);

  // AI 제안서인 경우 더 많은 정보를 가져옴
  const { storeName, menuNames, storeImage, error } = useOwnerProfile();

  // 제휴 유형 선택 상태 관리
  const [selectedPartnershipTypes, setSelectedPartnershipTypes] = useState([]);

  // 수정 모드 상태 관리
  const [isEditMode, setIsEditMode] = useState(false);

  // 제휴 유형 토글 함수
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

  // 제휴 유형 데이터
  const partnershipTypes = [
    { type: '할인형', icon: AiOutlineDollar },
    { type: '타임형', icon: MdOutlineAlarm },
    { type: '리뷰형', icon: MdOutlineArticle },
    { type: '서비스제공형', icon: MdOutlineRoomService }
  ];

  const TimeItem = ({ day, children }) => (
    <TimeWrapper>
      <TimeTitle>{day}</TimeTitle>
      <TimeContent>{children}</TimeContent>
    </TimeWrapper>
);
  
  return (
    <ProposalContainer>
      <ProposalSection>
        <ProposalWrapper>
          <ProposalHeader>
            <HeaderTitle>
            <p>{organization.university} {organization.department} {organization.council_name}</p>
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
                      onClick={() => togglePartnershipType(type)}
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
                      <ConditionInputBox 
                        defaultText="텍스트를 입력해주세요." 
                        width="100%"
                        border="1px solid white"
                      />
                    </ConditionItem>
                    <ConditionItem>
                      <ConditionLabel>혜택 내용</ConditionLabel>
                      <ConditionInputBox 
                        defaultText="텍스트를 입력해주세요." 
                        width="100%"
                        border="1px solid white"
                      />
                    </ConditionItem>
                  </ConditionGroup>
                  <ConditionGroup>
                    <ConditionItem>
                      <ConditionLabel>적용 시간대</ConditionLabel>
                      <ConditionInputBox 
                        defaultText="텍스트를 입력해주세요." 
                        width="100%"
                        border="1px solid white"
                        color = "black"
                      />
                    </ConditionItem>
                    <ConditionItem>
                      <ConditionLabel>제휴 기간</ConditionLabel>
                      <ConditionInputBox 
                        defaultText="텍스트를 입력해주세요." 
                        width="100%"
                        border="1px solid white"
                      />
                    </ConditionItem>
                  </ConditionGroup>
                </ConditionsBox>
              </DetailBox>

              {/* 기대효과  */}
              <DetailBox>
                <Title> <div>기대 효과</div></Title>
                  {isAI ? (
                    <InputBox />
                  ) : (
                    <InputText defaultText="텍스트를 입력해주세요."/>
                  )}
              </DetailBox>

              <DetailBox>
                <Title> <div>연락처</div> </Title>
                {isAI ? (
                  <InputBox />
                ) : (
                  <InputText defaultText="텍스트를 입력해주세요."/>
                )}
              </DetailBox>
              

              
            </DetailSection>
          </SectionWrapper>
          <Signature>'{storeName}' 드림</Signature>
        </ProposalWrapper>
      </ProposalSection>

      {/* 오른쪽 섹션 */}
        <ReceiverSection>
          <ReceiverWrapper>
            <CardSection 
              cardType={isAI ? undefined : "proposal"} 
              organization={organization} 
              ButtonComponent={isAI ? () => <FavoriteBtn /> : () => <FavoriteBtn organization={organization} />} 
            />
            <ButtonWrapper>
              <EditBtn onClick={toggleEditMode} isEditMode={isEditMode} />
              {isAI ? (
                // AI일 때: 수정 모드에 따라 다른 버튼 표시
                isEditMode ? (
                  <SaveBtn />
                ) : (
                  <SendProposalBtn/>
                )
              ) : (
                // 직접 작성할 때: 항상 저장 버튼 표시
                <ProposalSaveBtn>저장하기</ProposalSaveBtn>
              )}
            </ButtonWrapper>
            {/* AI일 때 수정 모드에서만, 직접 작성할 때는 항상 전송 버튼 표시 */}
            {((isAI && isEditMode) || !isAI) && <SendProposalBtn/>}
          </ReceiverWrapper>
        </ReceiverSection>
    </ProposalContainer>

  )
}

export default ProposalDetail

const ProposalSaveBtn = styled.button`
width: 100%;
position: relative;
border-radius: 5px;
border: 1px solid #64a10f;
box-sizing: border-box;
height: 45px;
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
padding: 13px 81px;
text-align: left;
font-size: 16px;
color: #64a10f;
background-color: white;
font-family: Pretendard;
font-weight: 600;

&:hover {
    background-color: #e9f4d0; 
  }

  &:active {
    background-color: #64a10f; 
    color: #e9f4d0;           
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
`;

const ReceiverWrapper = styled.div`
width: 100%;
box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.05);
border-radius: 5px;
border: 1px solid #e7e7e7;
box-sizing: border-box;
height: 241px;
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
  display: flex;
  flex-direction : row;
  gap: 8px;

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