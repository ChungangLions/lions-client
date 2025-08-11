import React from 'react'
import styled from 'styled-components';

const FilterBtn = ({onClick}) => {
  return (
    <FilterButton onClick={onClick} />
  )
}

export default FilterBtn


const FilterButton = styled.button`
position: relative;
border-radius: 5px;
border: 1px solid #000;
box-sizing: border-box;
width: 80px;;
display: flex;
align-items: flex-start;
justify-content: flex-start;
padding: 10px;
text-align: left;
font-size: 16px;
color: #000;
font-family: Pretendard;
background-color: white;
`;
