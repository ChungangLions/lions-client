import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

// 날짜 파싱 함수
const formatDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}. ${month}. ${day}`;
  } catch (error) {
    console.error('날짜 파싱 오류:', error);
    return dateString; // 파싱 실패 시 원본 문자열 반환
  }
};

const STATUS_MAP = {
    UNREAD: "미열람",
    READ: "열람",
    PARTNERSHIP: "제휴체결",
    REJECTED: "거절"
  };

function ReceiveProposalCard({ proposalGroup, onClick }) {
    const handleClick = () => {
        if (onClick) {
            onClick(proposalGroup);
        }
    };

    return (
        <Cardwrapper onClick={handleClick} style={{ cursor: 'pointer' }}>
            <ContentWrapper>
                <TextWrapper>
                    <DateWrapper>
                        <SendText>수신일</SendText>
                        <DateText>{formatDate(proposalGroup.created_at)}</DateText>
                    </DateWrapper>
                    <NameWrapper>
                        <NameText>{proposalGroup.university_name} {proposalGroup.department} '{proposalGroup.council_name}' </NameText>
                    </NameWrapper>
                </TextWrapper>
                <ButtonWrapper>{STATUS_MAP[proposalGroup.status]}</ButtonWrapper>
            </ContentWrapper>
        </Cardwrapper>
  );
}

export default ReceiveProposalCard;

const Cardwrapper = styled.div`
display: flex;
width: 400px;
height: 173px;
padding: 25px 18px 25px 30px;
flex-direction: column;
justify-content: center;
align-items: flex-start;
gap: 10px;
flex-shrink: 0;
border-radius: 5px;
border: 1px solid #E7E7E7;
box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
`;

const ContentWrapper = styled.div`
display: flex;
// width: 281px;
flex-direction: column;
align-items: flex-start;
gap: 30px;
`;

const TextWrapper = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
gap: 10px;
align-self: stretch;
`;

const DateWrapper = styled.div`
display: flex;
width: 198.903px;
align-items: center;
gap: 30px;
color: #1A2D06;
`;

const NameWrapper = styled.div`
align-self: stretch;
`;

const NameText = styled.div`
color: var(--main-main950, #1A2D06);
font-family: Pretendard;
font-size: 18px;
font-style: normal;
font-weight: 600;
line-height: normal;
`;

const SendText = styled.div`
color: var(--main-main950, #1A2D06);
font-family: Pretendard;
font-size: 16px;
font-style: normal;
font-weight: 600;
line-height: normal;
`;

const DateText = styled.div`
color: var(--main-main950, #1A2D06);
font-family: Pretendard;
font-size: 16px;
font-style: normal;
font-weight: 400;
line-height: normal;
`;

const ButtonWrapper = styled.div`
display: flex;
padding: 10px;
justify-content: flex-end;
align-items: center;
gap: 10px;
border-radius: 500px;
border: 1px solid var(--main-main600, #70AF19);
color: var(--main-main600, #70AF19);
font-family: Pretendard;
font-size: 16px;
font-style: normal;
font-weight: 400;
line-height: normal;
`;