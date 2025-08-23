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
  border-radius: 5px;
  border: 1px solid #64a10f;
  box-sizing: border-box;
  height: 45px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  text-align: center;
  font-size: 16px;
  color: #64a10f;
  font-family: Pretendard;
  background-color: transparent;
  transition: all 0.2s ease;
  font-weight: 600;

  &:hover {
    background-color: #e9f4d0; 
  }

  &:active {
    background-color: #64a10f; 
    color: #e9f4d0;           
  }
`;