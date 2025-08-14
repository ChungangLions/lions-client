import React from 'react'
import styled from 'styled-components';
import SendProposalBtn from '../../components/common/buttons/SendProposalBtn';
import OwnerInfo from '../../components/common/cards/OwnerInfo';
import CardSection from '../../components/common/cards/OrgCardSection';
import EditBtn from '../../components/common/buttons/EditBtn';
import SaveBtn from '../../components/common/buttons/SaveBtn';
import ProposalDetailBox from '../../layout/ProposalDetailBox';
import FavoriteBtn from '../../components/common/buttons/FavoriteBtn';

const ProposalDetail = () => {
  return (
    <ProposalContainer>
      <ProposalCard>
        <ProposalWrapper>
          <ProposalHeader>
            <HeaderTitle>
            <p>중앙대학교 경영학부 학생회 ‘다움’</p>
            <p>제휴 요청 제안서</p>
            </HeaderTitle>
            <HeaderContent>
              <p>안녕하세요.</p>
              <p>귀 학생회의 적극적인 학생 복지 및 교내 활동 지원에 항상 감사드립니다.</p>
              <p>저희 ‘Middle Door’는 학생들에게 더 나은 혜택을 제공하고자, 아래와 같이 제휴를 제안드립니다.</p>
            </HeaderContent>
          </ProposalHeader>
          <LineDiv />
          <SectionWrapper>
            <OwnerInfo/>
            <DetailSection>
              <ProposalDetailBox title="제휴목적"/>
              <ProposalDetailBox title="제휴조건"/>
              <ProposalDetailBox title="기대 효과"/>
              <ProposalDetailBox title="연락처"/>
            </DetailSection>
          </SectionWrapper>
          <Signature>카페 어쩌구 드림</Signature>
        </ProposalWrapper>
      </ProposalCard>
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
  border: 1px solid #000;
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
width: 100%;
position: relative;
display: flex;
flex-direction: column;
align-items: flex-start;
justify-content: flex-start;
gap: 10px;
text-align: left;
font-size: 20px;
color: #000;
font-family: Pretendard;
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

