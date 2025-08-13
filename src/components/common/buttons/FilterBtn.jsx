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
`;