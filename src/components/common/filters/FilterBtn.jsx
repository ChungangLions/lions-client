import React from 'react'
import styled from 'styled-components'

const FilterBtn = ({children, onClick, active}) => {
  return (
    <FilterButton onClick={onClick} active={active}>
        {children}
    </FilterButton>
  )
}

export default FilterBtn

const FilterButton = styled.button`
background-color: ${({ active }) => (active ? '#64a10f' : 'white')};
border-radius: 5px;
border: 1px solid #64a10f;
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
padding: 10px;
color: ${({ active }) => (active ? '#e9f4d0' : '#64a10f')};
font-weight: 500;
font-size: 16px;
&:hover {
    background-color: #e9f4d0;
    color: #64a10f;
  }
`;