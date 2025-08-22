import React from 'react'
import styled from 'styled-components';

const StatusBtn = ({onClick, children}) => {
  return (
    <Statusbutton onClick={onClick}>
      {children}
    </Statusbutton>
  )
}

export default StatusBtn

const Statusbutton = styled.button`
position: relative;
border-radius: 20px;
border: 1px solid #70af19;
box-sizing: border-box;
width: 100%;
display: flex;
flex-direction: row;
align-items: center;
justify-content: flex-end;
padding: 10px;
text-align: left;
font-size: 16px;
color: #70af19;
font-family: Pretendard;
background-color: white;

/* 카드 내 위치 조정 */
margin-top: -10px;
`;