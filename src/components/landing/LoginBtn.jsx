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
`;