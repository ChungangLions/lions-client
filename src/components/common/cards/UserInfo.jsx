import React from 'react'
import styled from 'styled-components';
import ProfileImage from './ProfileImg';

const UserInfo = ({organization}) => {

  return (
    <UserInfoWrapper>
      <UserSection>
        <ProfileImage />
        <NameWrapper>
          <p>{organization.university}</p> 
          <p>{organization.department}</p>
          <p>{organization.name}</p>
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