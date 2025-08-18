import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components';

const SuggestDealBtn = ({ onClick }) => {
  const navigate = useNavigate();

  const goToSuggestPage = () => {
    navigate('/owner/proposal')
  }

  return (
    <SuggestButton onClick={goToSuggestPage}>
      제휴 제안하기
    </SuggestButton>
  )
}

export default SuggestDealBtn;

const SuggestButton = styled.button`
width: 100%;
position: relative;
border-radius: 5px;
background-color: #64a10f;
height: 40px;
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
padding: 5px;
box-sizing: border-box;
text-align: left;
font-size: 16px;
color: #e9f4d0;
font-family: Pretendard;
border: none;
font-weight : 600;
`;