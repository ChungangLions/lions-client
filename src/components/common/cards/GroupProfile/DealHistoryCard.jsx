// DealHistoryCard.jsx
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

const DealHistoryCard = ({ storeName, period, storeImage }) => {
//      const { id: groupProfileId } = useParams();
//     const navigate = useNavigate();
//   const handleCardClick = (id) => {
//     navigate(`/store-profile/`, { // 경로 수정 필요
//       state: { userType: "student" }
//     });
//   };

//   useEffect(() => {
//     if (groupProfileId) {
//       setProfileInfo(groupProfileId); // 프로필 정보 fetch해서 store에 업데이트
//     }
//   }, [groupProfileId, setProfileInfo]);

    return (
        //<HistoryWrapper key={store.id} onClick={() => handleCardClick(store.id)} >
        <HistoryWrapper >
            <StoreImage src={storeImage} />
            <TextContainer>
                <NameWrapper>
                 {storeName}
                </NameWrapper>
                <PeriodContainer>
                    <PeriodText>{period}</PeriodText>
                </PeriodContainer>
            </TextContainer>
        </HistoryWrapper>
    );
};

export default DealHistoryCard;

const HistoryWrapper = styled.div`
width: 203px;
position: relative;
display: flex;
flex-direction: row;
align-items: flex-start;
justify-content: flex-start;
flex-wrap: wrap;
align-content: flex-start;
gap: 15px;
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

const StoreImage = styled.img`
width: 100%;
border-radius:5px;
    height: 137px;
    align-self: stretch;
    background: ${({ src }) =>
      src && src.includes('/default.png') ? '#D9D9D9' : '#fff'};
`;

const TextContainer = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
justify-content: flex-start;
gap: 2px;
`;

const NameWrapper = styled.div`
color: #1A2D06;
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
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