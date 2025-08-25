import React, { useState, useEffect } from 'react'
import styled from 'styled-components';
import { FiSearch } from "react-icons/fi";
import { useLocation } from 'react-router-dom';
import useStudentOrgStore from '../stores/studentOrgStore';
import useVenueStore from '../stores/venueStore';

const SearchBar = () => {
    const [search, setSearch] = useState("");
    const location = useLocation(); // 경로 바뀌면 검색 필드 초기화
    const { setOrgSearchQuery } = useStudentOrgStore();
    const { setStoreSearchQuery } = useVenueStore();

    const onChange = (e) => {
        setSearch(e.target.value);
    }

    const handleSearch = () => {
        const query = search?.trim() ?? "";
        setOrgSearchQuery(query);
        setStoreSearchQuery(query);
    }

    // 검색어 초기화
    useEffect(() => {
        setSearch("");
        setOrgSearchQuery("");
        setStoreSearchQuery("");
    }, [location.pathname, setOrgSearchQuery, setStoreSearchQuery]);

  return (
    <SearchSection>
        <SearchInput
        type = "text" 
        value= {search}
        onChange = {onChange}
        onKeyDown={(e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
            }
        }}
        placeholder = "검색하기"
        />
        <SearchIcon 
            onClick={handleSearch}
            role="button"
            aria-label="검색"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSearch();
                }
            }}
        />
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
  color: #1a2d06;
  
  &::placeholder {
    color: #bcbcbc;
  }
    margin-left: -10px;
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