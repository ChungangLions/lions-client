import React from 'react'
import styled from 'styled-components';
import ProfileImage from './ProfileImage';

const UserInfo = () => {

  return (
    <UserInfoWrapper>
      <UserSection>
        <ProfileImage />
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


const NameWrapper = styled.div`
  position: relative;
  font-weight: 600;
  
  p {
    margin: 0;
  }
`;
