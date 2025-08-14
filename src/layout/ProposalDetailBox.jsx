import React from 'react'
import styled from 'styled-components';

const ProposalDetailBox = ({title, children}) => {
  return (
    <BoxSection>
        <BoxTitle>{title}</BoxTitle>
        <ContentBox>{children}</ContentBox>
    </BoxSection>
  )
}

export default ProposalDetailBox

const BoxSection = styled.div`
width: 100%;
position: relative;
display: flex;
flex-direction: column;
align-items: flex-start;
justify-content: flex-start;
gap: 10px;
text-align: left;
font-size: 20px;
color: #000;
font-family: Pretendard;
`;

const BoxTitle = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
font-weight: 600;
`;

const ContentBox = styled.div`
align-self: stretch;
border: 1px solid #d9d9d9;
display: flex;
flex-direction: row;
align-items: center;
justify-content: flex-start;
padding: 15px 20px;
font-size: 16px;
`;