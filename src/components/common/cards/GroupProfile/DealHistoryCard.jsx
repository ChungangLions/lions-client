// DealHistoryCard.jsx
import React from 'react';
import styled from 'styled-components';

const DealHistoryCard = ({ storeName, period }) => {
    return (
        <HistoryWrapper>
            <BoxContainer>
            <StoreImage />
            <TextContainer>
                <NameWrapper>
                 {storeName}
                </NameWrapper>
                <PeriodContainer>
                    <PeriodText>{period}</PeriodText>
                </PeriodContainer>
            </TextContainer>
            </BoxContainer>
        </HistoryWrapper>
    );
};

export default DealHistoryCard;

const HistoryWrapper = styled.div`
width: calc((100% - 3 * 24px) / 4);
position: relative;
display: flex;
flex-direction: row;
align-items: flex-start;
justify-content: flex-start;
flex-wrap: wrap;
align-content: flex-start;
gap: 18px 24px;
text-align: left;
font-size: 16px;
color: #1a2d06;
font-family: Pretendard;
`;

const BoxContainer = styled.div`
width: 203px;
display: flex;
flex-direction: column;
align-items: flex-start;
justify-content: flex-start;
gap: 5px;
`;

const StoreImage = styled.div`
align-self: stretch;
position: relative;
background-color: #d9d9d9;
height: 137px;
`;

const TextContainer = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
justify-content: flex-start;
gap: 2px;
`;

const NameWrapper = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
font-weight: 600;
position: relative;
`;

const PeriodContainer = styled.div`
align-self: stretch;
display: flex;
flex-direction: row;
align-items: center;
justify-content: flex-start;
gap: 10px;
text-align: center;
color: #898989;
`;

const PeriodText = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: flex-start;
`;