import React from 'react'
import styled from 'styled-components';
import ProfileImage from './ProfileImg';
import sampleImage from '../../../assets/images/중앙대.svg';

const UserInfo = ({organization}) => {

  // 두 가지 데이터 구조를 모두 지원
  const getProfileImage = () => {
    if (!organization?.photos || organization.photos.length === 0) {
      console.log("사진 없음");
      return null;
    }
    
    const firstPhoto = organization.photos[0];
    
    // groupProfile 형태: photos[0].image
    if (firstPhoto && typeof firstPhoto === 'object' && firstPhoto.image) {
      return firstPhoto.image;
    }
    
    // organization 형태: photos[0] (직접 이미지 URL)
    if (typeof firstPhoto === 'string') {
      return firstPhoto;
    }
    
    return null;
  };

  const profileImage = getProfileImage();
  console.log('Profile image:', profileImage);

  return (
    <UserInfoWrapper>
      <UserSection>
        <ProfileImage profileImage={profileImage} />
        <NameWrapper>
          <p>{organization?.university_name}</p>
           <p>{organization?.department}</p>
          <p>{organization?.council_name}</p> 
         
        </NameWrapper>
        </UserSection>
    </UserInfoWrapper>
  );
};

export default UserInfo;

const UserInfoWrapper = styled.div`
align-self: stretch;
display: flex;
flex-direction: column;
align-items: flex-start;
justify-content: flex-start;
`;

const UserSection = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: flex-start;
gap: 30px;
`;


const NameWrapper = styled.div`
  position: relative;
  font-weight: 600;
  
  p {
    margin: 0;
  }
`;
