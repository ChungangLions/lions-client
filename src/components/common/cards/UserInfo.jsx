import React from 'react'
import styled from 'styled-components';

const UserInfo = () => {

  return (
    <UserInfoWrapper>
      <UserSection>
        <ProfileWrapper>
          <ProfileImage />
        </ProfileWrapper>
        <NameWrapper>
          <p>중앙대학교</p> 
          <p>37대 경영학부 학생회</p>
          <p>‘다움’</p>
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
align-self: stretch;
display: flex;
flex-direction: row;
align-items: center;
justify-content: flex-start;
padding: 5px 0px;
gap: 30px;
`;

const ProfileImage = styled.div`
  width: 107px;;
position: relative;
border-radius: 50%;
background-color: #959494;
height: 107px;
`;

const NameWrapper = styled.div`
  position: relative;
  font-weight: 600;
  
  p {
    margin: 0;
  }
`;

const ProfileWrapper = styled.div`
width: 107px;
height: 107px;
`;

