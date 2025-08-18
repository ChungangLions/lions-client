import React from 'react'
import styled from 'styled-components'
import ProfileImg from '../../components/common/cards/ProfileImg'
import FavoriteBtn from '../../components/common/buttons/FavoriteBtn'
import { useLocation } from 'react-router-dom'
import SuggestDealBtn from '../../components/common/buttons/SuggestDealBtn'

const StudentGroupProfile = () => {
  const location = useLocation();
  const { organization } = location.state || {};
  console.log(location.state);
  

  return (
    <PageContainer>
      <PageWrapper>
      <ProfileSection>
        <ProfileGroup>
            <ImageContainer /> 
            <ContentWrapper>
              <OrganizationWrapper>
                <NoWrapItem>{organization?.university}</NoWrapItem>
                <NoWrapItem> {organization?.department} </NoWrapItem>
                <NoWrapItem> {organization?.council_name} </NoWrapItem>
              </OrganizationWrapper>
              <DetailSection>
              </DetailSection>
            </ContentWrapper>
        </ProfileGroup>
        <ButtonGroup>
          <FavoriteBox>
            <FavoriteBtn />
            찜하기
          </FavoriteBox>
          <SuggestDealBtn />
        </ButtonGroup>
      </ProfileSection>
      <RecordSection>
        <Divider />
        <RecordBox>
          <Title>
            제휴 이력
          </Title>
          <StoreSection>

          </StoreSection>
        </RecordBox>
      </RecordSection>
      </PageWrapper>
    </PageContainer>
  )
}

export default StudentGroupProfile

const OrganizationWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;   
  font-weight: 600;  
  align-items: center;
  jusitfy-content: center;
  text-align: center;
  width: 100%; 
`;

const NoWrapItem = styled.span`
text-align: center;
  white-space: nowrap;  
  &:not(:last-child) {
    margin-right: 8px; 
  }
`;

const PageContainer = styled.div`
width:100%;
position: relative;
display: block;
`;

const PageWrapper = styled.div`
gap: 59px;
display: flex;
flex-direction: row;
position: relative;
padding: 49px 59.5px 195px;
`;

const ProfileSection = styled.div`
position: relative;
display: flex;
flex-direction: column;
align-items: center;
gap: 40px;
text-align: center;
font-size: 24px;
color: #1a2d06;
font-family: Pretendard;
width:550px;
`;

const ProfileGroup = styled.div`
align-self: stretch;
display: flex;
flex-direction: column;
align-items: center;
gap: 30px;
width: 100%;
`;

const ButtonGroup = styled.div`
position: relative;
width: 100%;
display: flex;
flex-direction: row;
align-items: center;
justify-content: flex-start;
gap: 15px;
text-align: left;
font-size: 16px;
color: #898989;
font-family: Pretendard;
`;

const RecordSection = styled.div`
position: relative;
width: 100%;
display: flex;
flex-direction: row;
align-items: flex-start;
justify-content: flex-start;
gap: 24px;
text-align: left;
font-size: 24px;
color: #1a2d06;
font-family: Pretendard;
`;

const Title = styled.div`
align-self: stretch;
position: relative;
font-weight: 600;
white-space: nowrap;
`;

const StoreSection = styled.div`
align-self: stretch;
display: flex;
flex-direction: row;
align-items: flex-start;
justify-content: flex-start;
flex-wrap: wrap;
align-content: flex-start;
gap: 18px 24px;
font-size: 16px;
`;

const ImageContainer = styled.div`
width: 210px;
position: relative;
background-color: #d9d9d9;
height: 210px;
border-radius: 50%;
`;

const ContentWrapper = styled.div`
align-self: stretch;
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
width: 100%;
text-align: center
`;

const ContentTitle = styled.div`
position: relative;
font-weight: 600;
`;

const DetailSection = styled.div`
display: flex;
flex-direction: column;

gap: 7px;
text-align: left;
font-size: 16px;
`;

const Divider = styled.div`
width: 1px;
position: relative;
border-right: 1px solid #e7e7e7;
box-sizing: border-box;
height: 431px;
`;

const RecordBox = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
justify-content: flex-start;
gap: 18px;
`;

const FavoriteBox = styled.div`
width: 115px;
border-radius: 5px;
border: 1px solid #898989;
box-sizing: border-box;
height: 40px;
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
padding: 5px;
gap: 10px;
min-width: 85px;
`;
