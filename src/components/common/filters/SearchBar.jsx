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

`;

const SearchInput = styled.input`

`;