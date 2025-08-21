import React from 'react'
import styled from 'styled-components'

const SaveBtn = ({onClick}) => {
  return (
    <Savebutton onClick={onClick}>
        저장하기
    </Savebutton>
  )
}

export default SaveBtn

const Savebutton = styled.button`
width: 100%;
position: relative;
background-color: #d9d9d9;
height: 45px;
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
padding: 0 12px;
box-sizing: border-box;
text-align: center;
font-size: 16px;
color: #000;
font-family: Pretendard;
border: none;
`;