import React from 'react'
import styled from 'styled-components';

const ProfileImg = () => {
  return (
    <ProfileWrapper>
        <ProfileSection />
    </ProfileWrapper>
  )
}

export default ProfileImg

const ProfileSection = styled.div`
  width: 107px;;
position: relative;
border-radius: 50%;
background-color: #959494;
height: 107px;
`;

const ProfileWrapper = styled.div`
width: 107px;
height: 107px;
`;
