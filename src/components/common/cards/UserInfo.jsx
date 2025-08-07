import React from 'react'
import styled from 'styled-components';

const UserInfo = () => {

  return (
    <CardContainer>
      <ProfileImage>사진</ProfileImage>
      <CardTitle>이름 </CardTitle>
        <InfoContainer>
            내용
        </InfoContainer>
    </CardContainer>
  );
};

export default UserInfo;

const CardContainer = styled.div`

`;

const ProfileImage = styled.div`

`;

const CardTitle = styled.div`
`;


const InfoContainer = styled.div`

`;

