import React from 'react';
import styled from 'styled-components';

function SuggestItem({ profileImage, school, department, title, date }) {
    return (
      <SuggestWrapper>
        <SuggestInfo>
          <ProfileImg
            src={profileImage || '/default_profile.png'}
            // alt="Profile"
          />
          <SuggestTitle>
            <div>{school}</div>
            <div>{department}</div>
            <div>'{title}'</div>
          </SuggestTitle>
          <SuggestBtn>열람</SuggestBtn>
        </SuggestInfo>
        <SuggestDate>
          <DateLabel>수신일</DateLabel>
          <DateValue>{date}</DateValue>
        </SuggestDate>
      </SuggestWrapper>
    );
  }

export default SuggestItem;

const SuggestWrapper = styled.div `
    display: flex;
    flex-direction: column;
    background: #D2D2D2;
    gap: 32px;
    padding: 30px;
    width: 447px;
    height: 211px;

`;

const ProfileImg = styled.img `
    border-radius: 50%;
    height: 107px;
    width: 107px;
    object-fit: cover;
    background: #959494;
`;

const SuggestInfo = styled.div `
    display: flex;
    justify-content: space-between;
    align-items: end;
    padding: 10px;
    gap: 30px;
`;

const SuggestTitle = styled.div `
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex: 1;
    font-weight: 600;
    font-size: 18px;
`;

const SuggestBtn = styled.button`
    // width: 28px;
    // height: 19px;
    padding: 10px;
    font-weight: 400;
    font-size: 16px;
    border: 1px solid black;
    background: #D2D2D2;
    cursor: pointer;
`;

const SuggestDate = styled.div `
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 198.9px;
    gap: 68.9px;
    padding-left: 6px;
    font-size 16px;
`;

const DateLabel = styled.div`
  font-weight: 600;
`;

const DateValue = styled.div`
  font-weight: 400;
`;