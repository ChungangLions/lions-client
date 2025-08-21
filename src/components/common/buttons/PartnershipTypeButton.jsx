import React from 'react'
import styled from "styled-components";

const PartnershipTypeBox = ({children, IconComponent, isSelected = false, onClick, disabled = false}) => {
  return (
    <IconBox onClick={disabled ? undefined : onClick} isSelected={isSelected} disabled={disabled}>
        <Text isSelected={isSelected} disabled={disabled}>
          {children}
        </Text>
        <Icon isSelected={isSelected} disabled={disabled}>
          <IconComponent size={68}/>
        </Icon>
    </IconBox>
  )
}

export default PartnershipTypeBox

const IconBox = styled.button`
width: 122px;
border-radius: 4.55px;
border: 0.5px solid ${props => props.isSelected ? '#64a10f' : '#898989'};
box-sizing: border-box;
height: 122px;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
padding: 10px 4.6px 10.9px;
gap: 14.1px;
color: ${props => props.isSelected ? '#e9f4d0' : '#898989'};
font-family: Pretendard;
gap: 14.1px;
text-align: center;
background-color: ${props => props.isSelected ? '#64a10f' : 'transparent'};
cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
transition: all 0.2s ease;
opacity: ${props => props.disabled ? 0.6 : 1};

&:hover {
  background-color: ${props => props.disabled ? 'transparent' : '#e9f4d0'};
  border: 0.5px solid ${props => props.isSelected ? '#64a10f' : '#898989'};
  color: ${props => props.disabled ? '#898989' : '#898989'};
}

&:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
`;

const Icon = styled.div`
width: 68px;
position: relative;
max-height: 100%;
color: inherit;
opacity: ${props => props.disabled ? 0.6 : 1};
`;

const Text = styled.div`
position: relative;
font-size: 16px;
font-weight: 600;
opacity: ${props => props.disabled ? 0.6 : 1};
`;