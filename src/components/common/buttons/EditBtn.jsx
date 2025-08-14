import React from 'react'
import styled from 'styled-components';

const EditBtn = ({onClick}) => {
  return (
    <Editbutton onClick={onClick}>
        수정하기
    </Editbutton>
  )
}

export default EditBtn

const Editbutton = styled.button`
width: 100%;
position: relative;
background-color: #d9d9d9;
height: 45px;
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
padding: 13px 81px;
box-sizing: border-box;
text-align: left;
font-size: 16px;
color: #000;
font-family: Pretendard;
border: none;
`;