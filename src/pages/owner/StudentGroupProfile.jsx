import React from 'react'
import styled from 'styled-components'
import ProfileImg from '../../components/common/cards/ProfileImg'
import FavoriteBtn from '../../components/common/buttons/FavoriteBtn'
import { useLocation } from 'react-router-dom'

const StudentGroupProfile = () => {
  const location = useLocation();
  const { organization } = location.state || {};
  console.log(location.state);
  

  return (
    <PageContainer>
    <ProfileSection>
      <ProfileGroup>
          <ImageContainer />
          <ContentWrapper>
            <ContentTitle>
              {organization?.university}
            </ContentTitle>
            <DetailSection>
              {organization?.council_name}
            </DetailSection>
          </ContentWrapper>
        
      </ProfileGroup>
      <ButtonGroup>
        <FavoriteBtn/>
      </ButtonGroup>
    </ProfileSection>
    <RecordSection>
      <Title>
        제휴 이력
      </Title>
      <StoreSection>

      </StoreSection>
    </RecordSection>
    </PageContainer>
  )
}

export default StudentGroupProfile

const PageContainer = styled.div`
gap: 59px;
display: flex;
flex-direction: row;
width: 100%;
justify-content: center;
align-items: flex-start;
`;
const ProfileSection = styled.div`
width: 363px;;
position: relative;
display: flex;
flex-direction: column;
align-items: center;
justify-content: flex-start;
gap: 40px;
text-align: center;
font-size: 24px;
color: #000;
font-family: Pretendard;
`;

const ProfileGroup = styled.div`
align-self: stretch;
display: flex;
flex-direction: column;
align-items: center;
justify-content: flex-start;
gap: 30px;
`;

const ButtonGroup = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: flex-start;
gap: 15px;
text-align: left;
font-size: 16px;
`;

const RecordSection = styled.div`
width: 885px;
position: relative;
display: flex;
flex-direction: column;
align-items: flex-start;
justify-content: flex-start;
gap: 10px;
text-align: left;
font-size: 24px;
color: #000;
font-family: Pretendard;
`;

const Title = styled.div`
align-self: stretch;
position: relative;
font-weight: 600;
`;

const StoreSection = styled.div`
align-self: stretch;
display: flex;
flex-direction: row;
align-items: flex-start;
justify-content: flex-start;
flex-wrap: wrap;
align-content: flex-start;
gap: 25px 24px;
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
flex-direction: column;
align-items: center;
justify-content: center;
gap: 10px;
`;

const ContentTitle = styled.div`
position: relative;
font-weight: 600;
`;

const DetailSection = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
justify-content: flex-start;
gap: 7px;
text-align: left;
font-size: 16px;
`;