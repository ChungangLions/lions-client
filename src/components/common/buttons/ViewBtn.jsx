import React from 'react'
import styled from 'styled-components';

const ViewBtn = ({onClick}) => {
  return (
    <Viewbutton onClick={onClick}>
      열람
    </Viewbutton>
  )
}

export default ViewBtn

const Viewbutton = styled.button`
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
&: hover {
background-color:  #e9f4d0;
}
cursor: pointer;
`;