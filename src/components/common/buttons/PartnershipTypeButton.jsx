import React from 'react'
import styled from "styled-components";

const PartnershipTypeBox = ({children, IconComponent, isSelected = false, onClick}) => {
  return (
    <IconBox onClick={onClick} isSelected={isSelected}>
        <Text isSelected={isSelected}>
          {children}
        </Text>
        <Icon isSelected={isSelected}>
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
cursor: pointer;
transition: all 0.2s ease;

&:hover {
background-color: #e9f4d0;
border: 0.5px solid ${props => props.isSelected ? '#64a10f' : '#898989'};
color:#898989;
}

`;

const Icon = styled.div`
width: 68px;
position: relative;
max-height: 100%;
color: inherit;
`;

const Text = styled.div`
position: relative;
font-size: 16px;
font-weight: 600;
`;