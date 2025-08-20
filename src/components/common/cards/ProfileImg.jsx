import React from 'react'
import styled from 'styled-components';
import useOwnerProfile from '../../../hooks/useOwnerProfile';

const ProfileImg = ( {profileImage}) => {

  return (
    <ProfileWrapper>
        <ProfileSection src= {profileImage} alt ="대표 사진" />
    </ProfileWrapper>
  )
}

export default ProfileImg

const ProfileSection = styled.img`
  width: 107px;;
position: relative;
border-radius: 50%;
background-color: white; // 사장님 프로필 이미지 뒷배경 
height: 107px;
`;

const ProfileWrapper = styled.div`
width: 107px;
height: 107px;
`;
