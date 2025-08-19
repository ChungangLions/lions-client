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

const ProposalDetail = () => {
  const location = useLocation();
  const { organization } = location.state || {};
  console.log(location.state);

  const { storeName, menuNames, storeImage, error } = useOwnerProfile();

  {/* item 2개 나중에 컴포넌트로 빼야됨 */}
  const ConditionItem = ({ title, children }) => (
    <ConditionWrapper>
      <ConditionTitle>{title}</ConditionTitle>
      <ConditionContent>{children}</ConditionContent>
    </ConditionWrapper>
  );

  const TimeItem = ({ day, children }) => (
    <TimeWrapper>
      <TimeTitle>{day}</TimeTitle>
      <TimeContent>{children}</TimeContent>
    </TimeWrapper>
);
  
  return (
    <ProposalContainer>
      <ProposalCard>
        <ProposalWrapper>
          <ProposalHeader>
            <HeaderTitle>
            <p>{organization.university} {organization.department} {organization.council_name}</p>
            <p>제휴 요청 제안서</p>
            </HeaderTitle>
            <HeaderContent>
              <p>안녕하세요.</p>
              <p>귀 학생회의 적극적인 학생 복지 및 교내 활동 지원에 항상 감사드립니다.</p>
              <p>저희 ‘{storeName}’는 학생들에게 더 나은 혜택을 제공하고자, 아래와 같이 제휴를 제안드립니다.</p>
            </HeaderContent>
          </ProposalHeader>
          <LineDiv />
          <SectionWrapper>
            <OwnerInfo/>
            {/* 제휴 유형, 제휴 조건, 기대 효과, 연락처 */}
            <DetailSection> 

              <DetailBox> 
                <Title> 
                  <div>제휴 유형</div>
                </Title> 
                <ContentBox>  
                  <IconBox>
                    할인형
                  </IconBox>
                  <IconBox>
                    타임형
                  </IconBox>
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

              <DetailBox>
                <Title> <div>제휴 조건</div> </Title>
                <ConditionsBox>
                  <ConditionGroup>
                    <ConditionItem title="적용 대상">
                      <p>중앙대학교 경영학부 소속 학생</p>
                      <p>(학생증 제시 시 적용)</p>
                    </ConditionItem>
                    <ConditionItem title="혜택 내용">
                      <p>아메리카노 10% 할인</p>
                      <p>3,500원 → 3,150원</p>
                    </ConditionItem>
                  </ConditionGroup>
                  <ConditionGroup>
                    <ConditionItem title="적용 시간대">
                      <TimeItem day="평일">
                        <p>09:00 - 11:00</p>
                        <p>19:00 - 21:00</p>
                      </TimeItem>
                      <TimeItem day="주말">
                        <p>11:00 - 13:00</p>
                      </TimeItem>
                    </ConditionItem>
                    <ConditionItem title="제휴 기간">
                      <p>2025년 9월 1일 ~ 11월 30일</p>
                      <p>(3개월)</p>
                    </ConditionItem>
                  </ConditionGroup>
                </ConditionsBox>
              </DetailBox>

              <DetailBox>
                <Title> <div>기대 효과</div></Title>
                  <InputBox>
                  
                  </InputBox>
              </DetailBox>

              <DetailBox>
                <Title> <div>연락처</div> </Title>
                <InputBox>
                  
                </InputBox>
              </DetailBox>
              

              
            </DetailSection>
          </SectionWrapper>
          <Signature>'{storeName}' 드림</Signature>
        </ProposalWrapper>
      </ProposalCard>

      {/* 오른쪽 섹션 */}
        <ReceiverSection>
          <CardSection ButtonComponent={FavoriteBtn}/>
          <ButtonWrapper>
            <EditBtn />
            <SaveBtn />
          </ButtonWrapper>
          <SendProposalBtn/>
        </ReceiverSection>
    </ProposalContainer>

  )
}

export default ProposalDetail


const ProposalContainer= styled.div`
  display: flex;
  flex-direction: row; 
  gap:19px;
  align-items: flex-start;
`;

const ProposalCard = styled.div`
  width: 100%;
  position: relative;
  border: 1px solid none;
  box-sizing: border-box;
  height: 1211px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 31px 58px;
  text-align: center;
  font-size: 24px;
  color: #000;
  font-family: Pretendard;
  background-color: #F4F6F4;
`;

const ProposalWrapper = styled.div`
  width: 797px;
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
width: 100%;
position: sticky;
display: flex;
flex-direction: column;
gap: 10px;
text-align: left;
font-size: 18px;
color: #000;
font-family: Pretendard;
top: 80px;
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
justify-content: center;

div {
    position: relative;
    font-weight: 600;
  }
`;

const DetailBox = styled.div`
align-self: stretch;
display: flex;
flex-direction: column;
align-items: flex-start;
justify-content: flex-start;
gap: 10px;
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

const IconBox = styled.div`
width: 122px;
border-radius: 4.55px;
background-color: #fff;
height: 122px;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
padding: 10px 4.6px 10.9px;
box-sizing: border-box;
gap: 14.1px;
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
  align-items: center;
  justify-content: flex-start;
  padding: 15px 20px;
  gap: 62px;
  font-size: 16px;
  color: #898989;
`;

const ConditionGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 39px;
`;

const ConditionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 37px;
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

const InputText = styled(InputBox)`
  margin: 0;
  font-family: inherit;
  font-size: inherit;
  padding-left: 21px;
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