import React from 'react';
import styled from 'styled-components';

function SuggestItem({ profileImage, school, title, date }) {
  return (
    <SuggestWrapper>
        <SuggestInfo>
            <ProfileImg
                src={profileImage || '/default_profile.png'}
                alt="Profile"
            />
            <SuggestTitle>
                <div>{school}</div>
                <div>{title}</div>
            </SuggestTitle>
            <SuggestBtn>열람</SuggestBtn>
        </SuggestInfo>
        
        <SuggestDate>
            <div>작성일</div>
            <div>{date}</div>
        </SuggestDate>
    </SuggestWrapper>
  );
}

export default SuggestItem;

const SuggestWrapper = styled.div `
    display: flex;
    flex-direction: column;
    border: 1px solid black;
    // width: 350px;
    // height: 150px;

`;

const ProfileImg = styled.img `
    border-radius: 100px;
    height: 48px;
    width: 48px;
`;

const SuggestInfo = styled.div `
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 10px;
`;

const SuggestTitle = styled.div ``;

const SuggestBtn = styled.button``;

const SuggestDate = styled.div `
    display: flex;
`;