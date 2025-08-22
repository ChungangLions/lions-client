import React from 'react'
import styled from 'styled-components'

const SendProposalBtn = ({onClick}) => {
  return (
    <Sendbutton onClick={onClick}>
    전송하기
    </Sendbutton>
  )
}

export default SendProposalBtn

const Sendbutton = styled.button`
width: 100%;
position: relative;
border-radius: 5px;
background-color: #64a10f;
border: none;
height: 45px;
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
padding: 0 12px;
box-sizing: border-box;
text-align: center;
font-size: 16px;
color: #e9f4d0;
font-family: Pretendard;
font-weight: 600;

&: hover {
    background-color: #4c7b10;
  }

  &: active {
    background-color: #3f6113;
  }
`;