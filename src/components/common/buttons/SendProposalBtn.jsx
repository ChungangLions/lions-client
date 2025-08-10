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
background-color: #d9d9d9;
height: 45px;
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
padding: 12px 195px;
box-sizing: border-box;
text-align: left;
font-size: 16px;
color: #000;
font-family: Pretendard;
border: none;
`;