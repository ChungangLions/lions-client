import React from 'react'
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const LoginBtn = ({ text, to }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to);
  };

  return (
    <StartButton onClick={handleClick}>
      {text}
    </StartButton>
  )
}

export default LoginBtn

const StartButton = styled.button`
align-self: stretch;
border-radius: 5px;
border: 3px solid #64a10f;
box-sizing: border-box;
height: 66px;
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
padding: 10px;
font-weight: 600;
font-size: 20px;
background-color: white;
color: #64a10f;
cursor: pointer;

&:hover {
background-color: #e9f4d0;
}

&:active {
  background-color: #64a10f;
  color: #cef685;
  }
  
`;