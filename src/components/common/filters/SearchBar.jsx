import React, { useState } from 'react'
import styled from 'styled-components';

const SearchBar = () => {
    const [search, setSearch] = useState("");

    const onChange = (e) => {
        setSearch(e.target.value); // 입력값 변경 시 상태 업데이트
    }

  return (
    <SearchSection>
        <SearchInput
        type = "text" 
        value= {search}
        onChange = {onChange}
        placeholder = "검색"
        />
    </SearchSection>
  )
}

export default SearchBar

const SearchSection = styled.div`
width: 100%;
position: relative;
border-radius: 22.5px;
background-color: #d9d9d9;
height: 45px;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 16px;
`;
