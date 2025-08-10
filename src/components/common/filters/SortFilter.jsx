// '찜 많은 순' 같은 정렬 버튼 

import React from 'react'
import usefilterStore from '../../../stores/filterStore'
import styled from 'styled-components';

const SortFilter = ({listType, sortType, btnName, btnStyle}) => {
    const sortBy = usefilterStore((state) => state.sortBy);

    const handleClick = () => {
        sortBy(listType, sortType);
    }
  return (
    <FilterButton onClick={handleClick} style={btnStyle}>
        {btnName}
    </FilterButton>
  )
};

export default SortFilter;

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
`;