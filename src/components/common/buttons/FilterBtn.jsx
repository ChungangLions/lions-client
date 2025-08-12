import React from 'react'
import styled from 'styled-components'

const FilterBtn = ({children, onClick}) => {
  return (
    <FilterButton onClick={onClick}>
        {children}
    </FilterButton>
  )
}

export default FilterBtn

const FilterButton = styled.button`
position: relative;
border-radius: 5px;
border: 1px solid #000;
box-sizing: border-box;
width: 100%;
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
padding: 10px;
text-align: left;
font-size: 16px;
color: #000;
font-family: Pretendard;
background-color: white;
`;