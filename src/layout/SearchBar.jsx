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
width: 563px;
border-radius: 22.5px;
background-color: #d9d9d9;
height: 45px;
display: flex;
flex-direction: row;
align-items: flex-end;
justify-content: flex-start;
padding: 13px 30px;
box-sizing: border-box;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 16px;
`;
