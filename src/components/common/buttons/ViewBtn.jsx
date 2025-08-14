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
display: flex;
padding: 10px;
justify-content: center;
align-items: center;
gap: 10px;
border: 1px solid #000;
background: transparent;

color: #000;
font-family: Pretendard;
font-size: 16px;
font-style: normal;
font-weight: 400;
line-height: normal;
`;