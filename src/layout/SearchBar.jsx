import React, { useState, useEffect } from 'react'
import styled from 'styled-components';
import { FiSearch } from "react-icons/fi";
import useStudentOrgStore from '../stores/studentOrgStore';

const SearchBar = () => {
    const [search, setSearch] = useState("");
    const { setSearchQuery } = useStudentOrgStore();

    const onChange = (e) => {
        setSearch(e.target.value); // 입력값 변경 시 상태 업데이트
    }

    useEffect(() => {
        const handler = setTimeout(() => {
            setSearchQuery(search);
        }, 200);
        return () => clearTimeout(handler);
    }, [search, setSearchQuery]); // 지연 방지, 한 번에 검색되게  

  return (
    <SearchSection>
        <SearchInput
        type = "text" 
        value= {search}
        onChange = {onChange}
        placeholder = "검색하기"
        />
        <SearchIcon />
    </SearchSection>
  )
}

export default SearchBar

const SearchSection = styled.div`
width: 563px;
border-radius: 22.5px;
border: 1px solid #64a10f;
box-sizing: border-box;
height: 45px;
display: flex;
flex-direction: row;
align-items: center;
justify-content: flex-start;
padding: 13px 30px;
position: relative;
gap: 10px;
color: #bcbcbc;

`;

const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 16px;
  position: relative;
  z-index: 0;
`;

const SearchIcon = styled(FiSearch)`
  width: 24px;
  position: absolute;
  margin: 0 !important;
  top: 10.5px;
  left: 519px;
  height: 24px;
  overflow: hidden;
  flex-shrink: 0;
  z-index: 1;
  color: #64A10F;
  
`;