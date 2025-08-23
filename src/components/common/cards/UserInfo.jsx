import React from 'react'
import styled from 'styled-components';
import ProfileImage from './ProfileImg';
import sampleImage from '../../../assets/images/중앙대.svg';

const UserInfo = ({organization}) => {

  return (
    <UserInfoWrapper>
      <UserSection>
        <ProfileImage profileImage={organization.photos[0]} />
        <NameWrapper>
          {/*<p>{organization?.university}</p>*/}
          <p>중앙대학교 서울캠퍼스</p>
          <p>{organization?.council_name}</p> 
          <p>{organization?.department}</p>
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
