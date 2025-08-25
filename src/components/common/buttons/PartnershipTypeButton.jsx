import React from 'react'
import styled from "styled-components";

const PartnershipTypeBox = ({children, IconComponent, isSelected = false, onClick, disabled = false, customColor}) => {
  return (
    <IconBox onClick={disabled ? undefined : onClick} isSelected={isSelected} disabled={disabled} customColor={customColor}>
        <Text isSelected={isSelected} disabled={disabled} customColor={customColor}>
          {children}
        </Text>
        <Icon isSelected={isSelected} disabled={disabled} customColor={customColor}>
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
color: ${props => props.customColor ? props.customColor : (props.isSelected ? '#e9f4d0' : '#898989')};
font-family: Pretendard;
gap: 14.1px;
text-align: center;
background-color: ${props => props.isSelected ? '#64a10f' : 'transparent'};
cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
transition: all 0.2s ease;
opacity: ${props => props.disabled && !props.customColor ? 0.6 : 1};

&:hover {
  background-color: ${props => props.disabled ? 'transparent' : '#e9f4d0'};
  border: 0.5px solid ${props => props.customColor ? props.customColor : (props.isSelected ? '#64a10f' : '#898989')};
  color: ${props => props.customColor ? props.customColor : (props.disabled ? '#898989' : '#898989')};
}

&:disabled {
  cursor: not-allowed;
  opacity: ${props => props.customColor ? 1 : 0.6};
}
`;

const Icon = styled.div`
width: 68px;
position: relative;
max-height: 100%;
color: ${props => props.customColor ? props.customColor : 'inherit'};
opacity: ${props => props.disabled && !props.customColor ? 0.6 : 1};
`;

const Text = styled.div`
position: relative;
font-size: 16px;
font-weight: 600;
color: ${props => props.customColor ? props.customColor : 'inherit'};
opacity: ${props => props.disabled && !props.customColor ? 0.6 : 1};
`;